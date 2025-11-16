import { FaImage, FaVideo, FaMusic, FaFireAlt } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import type { IconType } from "react-icons";
import Post from "../../components/Post/Post";
import avatar from "../../assets/borabill_avatar.jpeg";
import groupIndie from "../../assets/misfits.jpg";
import groupJazz from "../../assets/peter.jpg";
import groupElectro from "../../assets/monark.jpg";
import marinaAvatar from "../../assets/bruninho.jpg";
import liamAvatar from "../../assets/images.jpeg";
import sofiaAvatar from "../../assets/manoel.jpg";
import { MdGroups } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import api from "../../services/api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AlbumSearchModal } from "../../components/ReviewModal/AlbumSearchModal";

type StoryAction = "post" | "review" | "marketplace";

type CuratedStory = {
  id: string;
  badge: string;
  title: string;
  description: string;
  gradient: string;
  action: StoryAction;
};

const curatedStories: CuratedStory[] = [
  {
    id: "fresh",
    badge: "Current vibe",
    title: "Drop the record that's on your mind",
    description: "Share your current vibe with the community",
    gradient: "from-[#f2d8ff] via-[#d5b7ff] to-[#8f6bff]",
    action: "post",
  },
  {
    id: "review",
    badge: "Review",
    title: "Share your thoughts on a record",
    description: "Drop your review on a record you've listened to",
    gradient: "from-[#fee2f0] via-[#ffb8d2] to-[#ff7ca3]",
    action: "review",
  },
  {
    id: "crate",
    badge: "Marketplace",
    title: "Search for your next record on our marketplace",
    description: "Find the perfect record for your collection.",
    gradient: "from-[#dfffe9] via-[#b8ffd6] to-[#64f7b7]",
    action: "marketplace",
  },
];

const featuredGroups = [
  {
    id: "indie",
    name: "Indie Underground",
    members: "18.4k members",
    image: groupIndie,
  },
  {
    id: "jazz",
    name: "Late Night Jazz Club",
    members: "9.2k members",
    image: groupJazz,
  },
  {
    id: "electro",
    name: "Analog Synth Circle",
    members: "12.1k members",
    image: groupElectro,
  },
];

const suggestedPeople = [
  {
    id: "marina",
    name: "Marina Flores",
    tagline: "Curates dream pop gems",
    avatar: marinaAvatar,
  },
  {
    id: "liam",
    name: "Liam Duarte",
    tagline: "Analog synth collector",
    avatar: liamAvatar,
  },
  {
    id: "sofia",
    name: "Sofia Reis",
    tagline: "Vinyl photographer",
    avatar: sofiaAvatar,
  },
];

const trendingTopics = [
  "shoegaze",
  "vinylfinds",
  "nowplaying",
  "analoglove",
  "festivaldiaries",
];

type MediaAction = {
  id: "image" | "video" | "music";
  label: string;
  icon: IconType;
  accent: string;
};

const mediaActions: MediaAction[] = [
  {
    id: "image",
    label: "Photo",
    icon: FaImage,
    accent: "from-[#ffe0ef] to-[#ffb8f6]",
  },
  {
    id: "video",
    label: "Video",
    icon: FaVideo,
    accent: "from-[#dff2ff] to-[#9fd8ff]",
  },
  {
    id: "music",
    label: "Track",
    icon: FaMusic,
    accent: "from-[#ddffe8] to-[#8fffc2]",
  },
];

type FeedProps = {
  onOpenPostModal?: () => void;
  onOpenReviewModal?: () => void;
};

