import React, { useEffect, useState } from "react";
import axios from "axios";

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

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', padding: '32px' }}>
      {posts.map(post => (
  <div key={post.id} style={{ width: '484px', background: '#FEF4EA', borderRadius: '18px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          {/* Top bar */}
          <div style={{ height: '83px', background: '#E7DBC5F4', display: 'flex', alignItems: 'center', padding: '0 24px', position: 'relative' }}>
            {/* Profile picture */}
            <div style={{ width: '57px', height: '57px', borderRadius: '50%', overflow: 'hidden', background: '#8078a5', marginRight: '18px', border: '3px solid #FEF4EA' }}>
              <img src={users[post.userid]?.profilePicture ? `http://localhost:3000/uploads/profile/${users[post.userid].profilePicture}` : 'http://localhost:3000/uploads/profile/default-profile.png'} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {/* User name and time */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: '20px', color: '#23232A' }}>{users[post.userid]?.username || 'Usuário'}</span>
              <span style={{ fontSize: '15px', color: '#8078a5', marginTop: '2px' }}>{timeAgo(post.createdAt)}</span>
            </div>
          </div>
          {/* Album mention (if any) */}
          {post.postMention && (
            <AlbumMention albumId={post.postMention} fetchAlbum={fetchAlbum} />
          )}
          {/* Post text */}
          <div style={{flex: 1, paddingLeft: '40px', paddingRight: '40px', paddingTop: '24px', paddingBottom: '24px', color: '#23232A', fontSize: '18px', fontWeight: 400, wordBreak: 'break-word', overflowY: 'auto' }}>
            {post.postText}
          </div>
          {/* Post image (if any) */}
          {post.postImg && (
            <img src={`/uploads/${post.postImg}`} alt="post" style={{ width: '100%', maxHeight: '120px', objectFit: 'cover', borderRadius: '0 0 18px 18px' }} />
          )}
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
