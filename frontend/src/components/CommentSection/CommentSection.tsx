import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaRegComment, FaTimes } from "react-icons/fa";

interface Comment {
  id: number;
  commentText: string;
  createdAt: string;
  userid: number;
}

interface User {
  id: number;
  name: string;
  username?: string;
  profilePicture?: string;
}

interface CommentSectionProps {
  postId: number;
  users: { [key: number]: User };
  iconOnly?: boolean;
  expandedArea?: boolean;
  show?: boolean;
  onExpand?: () => void;
  onClose?: () => void;
}

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

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  users,
  iconOnly,
  expandedArea,
  show,
  onExpand,
  onClose,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      axios.get(`http://localhost:3000/api/comments/post/${postId}`)
        .then(res => {
          setComments(res.data.comments || []);
        });
    }
  }, [show, postId]);

  const handleSend = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      await axios.post(`http://localhost:3000/api/comments/post/${postId}`, {
        commentText: newComment
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setNewComment("");
      // Refresh comments
      const res = await axios.get(`http://localhost:3000/api/comments/post/${postId}`);
      setComments(res.data.comments || []);
    } catch (err) {
      // handle error
    }
    setLoading(false);
  };

  if (iconOnly) {
    return (
      <button
        type="button"
        className={`flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 transition ${
          show ? "border-white/30 text-white" : "hover:border-white/30 hover:text-white"
        }`}
        onClick={onExpand}
        title={show ? "Hide comments" : "Show comments"}
      >
        <FaRegComment />
        Comments
      </button>
    );
  }

  if (expandedArea) {
    if (!show) return null;
    return (
      <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/80 shadow-lg backdrop-blur">
        <div
          className="space-y-4 overflow-y-auto pr-1"
          style={{ maxHeight: "220px", scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.25) transparent" }}
        >
          {comments.length === 0 ? (
            <p className="text-white/50">No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="h-10 w-10 rounded-full border border-white/10 bg-white/10">
                  <img
                    src={
                      users[comment.userid]?.profilePicture
                        ? `http://localhost:3000/uploads/profile/${users[comment.userid].profilePicture}`
                        : "http://localhost:3000/uploads/profile/default-profile.png"
                    }
                    alt="profile"
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {users[comment.userid]?.username || "Listener"}
                    </span>
                    <span className="text-xs text-white/50">{timeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-white/80">{comment.commentText}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 flex gap-3">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none"
            disabled={loading}
          />
          <button
            type="button"
            onClick={handleSend}
            className="rounded-full bg-gradient-to-r from-[#7c5bff] to-[#ff6ec4] px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 disabled:opacity-40"
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default CommentSection;
