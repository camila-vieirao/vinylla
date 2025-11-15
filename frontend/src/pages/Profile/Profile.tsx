import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaImage,
  FaMusic,
  FaHeadphones,
  FaUserPlus,
  FaUserCheck,
} from "react-icons/fa";
import { FiSettings, FiShare2, FiMessageCircle } from "react-icons/fi";
import { MdGroups, MdLibraryMusic } from "react-icons/md";
import Post from "../../components/Post/Post";
import api from "../../services/api/api";
import { toast } from "react-toastify";
import avatar from "../../assets/borabill_avatar.jpeg";

type ProfileTab = "posts" | "reviews" | "collection" | "groups";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  profilePicture: string;
  headerPicture: string;
  bio?: string;
}

interface Post {
  id: number;
  postText: string;
  postImg: string | null;
  postMention: string | null;
  userid: number;
  createdAt: string;
  user?: {
    name: string;
    username: string;
    profilePicture: string;
  };
}

interface FollowStats {
  followers: number;
  following: number;
}

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");
  const [user, setUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followStats, setFollowStats] = useState<FollowStats>({
    followers: 0,
    following: 0,
  });

  useEffect(() => {
    fetchProfileData();
  }, [username]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to view profile");
        navigate("/login");
        return;
      }

      const currentUserRes = await api.get("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(currentUserRes.data);

      if (!username) {
        setUser(currentUserRes.data);
        await Promise.all([
          fetchUserPosts(currentUserRes.data.id),
          fetchFollowStats(currentUserRes.data.id),
        ]);
        return;
      }

      try {
        const allUsersRes = await api.get("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const foundUser = allUsersRes.data.find(
          (u: User) => u.username === username
        );

        if (!foundUser) {
          toast.error("User not found");
          navigate("/");
          return;
        }

        setUser(foundUser);

        await Promise.all([
          fetchUserPosts(foundUser.id),
          fetchFollowStats(foundUser.id),
          checkIfFollowing(foundUser.id),
        ]);
      } catch (error: any) {
        if (error.response?.status === 404) {
          toast.error("User not found");
          navigate("/");
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async (userId: number) => {
    try {
      const postsRes = await api.get(`/api/posts/user/${userId}`);
      const userData = user || currentUser;

      const postsWithUser = postsRes.data.map((post: Post) => ({
        ...post,
        user: {
          name: userData?.name || "",
          username: userData?.username || "",
          profilePicture: userData?.profilePicture || "",
        },
      }));
      setUserPosts(postsWithUser);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setUserPosts([]);
    }
  };

  const fetchFollowStats = async (userId: number) => {
    try {
      const statsRes = await api.get(`/api/follows/${userId}/counts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFollowStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching follow stats:", error);
      setFollowStats({ followers: 0, following: 0 });
    }
  };

  const checkIfFollowing = async (userId: number) => {
    try {
      if (!currentUser || currentUser.id === userId) {
        setIsFollowing(false);
        return;
      }

      const followRes = await api.get(`/api/follows/${userId}/isFollowing`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setIsFollowing(followRes.data.isFollowing);
    } catch (error) {
      console.error("Error checking follow status:", error);
      setIsFollowing(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (!user || !currentUser) return;

      const token = localStorage.getItem("token");
      if (!token) return;

      if (isFollowing) {
        await api.delete(`/api/follows/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFollowing(false);
        setFollowStats((prev) => ({
          ...prev,
          followers: Math.max(0, prev.followers - 1),
        }));
        toast.success(`Unfollowed ${user.name}`);
      } else {
        await api.post(
          `/api/follows/${user.id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsFollowing(true);
        setFollowStats((prev) => ({
          ...prev,
          followers: prev.followers + 1,
        }));
        toast.success(`Now following ${user.name}`);
      }
    } catch (error: any) {
      console.error("Follow error:", error);
      toast.error(
        error.response?.data?.error || "Error updating follow status"
      );
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await api.delete(`/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Post deleted successfully!");
      setUserPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error deleting post");
    }
  };

  const handleSendMessage = () => {
    toast.info("Message feature coming soon!");
  };

  const handleShareProfile = () => {
    if (user) {
      const profileUrl = `${window.location.origin}/profile/${user.username}`;
      navigator.clipboard.writeText(profileUrl);
      toast.success("Profile link copied to clipboard!");
    }
  };

  const isCurrentUserProfile =
    currentUser && user && currentUser.id === user.id;

  const tabs = [
    {
      id: "posts" as ProfileTab,
      label: "Posts",
      icon: FaImage,
      count: userPosts.length,
    },
    { id: "reviews" as ProfileTab, label: "Reviews", icon: FaMusic, count: 0 },
    {
      id: "collection" as ProfileTab,
      label: "Collection",
      icon: MdLibraryMusic,
      count: 0,
    },
    { id: "groups" as ProfileTab, label: "Groups", icon: MdGroups, count: 0 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05060b] flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#05060b] flex items-center justify-center">
        <div className="text-white">User not found</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#05060b] text-white sm:pl-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,91,255,0.28),_transparent_55%)] opacity-70"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 lg:px-6 py-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="relative">
              <img
                src={
                  user.profilePicture &&
                  user.profilePicture !== "default-profile.png"
                    ? `http://localhost:3000/uploads/profile/${user.profilePicture}`
                    : avatar
                }
                alt={user.name}
                className="w-32 h-32 rounded-2xl object-cover border-4 border-white/20"
              />
              {isCurrentUserProfile && (
                <button
                  className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#7c5bff] to-[#ff6ec4] p-2 rounded-full hover:scale-110 transition"
                  onClick={() => navigate("/settings")}
                >
                  <FiSettings size={16} />
                </button>
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="text-white/60 mt-1">@{user.username}</p>
                  <p className="text-white/80 mt-3 max-w-md">
                    {user.bio || "No bio yet... Click edit to add one!"}
                  </p>
                </div>

                <div className="flex gap-3">
                  {!isCurrentUserProfile && currentUser && (
                    <>
                      <button
                        onClick={handleFollow}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all ${
                          isFollowing
                            ? "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                            : "bg-gradient-to-r from-[#7c5bff] to-[#ff6ec4] text-white hover:opacity-90"
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <FaUserCheck size={16} />
                            Following
                          </>
                        ) : (
                          <>
                            <FaUserPlus size={16} />
                            Follow
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleSendMessage}
                        className="flex items-center gap-2 p-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition"
                      >
                        <FiMessageCircle size={18} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleShareProfile}
                    className="p-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition"
                  >
                    <FiShare2 size={18} />
                  </button>
                </div>
              </div>

              <div className="flex gap-6 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{followStats.followers}</p>
                  <p className="text-white/60 text-sm">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{followStats.following}</p>
                  <p className="text-white/60 text-sm">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{userPosts.length}</p>
                  <p className="text-white/60 text-sm">Posts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all flex-shrink-0 ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-[#7c5bff] to-[#ff6ec4] text-white"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      <Icon size={18} />
                      {tab.label}
                      <span className="text-xs opacity-70">({tab.count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {isCurrentUserProfile && <div></div>}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              {activeTab === "posts" && (
                <div className="space-y-6">
                  {userPosts.length === 0 ? (
                    <div className="text-center py-12">
                      <FaImage
                        size={48}
                        className="mx-auto text-white/30 mb-4"
                      />
                      <h3 className="text-xl font-semibold mb-2">
                        No posts yet
                      </h3>
                      <p className="text-white/60">
                        {isCurrentUserProfile
                          ? "Share your first record with the community!"
                          : `${user.name} hasn't posted anything yet.`}
                      </p>
                    </div>
                  ) : (
                    userPosts.map((post) => (
                      <Post
                        key={post.id}
                        post={post}
                        onDelete={
                          isCurrentUserProfile ? handleDeletePost : undefined
                        }
                      />
                    ))
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="text-center py-12">
                  <FaMusic size={48} className="mx-auto text-white/30 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
                  <p className="text-white/60">
                    {isCurrentUserProfile
                      ? "Start reviewing your favorite albums!"
                      : `${user.name} hasn't written any reviews yet.`}
                  </p>
                </div>
              )}

              {activeTab === "collection" && (
                <div className="text-center py-12">
                  <MdLibraryMusic
                    size={48}
                    className="mx-auto text-white/30 mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">
                    {isCurrentUserProfile
                      ? "Your collection is empty"
                      : "Collection empty"}
                  </h3>
                  <p className="text-white/60">
                    {isCurrentUserProfile
                      ? "Add records to your collection"
                      : `${user.name} hasn't added any records to their collection yet.`}
                  </p>
                </div>
              )}

              {activeTab === "groups" && (
                <div className="text-center py-12">
                  <MdGroups size={48} className="mx-auto text-white/30 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {isCurrentUserProfile ? "Not in any groups" : "No groups"}
                  </h3>
                  <p className="text-white/60">
                    {isCurrentUserProfile
                      ? "Join communities to connect with others"
                      : `${user.name} hasn't joined any groups yet.`}
                  </p>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <h3 className="text-xl font-semibold mb-4">About</h3>
              <div className="space-y-3 text-sm text-white/60">
                <p>Joined recently</p>
                <p>{userPosts.length} posts</p>
                <p>{followStats.followers} followers</p>
                <p>{followStats.following} following</p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3 text-sm">
                {userPosts.length > 0 ? (
                  <>
                    <p className="text-white/60">
                      Posted {userPosts.length} times
                    </p>
                    <p className="text-white/60">Active this week</p>
                    {!isCurrentUserProfile && isFollowing && (
                      <p className="text-green-400">You follow this user</p>
                    )}
                  </>
                ) : (
                  <p className="text-white/60">No recent activity</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Profile;
