import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../services/api/api";
import CommentSection from "../CommentSection/CommentSection";
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";
import { toast } from "react-toastify";

interface Post {
  id: number;
  postText: string;
  postImg?: string;
  userid: number;
  postMention?: string;
  createdAt: string;
  // Provided by backend join for public feed
  userName?: string;
  userUsername?: string;
  userProfilePicture?: string;
}

interface User {
  id: number;
  name: string;
  username?: string;
  profilePicture?: string;
}

interface Album {
  idAlbum: string;
  strAlbum: string;
  strArtist: string;
  strAlbumThumb?: string;
}

const Post: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<{ [key: number]: User }>({});
  const [albumCache, setAlbumCache] = useState<{ [key: string]: Album }>({});
  const [likeCounts, setLikeCounts] = useState<{ [key: number]: number }>({});
  const [likedByMe, setLikedByMe] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    // Get all posts (public) including minimal user info
    axios.get("http://localhost:3000/api/posts").then(async (res) => {
      const ordered: Post[] = [...res.data].sort(
        (a: Post, b: Post) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(ordered);

      // Build a users map from the returned user fields
      const userMap: { [key: number]: User } = {};
      ordered.forEach((p) => {
        userMap[p.userid] = {
          id: p.userid,
          name: p.userName || "",
          username: p.userUsername,
          profilePicture: p.userProfilePicture,
        };
      });
      setUsers(userMap);

      // Fetch like counts for each post (public endpoint)
      try {
        const pairs = await Promise.all(
          ordered.map(async (p) => {
            try {
              const res = await api.get(`/api/likes/post/${p.id}`);
              return [p.id, res.data?.likeCount ?? 0] as const;
            } catch {
              return [p.id, 0] as const;
            }
          })
        );
        const counts: { [key: number]: number } = {};
        pairs.forEach(([id, count]) => {
          counts[id] = count;
        });
        setLikeCounts(counts);
      } catch {
        // ignore errors here; default counts stay 0
      }

      // If logged in, fetch whether each post is liked by me
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const likedPairs = await Promise.all(
            ordered.map(async (p) => {
              try {
                const res = await api.get(`/api/posts/${p.id}/like/me`);
                return [p.id, !!res.data?.liked] as const;
              } catch {
                return [p.id, false] as const;
              }
            })
          );
          const likedMap: { [key: number]: boolean } = {};
          likedPairs.forEach(([id, liked]) => {
            likedMap[id] = liked;
          });
          setLikedByMe(likedMap);
        } catch {
          // ignore; leave likedByMe as defaults
        }
      }
    });
  }, []);

  const handleToggleLike = async (postId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be signed in to like.");
      return;
    }

    try {
      if (likedByMe[postId]) {
        await api.delete(`/api/posts/${postId}/like`);
        setLikedByMe((prev) => ({ ...prev, [postId]: false }));
        setLikeCounts((prev) => ({
          ...prev,
          [postId]: Math.max(0, (prev[postId] ?? 0) - 1),
        }));
      } else {
        await api.post(`/api/posts/${postId}/like`);
        setLikedByMe((prev) => ({ ...prev, [postId]: true }));
        setLikeCounts((prev) => ({
          ...prev,
          [postId]: (prev[postId] ?? 0) + 1,
        }));
      }
    } catch (error: any) {
      const status = error?.response?.status;
      const message: string = error?.response?.data?.message || "";
      // Try to reconcile local state based on backend response
      if (
        !likedByMe[postId] &&
        status === 400 &&
        /already liked/i.test(message)
      ) {
        setLikedByMe((prev) => ({ ...prev, [postId]: true }));
      } else if (
        likedByMe[postId] &&
        status === 404 &&
        /like not found/i.test(message)
      ) {
        setLikedByMe((prev) => ({ ...prev, [postId]: false }));
      } else if (
        status === 404 &&
        /post not found/i.test(message.toLowerCase())
      ) {
        toast.error("Post not found.");
      } else {
        toast.error("Failed to update like.");
      }
    }
  };

  // Helper: fetch album info if needed
  const fetchAlbum = async (albumId: string) => {
    if (albumCache[albumId]) return albumCache[albumId];
    try {
      const res = await axios.get(
        `http://localhost:3000/api_audiodb/v1/lookup/album/${albumId}`
      );
      if (res.data.album && res.data.album.length > 0) {
        setAlbumCache((prev) => ({ ...prev, [albumId]: res.data.album[0] }));
        return res.data.album[0];
      }
    } catch {
      return undefined;
    }
  };

  // Helper: time ago
  function timeAgo(dateStr: string) {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  // Estado para controlar expansão dos comentários por post
  const [expandedComments, setExpandedComments] = useState<{
    [key: number]: boolean;
  }>({});

  const handleToggleComment = (postId: number) => {
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6">
      {posts.map((post) => (
        <article
          key={post.id}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-xl backdrop-blur"
        >
          <header className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full border border-white/20 bg-white/10">
              <img
                src={
                  users[post.userid]?.profilePicture || post.userProfilePicture
                    ? `http://localhost:3000/uploads/profile/${
                        users[post.userid]?.profilePicture ||
                        post.userProfilePicture
                      }`
                    : "http://localhost:3000/uploads/profile/default-profile.png"
                }
                alt="profile"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold">
                {users[post.userid]?.username ||
                  post.userUsername ||
                  post.userName ||
                  "Listener"}
              </p>
              <p className="text-xs text-white/60">{timeAgo(post.createdAt)}</p>
            </div>
          </header>

          {post.postMention && (
            <div className="mt-5">
              <AlbumMention
                albumId={post.postMention}
                fetchAlbum={fetchAlbum}
              />
            </div>
          )}

          <p className="mt-5 text-base leading-relaxed text-white/90">
            {post.postText}
          </p>

          {post.postImg && (
            <img
              src={`http://localhost:3000/uploads/posts/${post.postImg}`}
              alt="post"
              className="h-64 w-full object-cover mt-2 rounded-xl"
            />
          )}

          <footer className="mt-6 flex items-center gap-4 text-white/60">
            <button
              type="button"
              onClick={() => handleToggleLike(post.id)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition hover:border-white/30 hover:text-white ${
                likedByMe[post.id]
                  ? "border-white/30 text-white"
                  : "border-white/10"
              }`}
              title={likedByMe[post.id] ? "Undo upvote" : "Upvote"}
            >
              <FaRegThumbsUp />
              Upvote{" "}
              {typeof likeCounts[post.id] === "number"
                ? likeCounts[post.id]
                : 0}
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold transition hover:border-white/30 hover:text-white"
              title="Downvote"
            >
              <FaRegThumbsDown />
              Downvote
            </button>
            <CommentSection
              postId={post.id}
              users={users}
              iconOnly
              show={!!expandedComments[post.id]}
              onExpand={() => handleToggleComment(post.id)}
            />
          </footer>

          <CommentSection
            postId={post.id}
            users={users}
            expandedArea
            show={!!expandedComments[post.id]}
          />
        </article>
      ))}
    </div>
  );
};

// Album mention component
const AlbumMention: React.FC<{
  albumId: string;
  fetchAlbum: (id: string) => Promise<Album | undefined>;
}> = ({ albumId, fetchAlbum }) => {
  const [album, setAlbum] = useState<Album | undefined>(undefined);

  useEffect(() => {
    fetchAlbum(albumId).then(setAlbum);
  }, [albumId]);

  if (!album) return null;
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      {album.strAlbumThumb ? (
        <img
          src={album.strAlbumThumb}
          alt={album.strAlbum}
          className="h-20 w-20 rounded-xl object-cover"
        />
      ) : (
        <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white/10 text-xs uppercase text-white/60">
          No cover
        </div>
      )}
      <div className="text-sm font-semibold text-white">
        <p>{album.strAlbum}</p>
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">
          {album.strArtist}
        </p>
      </div>
    </div>
  );
};

export default Post;
