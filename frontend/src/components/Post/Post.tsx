import React, { useEffect, useState } from "react";
import axios from "axios";
import CommentSection from "../CommentSection/CommentSection";
import { FaRegThumbsUp, FaRegThumbsDown, FaRegComment } from "react-icons/fa";

interface Post {
  id: number;
  postText: string;
  postImg?: string;
  userid: number;
  postMention?: string;
  createdAt: string;
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

  useEffect(() => {
    // Get all posts
    axios.get("http://localhost:3000/api/posts")
      .then(res => {
        setPosts(res.data);
        // Get all users for mapping
        const token = localStorage.getItem("token");
        axios.get("http://localhost:3000/api/users", {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
          .then(userRes => {
            const userMap: { [key: number]: User } = {};
            userRes.data.forEach((u: User) => {
              userMap[u.id] = u;
            });
            setUsers(userMap);
          });
      });
  }, []);

  // Helper: fetch album info if needed
  const fetchAlbum = async (albumId: string) => {
    if (albumCache[albumId]) return albumCache[albumId];
    try {
      const res = await axios.get(`http://localhost:3000/api_audiodb/v1/lookup/album/${albumId}`);
      if (res.data.album && res.data.album.length > 0) {
        setAlbumCache(prev => ({ ...prev, [albumId]: res.data.album[0] }));
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
  const [expandedComments, setExpandedComments] = useState<{ [key: number]: boolean }>({});

  const handleToggleComment = (postId: number) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 p-4">
      {posts.map(post => (
        <div
          key={post.id}
          className="bg-[#FEF4EA] rounded-2xl shadow-lg overflow-hidden flex flex-col w-full border border-[#D1CFC6]"
          style={{ minWidth: 0 }}
        >
          {/* Top bar */}
          <div className="h-[83px] bg-[#E7DBC5F4] flex items-center px-6 relative">
            {/* Profile picture */}
            <div className="w-[57px] h-[57px] rounded-full overflow-hidden bg-[#8078a5] mr-4 border-4 border-[#FEF4EA]">
              <img
                src={users[post.userid]?.profilePicture ? `http://localhost:3000/uploads/profile/${users[post.userid].profilePicture}` : 'http://localhost:3000/uploads/profile/default-profile.png'}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
            {/* User name and time */}
            <div className="flex flex-col justify-center">
              <span className="font-semibold text-xl text-[#23232A]">{users[post.userid]?.username || 'Usuário'}</span>
              <span className="text-sm text-[#8078a5]">{timeAgo(post.createdAt)}</span>
            </div>
          </div>
          {/* Album mention (if any) */}
          {post.postMention && (
            <AlbumMention albumId={post.postMention} fetchAlbum={fetchAlbum} />
          )}
          {/* Post text */}
          <div className="px-10 py-5 text-[#23232A] text-lg font-normal break-words overflow-y-auto">
            {post.postText}
          </div>
          {/* Post image (if any) */}
          {post.postImg && (
            <img
              src={`/uploads/${post.postImg}`}
              alt="post"
              className="w-full max-h-[120px] object-cover rounded-b-2xl"
            />
          )}
          {/* Interações: linha dos ícones */}
          <div className="w-full">
            <div className="flex justify-start gap-5 px-10 pb-5 items-center">
              <button className="bg-none border-none cursor-pointer p-0" title="Upvote">
                <FaRegThumbsUp size={22} color="#8078a5" />
              </button>
              <button className="bg-none border-none cursor-pointer p-0" title="Downvote">
                <FaRegThumbsDown size={22} color="#8078a5" />
              </button>
              {/* Botão de comentário, não área expandida */}
              <CommentSection postId={post.id} users={users} iconOnly show={!!expandedComments[post.id]} onExpand={() => handleToggleComment(post.id)} />
            </div>
            {/* Nova linha: área de comentários expandida */}
            <CommentSection postId={post.id} users={users} expandedArea show={!!expandedComments[post.id]} />
          </div>
        </div>
      ))}
    </div>
  );
};

// Album mention component
const AlbumMention: React.FC<{ albumId: string; fetchAlbum: (id: string) => Promise<Album | undefined>; }> = ({ albumId, fetchAlbum }) => {
  const [album, setAlbum] = useState<Album | undefined>(undefined);

  useEffect(() => {
    fetchAlbum(albumId).then(setAlbum);
  }, [albumId]);

  if (!album) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', borderRadius: '12px', margin: '18px 24px 0 24px', padding: '5px 18px' }}>
      <img src={album.strAlbumThumb || '/uploads/default-album.png'} alt={album.strAlbum} style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover', marginRight: '18px', background: '#8078a5' }} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ color: '#262731', fontWeight: 600, fontSize: '17px', marginBottom: '2px', wordBreak: 'break-word' }}>{album.strAlbum}</span>
        <span style={{ color: '#262731', fontSize: '15px', wordBreak: 'break-word' }}>{album.strArtist}</span>
      </div>
    </div>
  );
};

export default Post;