const Feed: React.FC<FeedProps> = ({ onOpenPostModal, onOpenReviewModal }) => {
  const [user, setUser] = useState<any>(null);
  const [postText, setPostText] = useState("");
  const [postImg, setPostImg] = useState<File | null>(null);
  const [storiesCollapsed, setStoriesCollapsed] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<{
    idAlbum: string;
    strAlbum: string;
    strArtist: string;
    strAlbumThumb?: string;
  } | null>(null);
  const [userStats, setUserStats] = useState({
    followers: 0,
    following: 0,
    posts: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const res = await api.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        fetchUserStats(res.data.id);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      }
    }

    fetchUser();
  }, []);

  async function fetchUserStats(userId: number) {
    try {
      const [followRes, postsRes] = await Promise.all([
        api.get(`/api/follows/${userId}/counts`),
        api.get(`/api/posts/user/${userId}`),
      ]);
      setUserStats({
        followers: followRes.data.followers || 0,
        following: followRes.data.following || 0,
        posts: Array.isArray(postsRes.data) ? postsRes.data.length : 0,
      });
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
      setUserStats({ followers: 0, following: 0, posts: 0 });
    }
  }

  async function handleCreatePost() {
    if (!postText.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const formData = new FormData();
      formData.append("postText", postText);
      if (postImg) formData.append("postImg", postImg);
      if (selectedTrack) formData.append("postMention", selectedTrack.idAlbum);

      await api.post("/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setPostText("");
      setPostImg(null);
      setSelectedTrack(null);
      toast.success("Post created successfully!");
      // refreshing the feed
      window.location.reload();
    } catch (error: any) {
      toast.error(error);
    }
  }

  function handleStoryAction(action: StoryAction) {
    if (action === "post") {
      onOpenPostModal?.();
      return;
    }
    if (action === "review") {
      onOpenReviewModal?.();
      return;
    }
    navigate("/marketplace");
  }

  return (
    <div className="relative min-h-screen bg-[#05060b] text-white sm:pl-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,91,255,0.28),_transparent_55%)] opacity-70"
      />
      <div className="relative z-10 max-w-6xl mx-auto px-4 lg:px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-8">
            {user ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-2xl font-semibold">Drop something quick</p>
                  <button
                    type="button"
                    className="rounded-full border border-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:border-white/30 hover:text-white"
                    onClick={() => setStoriesCollapsed((prev) => !prev)}
                  >
                    {storiesCollapsed ? "Expand" : "Minimize"}
                  </button>
                </div>
                {storiesCollapsed ? (
                  <div className="flex flex-wrap gap-3">
                    {curatedStories.map((story) => (
                      <button
                        type="button"
                        key={story.id}
                        onClick={() => handleStoryAction(story.action)}
                        className={`flex items-center gap-2 rounded-full border border-white/15 bg-gradient-to-r ${story.gradient} px-4 py-2 text-xs font-semibold text-[#100b1f] shadow-sm transition hover:-translate-y-0.5`}
                      >
                        <span className="text-[0.6rem] uppercase tracking-[0.3em]">
                          {story.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {curatedStories.map((story) => (
                      <button
                        type="button"
                        key={story.id}
                        onClick={() => handleStoryAction(story.action)}
                        className={`group relative flex aspect-square flex-col justify-between rounded-3xl bg-gradient-to-br ${story.gradient} p-4 text-left text-[#100b1f] shadow-xl transition-transform duration-300 hover:-translate-y-1 focus:outline-none`}
                      >
                        <div className="space-y-2">
                          <p className="text-[0.6rem] uppercase tracking-[0.35em] opacity-70">
                            {story.badge}
                          </p>
                          <p className="text-lg font-semibold leading-tight">
                            {story.title}
                          </p>
                          <p className="text-xs opacity-80">
                            {story.description}
                          </p>
                        </div>
                        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-[#100b1f]/60 transition group-hover:text-[#100b1f]">
                          Tap to open
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-10 text-center shadow-2xl backdrop-blur">
                <h2 className="text-3xl font-semibold mb-3">
                  Join the conversation
                </h2>
                <p className="text-white/70 mb-8 text-base">
                  Sign in to upload sleeves, tag tracks, and chat with
                  collectors worldwide.
                </p>
                <button
                  type="button"
                  className="cursor-pointer rounded-full bg-white px-8 py-3 font-semibold text-[#0f0f19] shadow-lg transition hover:bg-white/90"
                  onClick={() => {
                    window.location.href = "/login";
                  }}
                >
                  Sign in to post
                </button>
              </div>
            )}

            {user && (
              <div className="rounded-3xl border border-white/10 bg-[#080b16]/90 p-6 shadow-2xl backdrop-blur">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="flex-shrink-0 rounded-full border border-white/10 p-1 bg-white/5"
                  >
                    <img
                      className="w-14 h-14 rounded-full object-cover object-center"
                      src={
                        user.profilePicture
                          ? `http://localhost:3000/uploads/profile/${user.profilePicture}`
                          : avatar
                      }
                      alt="user avatar"
                    />
                  </button>
                  <div>
                    <p className="text-lg font-semibold leading-tight">
                      {user.name}
                    </p>
                    <p className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] pt-1 text-white/60">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />@
                      {user.username}
                    </p>
                  </div>
                </div>

                <textarea
                  rows={3}
                  className="mt-6 w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-4 text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  placeholder={`What are you spinning, ${user.name}?`}
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                />

                <div className="mt-4 flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    {mediaActions.map((action) => {
                      const Icon = action.icon;

                      if (action.id === "image") {
                        return (
                          <label
                            key={action.id}
                            htmlFor="post-image"
                            className={`flex items-center gap-2 rounded-full bg-gradient-to-r ${action.accent} px-4 py-2 text-sm font-semibold text-[#1c0f2b] shadow-sm transition hover:-translate-y-0.5 cursor-pointer`}
                          >
                            <Icon size={16} />
                            <span>{action.label}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              id="post-image"
                              onChange={(e) =>
                                setPostImg(e.target.files?.[0] || null)
                              }
                            />
                          </label>
                        );
                      }

                      if (action.id === "music") {
                        return (
                          <button
                            type="button"
                            key={action.id}
                            onClick={() => setShowTrackModal(true)}
                            className={`flex items-center gap-2 rounded-full bg-gradient-to-r ${action.accent} px-4 py-2 text-sm font-semibold text-[#1c0f2b] shadow-sm transition hover:-translate-y-0.5`}
                          >
                            <Icon size={16} />
                            <span>{action.label}</span>
                          </button>
                        );
                      }

                      return (
                        <button
                          type="button"
                          key={action.id}
                          className={`flex items-center gap-2 rounded-full bg-gradient-to-r ${action.accent} px-4 py-2 text-sm font-semibold text-[#1c0f2b] shadow-sm transition hover:-translate-y-0.5`}
                        >
                          <Icon size={16} />
                          <span>{action.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedTrack && (
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
                      <div className="flex items-center gap-3">
                        {selectedTrack.strAlbumThumb ? (
                          <img
                            src={selectedTrack.strAlbumThumb}
                            alt={selectedTrack.strAlbum}
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-xs uppercase text-white/50">
                            Album
                          </div>
                        )}
                        <div>
                          <p className="text-white font-semibold">
                            {selectedTrack.strAlbum}
                          </p>
                          <p className="text-white/60 text-xs">
                            {selectedTrack.strArtist}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="text-xs uppercase tracking-[0.3em] text-white/60 transition hover:text-white"
                        onClick={() => setSelectedTrack(null)}
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={handleCreatePost}
                      className="cursor-pointer rounded-full bg-gradient-to-r from-[#7c5bff] to-[#ff6ec4] px-8 py-2 font-semibold text-white shadow-xl transition hover:opacity-90"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xl font-semibold">Community feed</p>
                  <p className="text-sm text-white/60">
                    Fresh drops from artists and fans
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <button
                    type="button"
                    className="rounded-full border border-white/15 px-3 py-1 transition hover:border-white/40"
                  >
                    Following
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-white/15 px-3 py-1 transition hover:border-white/40"
                  >
                    For you
                  </button>
                  <div className="flex items-center gap-1 rounded-full border border-white/15 px-3 py-1">
                    <FiClock size={14} />
                    <span>Live</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-white/10" />
              <Post />
            </div>
          </section>

          <aside className="space-y-6">
            {user && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
                <div className="flex items-center gap-4">
                  <img
                    className="w-14 h-14 rounded-full object-cover object-center border border-white/20"
                    src={
                      user.profilePicture
                        ? `http://localhost:3000/uploads/profile/${user.profilePicture}`
                        : avatar
                    }
                    alt="profile"
                  />
                  <div>
                    <p className="text-lg font-semibold">{user.name}</p>
                    <p className="text-sm text-white/60">
                      @
                      {user.username ||
                        user.name?.split(" ")[0]?.toLowerCase() ||
                        "listener"}
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="rounded-2xl bg-white/5 p-3">
                    <p className="text-lg font-semibold">
                      {userStats.followers}
                    </p>
                    <p className="text-white/60 text-xs">Followers</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3">
                    <p className="text-lg font-semibold">
                      {userStats.following}
                    </p>
                    <p className="text-white/60 text-xs">Following</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3">
                    <p className="text-lg font-semibold">{userStats.posts}</p>
                    <p className="text-white/60 text-xs">Posts</p>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xl font-semibold">Groups</p>
                  <p className="text-sm text-white/60">
                    Rooms buzzing right now
                  </p>
                </div>
                <MdGroups size={26} />
              </div>

              <ul className="space-y-3">
                {featuredGroups.map((group) => (
                  <li
                    key={group.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        className="w-10 h-10 rounded-full object-cover object-center"
                        src={group.image}
                        alt="group avatar"
                      />
                      <div>
                        <p className="font-semibold text-white">{group.name}</p>
                        <p className="text-xs text-white/60">{group.members}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0d0d15]"
                      onClick={() => {
                        if (group.id === "indie") {
                          navigate(`/groups/${group.id}`);
                        } else {
                          toast.info("This room is coming soon.");
                        }
                      }}
                    >
                      {group.id === "indie" ? "Enter" : "Soon"}
                    </button>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="mt-6 w-full rounded-full border border-white/20 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                See all groups
              </button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xl font-semibold">Suggestions</p>
                  <p className="text-sm text-white/60">
                    People curating similar sounds
                  </p>
                </div>
                <IoPersonAddSharp size={22} />
              </div>
              <ul className="space-y-3">
                {suggestedPeople.map((person) => (
                  <li
                    key={person.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        className="w-12 h-12 rounded-full object-cover object-center"
                        src={person.avatar}
                        alt={person.name}
                      />
                      <div>
                        <p className="font-semibold text-white">
                          {person.name}
                        </p>
                        <p className="text-xs text-white/60">
                          {person.tagline}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-full bg-gradient-to-r from-[#7c5bff] to-[#ff6ec4] px-3 py-1 text-xs font-semibold"
                    >
                      Follow
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <div className="mb-4 flex items-center gap-2">
                <FaFireAlt className="text-[#ffb347]" size={20} />
                <p className="text-xl font-semibold">Trending topics</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {trendingTopics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-white/15 px-3 py-1 text-sm font-semibold text-white/80"
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
      {showTrackModal && (
        <AlbumSearchModal
          onSelect={(album) => {
            setSelectedTrack(album);
            setShowTrackModal(false);
          }}
          onClose={() => setShowTrackModal(false)}
        />
      )}
    </div>
  );
};

export default Feed;
