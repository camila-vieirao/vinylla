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

const CommentSection: React.FC<CommentSectionProps> = ({ postId, users, iconOnly, expandedArea, show, onExpand, onClose }) => {
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

  // Se for só o ícone
  if (iconOnly) {
    return (
      <button
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: '2px' }}
        onClick={onExpand}
        title={show ? "Fechar comentários" : "Comentar"}
      >
        <FaRegComment size={22} color={show ? "#6a4c7d" : "#8078a5"} />
      </button>
    );
  }

  // Se for a área expandida
  if (expandedArea) {
    if (!show) return null;
    return (
      <div style={{ width: '100%', padding: '20px 24px 16px 24px', boxSizing: 'border-box' }}>
        <div style={{ maxHeight: '180px', overflowY: 'auto', marginBottom: '12px', marginTop: '8px' }}>
          {comments.length === 0 ? (
            <span style={{ color: '#8078a5' }}>Nenhum comentário ainda.</span>
          ) : (
            comments.map(comment => (
              <div key={comment.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <img
                  src={users[comment.userid]?.profilePicture ? `http://localhost:3000/uploads/profile/${users[comment.userid].profilePicture}` : 'http://localhost:3000/uploads/profile/default-profile.png'}
                  alt="profile"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', marginRight: '10px' }}
                />
                <div>
                  <span style={{ fontWeight: 600, fontSize: '15px', color: '#23232A' }}>{users[comment.userid]?.username || 'Usuário'}</span>
                  <span style={{ fontSize: '13px', color: '#8078a5', marginLeft: '8px' }}>{timeAgo(comment.createdAt)}</span>
                  <div style={{ color: '#23232A', fontSize: '15px' }}>{comment.commentText}</div>
                </div>
              </div>
            ))
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Comment here..."
            style={{ flex: 1, padding: '8px', borderRadius: '16px', border: '1px solid #ddd' }}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            style={{ background: '#6a4c7d', color: '#fff', border: 'none', borderRadius: '20px', padding: '8px 16px', fontWeight: 500, cursor: 'pointer' }}
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
