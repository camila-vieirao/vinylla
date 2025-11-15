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

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");
  const [user, setUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

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
        await fetchUserPosts(currentUserRes.data.id);
        return;
      }

      try {
        const userRes = await api.get(`/api/profile/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);
        await fetchUserPosts(userRes.data.id);
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

  const handleFollow = async () => {
    try {
      if (!user) return;

      if (isFollowing) {
        setIsFollowing(false);
        toast.success(`Unfollowed ${user.name}`);
      } else {
        setIsFollowing(true);
        toast.success(`Now following ${user.name}`);
      }
    } catch (error) {
      toast.error("Error updating follow status");
    }
  };

  const handleCreatePost = async (postText: string, postImg?: File) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to create posts");
        return;
      }

      const formData = new FormData();
      formData.append("postText", postText);
      if (postImg) formData.append("postImg", postImg);

      await api.post("/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Post created successfully!");
      fetchProfileData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error creating post");
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
                            ? "bg-white/10 border border-white/20 text-white"
                            : "bg-gradient-to-r from-[#7c5bff] to-[#ff6ec4] text-white"
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
                      <button className="flex items-center gap-2 p-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition">
                        <FiMessageCircle size={18} />
                      </button>
                    </>
                  )}
                  <button className="p-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition">
                    <FiShare2 size={18} />
                  </button>
                </div>
              </div>

              <div className="flex gap-6 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-white/60 text-sm">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">0</p>
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

            {isCurrentUserProfile && (
              <div className="rounded-3xl border border-white/10 bg-[#080b16]/90 p-6 shadow-2xl backdrop-blur">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={
                      user.profilePicture &&
                      user.profilePicture !== "default-profile.png"
                        ? `http://localhost:3000/uploads/profile/${user.profilePicture}`
                        : avatar
                    }
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-white/60 text-sm">@{user.username}</p>
                  </div>
                </div>

                <textarea
                  placeholder="What are you spinning today?"
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  rows={3}
                  id="postText"
                />

                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2">
                    <label
                      htmlFor="postImage"
                      className="cursor-pointer p-2 rounded-full bg-white/5 hover:bg-white/10 transition"
                    >
                      <FaImage size={18} />
                    </label>
                    <input
                      type="file"
                      id="postImage"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        console.log("Image selected:", e.target.files?.[0]);
                      }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      const textarea = document.getElementById(
                        "postText"
                      ) as HTMLTextAreaElement;
                      if (textarea.value.trim()) {
                        handleCreatePost(textarea.value);
                        textarea.value = "";
                      } else {
                        toast.error("Please write something to post");
                      }
                    }}
                    className="bg-gradient-to-r from-[#7c5bff] to-[#ff6ec4] px-6 py-2 rounded-full font-semibold hover:opacity-90 transition"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}

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
                <p>0 followers</p>
                {isCurrentUserProfile && user.email && <p>{user.email}</p>}
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
