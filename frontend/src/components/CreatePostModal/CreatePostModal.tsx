import React, { useEffect, useState } from "react";
import { FaImage, FaMusic, FaVideo } from "react-icons/fa";
import avatar from "../../assets/borabill_avatar.jpeg";
import api from "../../services/api/api";
import { toast } from "react-toastify";

interface CreatePostModalProps {
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose }) => {
  const [user, setUser] = useState<any>(null);
  const [postText, setPostText] = useState("");
  const [postImg, setPostImg] = useState<File | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await api.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      }
    }

    fetchUser();
  }, []);

  async function handleCreatePost() {
    if (!postText.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const formData = new FormData();
      formData.append("postText", postText);
      if (postImg) formData.append("postImg", postImg);

      await api.post("/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setPostText("");
      setPostImg(null);
      toast.success("Post created successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#080b16] text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">New post</p>
            <p className="text-xl pt-2 font-semibold">Share something with the community</p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-full border border-white/10 p-2 text-lg text-white/70 transition hover:border-white/40 hover:text-white"
          >
            ✕
          </button>
        </div>

        {!user && (
          <div className="flex flex-col items-center gap-6 px-6 py-10 text-center">
            <p className="text-base text-white/70">Want to create a post?</p>
            <button
              className="cursor-pointer rounded-full bg-gradient-to-r from-[#7c5bff] to-[#ff6ec4] px-8 py-2 font-semibold text-white shadow-lg transition hover:opacity-90"
              onClick={() => (window.location.href = "/login")}
            >
              Sign in to continue
            </button>
          </div>
        )}

        {user && (
          <div className="px-6 py-6 space-y-6">
            <div className="flex items-center gap-4">
              <img
                className="h-14 w-14 rounded-full object-cover object-center border border-white/10"
                src={
                  user?.profilePicture
                    ? `http://localhost:3000/uploads/profile/${user.profilePicture}`
                    : avatar
                }
                alt="user photo"
              />
              <div>
                <p className="text-lg font-semibold">{user?.username}</p>
              </div>
            </div>

            <textarea
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-base text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder={`What are you spinning, ${user?.username}?`}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />

            <div className="flex flex-wrap items-center gap-3">
              <label
                htmlFor="modal-post-image"
                className="group flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:bg-white/5 cursor-pointer"
              >
                <FaImage size={16} />
                <span>Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="modal-post-image"
                  onChange={(e) => setPostImg(e.target.files?.[0] || null)}
                />
              </label>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:bg-white/5"
              >
                <FaVideo size={16} />
                <span>Video</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:bg-white/5"
              >
                <FaMusic size={16} />
                <span>Track</span>
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <button
                onClick={handleCreatePost}
                className="cursor-pointer rounded-full bg-gradient-to-r from-[#7c5bff] to-[#ff6ec4] px-8 py-2 font-semibold text-white shadow-lg transition hover:opacity-90 disabled:opacity-40"
                disabled={!postText.trim()}
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePostModal;
