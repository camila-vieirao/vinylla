import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaImage,
  FaMusic,
  FaUserPlus,
  FaUserCheck,
  FaStar,
} from "react-icons/fa";
import { FiSettings, FiShare2, FiMessageCircle, FiEdit2 } from "react-icons/fi";
import { MdGroups } from "react-icons/md";
import api from "../../services/api/api";
import { toast } from "react-toastify";
import avatar from "../../assets/borabill_avatar.jpeg";

type ProfileTab = "posts" | "reviews" | "groups";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  profilePicture: string;
  headerPicture: string;
  description?: string;
}

interface ProfilePost {
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

type ProfileDraft = {
  name: string;
  username: string;
  email: string;
  password: string;
};

interface Review {
  id: number;
  reviewText: string;
  reviewRating: number;
  audiodb_album_id: string;
}

interface ReviewAlbum {
  idAlbum: string;
  strAlbum: string;
  strArtist: string;
  strAlbumThumb?: string;
}

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");
  const [user, setUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<ProfilePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followStats, setFollowStats] = useState<FollowStats>({
    followers: 0,
    following: 0,
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState<ProfileDraft>({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [albumCache, setAlbumCache] = useState<Record<string, ReviewAlbum>>({});
  const applyDraftFromUser = (userData: User) => {
    setProfileDraft({
      name: userData.name || "",
      username: userData.username || "",
      email: userData.email || "",
      password: "",
    });
  };
  useEffect(() => {
    fetchProfileData();
  }, [username]);

  useEffect(() => {
    if (user) {
      applyDraftFromUser(user);
    }
  }, [user]);

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
          fetchUserPosts(currentUserRes.data.id, currentUserRes.data),
          fetchFollowStats(currentUserRes.data.id),
          fetchUserReviews(currentUserRes.data.id),
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
          fetchUserPosts(foundUser.id, foundUser),
          fetchFollowStats(foundUser.id),
          checkIfFollowing(foundUser.id),
          fetchUserReviews(foundUser.id),
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

  const fetchUserPosts = async (userId: number, ownerInfo?: User) => {
    try {
      const postsRes = await api.get(`/api/posts/user/${userId}`);
      const userData = ownerInfo || user || currentUser;

      const postsWithUser = postsRes.data.map((post: ProfilePost) => ({
        ...post,
        user: {
          name: userData?.name || "",
          username: userData?.username || "",
          profilePicture: userData?.profilePicture || "",
        },
      }));
      setUserPosts(postsWithUser);
      postsRes.data.forEach((post: ProfilePost) => {
        if (post.postMention) {
          fetchAlbumDetails(post.postMention);
        }
      });
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

  const fetchUserReviews = async (userId: number) => {
    try {
      setReviewsLoading(true);
      const res = await api.get(`/api/reviews/user/${userId}`);
      setReviews(res.data);
      res.data.forEach((review: Review) => {
        fetchAlbumDetails(review.audiodb_album_id);
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchAlbumDetails = async (albumId: string) => {
    if (albumCache[albumId]) return;
    try {
      const res = await api.get(`/api_audiodb/v1/lookup/album/${albumId}`);
      if (res.data?.album?.length > 0) {
        setAlbumCache((prev) => ({
          ...prev,
          [albumId]: res.data.album[0],
        }));
      }
    } catch (error) {
      console.error("Error fetching album info:", error);
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
  const canEditProfile = Boolean(isCurrentUserProfile);

  const handleSaveProfile = async (
    profileFile?: File | null,
    draftOverride?: ProfileDraft,
  ) => {
    if (!user || !canEditProfile) return;
    try {
      setSavingProfile(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to edit your profile.");
        return;
      }
      const draft = draftOverride || profileDraft;
      const requests: Promise<any>[] = [];
      const payload: Record<string, string> = {};
      if (draft.name && draft.name !== user.name) {
        payload.name = draft.name;
      }
      if (draft.username && draft.username !== user.username) {
        payload.username = draft.username;
      }
      if (draft.email && draft.email !== user.email) {
        payload.email = draft.email;
      }
      if (draft.password.trim()) {
        payload.password = draft.password.trim();
      }
      if (Object.keys(payload).length > 0) {
        requests.push(
          api.put(`/api/users/${user.id}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        );
      }
      if (profileFile) {
        const formData = new FormData();
        formData.append("profilePicture", profileFile);
        requests.push(
          api.put("/api/users/me/picture", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }),
        );
      }
      if (requests.length === 0) {
        toast.info("Nothing to update.");
        return;
      }
      await Promise.all(requests);
      await fetchProfileData();
      setProfileDraft((prev) => ({ ...prev, password: "" }));
      toast.success("Profile updated!");
      setIsEditingProfile(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(
        error.response?.data?.message || "Could not update your profile.",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      applyDraftFromUser(user);
    }
    setIsEditingProfile(false);
  };

  const tabs = [
    {
      id: "posts" as ProfileTab,
      label: "Posts",
      icon: FaImage,
      count: userPosts.length,
    },
    {
      id: "reviews" as ProfileTab,
      label: "Reviews",
      icon: FaMusic,
      count: reviews.length,
    },
    { id: "groups" as ProfileTab, label: "Groups", icon: MdGroups, count: 0 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05060b] flex items-center justify-center text-white">
        Loading profile...
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

      <div className="relative z-10 max-w-6xl mx-auto px-4 lg:px-6 py-10 space-y-8">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#05060b] shadow-2xl">
          <div
            className="absolute inset-0"
            style={
              user.headerPicture
                ? {
                    backgroundImage: `url(http://localhost:3000/uploads/header/${user.headerPicture})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : { backgroundColor: "#1b1d2b" }
            }
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/65 to-[#05060b]" />
          </div>
          <div className="relative z-10 px-6 pb-6 pt-10 sm:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end">
              <div className="flex items-end gap-5">
                <div className="relative -mt-12 h-32 w-32 rounded-3xl border-4 border-white/10 bg-[#0b0d19] shadow-2xl">
                  <img
                    src={
                      user.profilePicture &&
                      user.profilePicture !== "default-profile.png"
                        ? `http://localhost:3000/uploads/profile/${user.profilePicture}`
                        : avatar
                    }
                    alt={user.name}
                    className="h-full w-full rounded-2xl object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                    Profile
                  </p>
                  <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                    {user.name}
                  </h1>
                  <p className="text-white/60">@{user.username}</p>
                  <p className="mt-4 max-w-2xl text-white/80">
                    {user.description ||
                      "No bio yet. Use edit profile to share your story."}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 lg:ml-auto">
                {!canEditProfile && currentUser && (
                  <>
                    <button
                      onClick={handleFollow}
                      className={`flex items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold transition ${
                        isFollowing
                          ? "border border-white/20 bg-white/10 text-white hover:bg-white/20"
                          : "bg-gradient-to-r from-[#7c5bff] to-[#ff6ec4] text-white hover:opacity-90"
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <FaUserCheck size={16} /> Following
                        </>
                      ) : (
                        <>
                          <FaUserPlus size={16} /> Follow
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleSendMessage}
                      className="rounded-full border border-white/20 bg-white/5 p-3 text-white/70 transition hover:bg-white/10 hover:text-white"
                      title="Message"
                    >
                      <FiMessageCircle size={18} />
                    </button>
                  </>
                )}
                <button
                  onClick={handleShareProfile}
                  className="rounded-full border border-white/20 bg-white/5 p-3 text-white/70 transition hover:bg-white/10 hover:text-white"
                  title="Share profile"
                >
                  <FiShare2 size={18} />
                </button>
                {canEditProfile && (
                  <button
                    onClick={() => {
                      if (user) applyDraftFromUser(user);
                      setIsEditingProfile(true);
                    }}
                    className="flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                  >
                    <FiEdit2 size={16} />
                    Edit profile
                  </button>
                )}
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-2xl font-bold">{followStats.followers}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Followers
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-2xl font-bold">{followStats.following}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Following
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-2xl font-bold">{userPosts.length}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Posts
                </p>
              </div>
            </div>
          </div>
        </section>

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
                    userPosts.map((post) => {
                      const owner = post.user || user || undefined;
                      const mentionedAlbum = post.postMention
                        ? albumCache[post.postMention]
                        : undefined;
                      return (
                        <article
                          key={post.id}
                          className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-xl"
                        >
                          <header className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full border border-white/20 bg-white/10">
                              <img
                                src={
                                  owner?.profilePicture
                                    ? `http://localhost:3000/uploads/profile/${owner.profilePicture}`
                                    : "http://localhost:3000/uploads/profile/default-profile.png"
                                }
                                alt={owner?.name || "profile"}
                                className="h-full w-full rounded-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold">
                                {owner?.name || "Listener"}
                              </p>
                              <p className="text-xs text-white/60">
                                @{owner?.username || "anon"}
                              </p>
                            </div>
                            {isCurrentUserProfile && (
                              <button
                                type="button"
                                onClick={() => handleDeletePost(post.id)}
                                className="text-xs uppercase tracking-[0.3em] text-rose-300 transition hover:text-rose-200"
                              >
                                Delete
                              </button>
                            )}
                          </header>
                          <p className="mt-4 text-sm text-white/90">
                            {post.postText}
                          </p>
                          {mentionedAlbum && (
                            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                              {mentionedAlbum.strAlbumThumb ? (
                                <img
                                  src={mentionedAlbum.strAlbumThumb}
                                  alt={mentionedAlbum.strAlbum}
                                  className="h-16 w-16 rounded-xl object-cover"
                                />
                              ) : (
                                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 text-xs uppercase text-white/50">
                                  Album
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-semibold text-white">
                                  {mentionedAlbum.strAlbum}
                                </p>
                                <p className="text-xs text-white/60">
                                  {mentionedAlbum.strArtist}
                                </p>
                              </div>
                            </div>
                          )}
                          {post.postImg && (
                            <img
                              src={`http://localhost:3000/uploads/posts/${post.postImg}`}
                              alt="post"
                              className="mt-4 h-60 w-full rounded-2xl object-cover"
                            />
                          )}
                        </article>
                      );
                    })
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-4">
                  {reviewsLoading ? (
                    <div className="py-12 text-center text-white/60">
                      Loading reviews...
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="text-center py-12">
                      <FaMusic
                        size={48}
                        className="mx-auto text-white/30 mb-4"
                      />
                      <h3 className="text-xl font-semibold mb-2">
                        No reviews yet
                      </h3>
                      <p className="text-white/60">
                        {isCurrentUserProfile
                          ? "Start reviewing your favorite albums!"
                          : `${user.name} hasn't written any reviews yet.`}
                      </p>
                    </div>
                  ) : (
                    reviews.map((review) => {
                      const ratingValue = Number(review.reviewRating) || 0;
                      const album = albumCache[review.audiodb_album_id];
                      return (
                        <article
                          key={review.id}
                          className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl"
                        >
                          <div className="flex items-center gap-4">
                            {album?.strAlbumThumb ? (
                              <img
                                src={album.strAlbumThumb}
                                alt={album.strAlbum}
                                className="h-16 w-16 rounded-2xl object-cover"
                              />
                            ) : (
                              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-xs uppercase text-white/50">
                                Album
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-base font-semibold">
                                {album?.strAlbum || "Unknown album"}
                              </p>
                              <p className="text-sm text-white/60">
                                {album?.strArtist || "Unknown artist"}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="flex justify-end gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <FaStar
                                    key={star}
                                    className={`text-lg ${
                                      star <= ratingValue
                                        ? "text-[#ffb347]"
                                        : "text-white/20"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="mt-4 text-sm text-white/80">
                            {review.reviewText}
                          </p>
                        </article>
                      );
                    })
                  )}
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
      {canEditProfile && (
        <ProfileEditModal
          open={isEditingProfile}
          draft={profileDraft}
          onDraftChange={(changes) =>
            setProfileDraft((prev) => ({ ...prev, ...changes }))
          }
          onClose={handleCancelEdit}
          onSave={(file, draft) => handleSaveProfile(file, draft)}
          saving={savingProfile}
        />
      )}
    </div>
  );
};

export default Profile;

type ProfileEditModalProps = {
  open: boolean;
  draft: ProfileDraft;
  onDraftChange: (value: Partial<ProfileDraft>) => void;
  onClose: () => void;
  onSave: (file: File | null, draft: ProfileDraft) => void;
  saving: boolean;
};

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  open,
  draft,
  onDraftChange,
  onClose,
  onSave,
  saving,
}) => {
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!open) {
      setFile(null);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-[#080b16] p-8 text-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-white/60 transition hover:text-white"
        >
          ✕
        </button>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">
            Edit profile
          </p>
          <h2 className="text-2xl font-semibold">
            Update your collector identity
          </h2>
        </div>
        <div className="mt-6 space-y-5">
          <label className="block text-xs uppercase tracking-[0.3em] text-white/60">
            Display name
            <input
              type="text"
              value={draft.name}
              onChange={(e) => onDraftChange({ name: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
              placeholder="Your name"
            />
          </label>
          <label className="block text-xs uppercase tracking-[0.3em] text-white/60">
            Username
            <input
              type="text"
              value={draft.username}
              onChange={(e) => onDraftChange({ username: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
              placeholder="@username"
            />
          </label>
          <label className="block text-xs uppercase tracking-[0.3em] text-white/60">
            Email
            <input
              type="email"
              value={draft.email}
              onChange={(e) => onDraftChange({ email: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
              placeholder="you@email.com"
            />
          </label>
          <label className="block text-xs uppercase tracking-[0.3em] text-white/60">
            New password
            <input
              type="password"
              value={draft.password}
              onChange={(e) => onDraftChange({ password: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
              placeholder="Leave blank to keep current password"
            />
          </label>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              Profile picture
            </p>
            <label className="mt-2 flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 p-5 text-center text-sm text-white/70 transition hover:border-white/40 hover:bg-white/10">
              {file ? (
                <span>{file.name}</span>
              ) : (
                <span>Click to upload a new avatar</span>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => onSave(file, draft)}
            className="rounded-full bg-gradient-to-r from-[#7c5bff] to-[#ff6ec4] px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 disabled:opacity-40"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
};
