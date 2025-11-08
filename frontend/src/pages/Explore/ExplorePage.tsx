import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Album {
  name: string;
  url: string;
  artist: { name: string; url: string };
  image: { size: string; ['#text']: string }[];
}

interface Tag {
  id: number;
  name: string;
}

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [albumsByTag, setAlbumsByTag] = useState<{ [tag: string]: Album[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch userId from /api/users/me
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:3000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(user => {
        setUserId(user.id);
        // Fetch tags for user
        fetch(`http://localhost:3000/api/users/${user.id}/tags`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => res.json())
          .then(tagsRes => {
            setTags(tagsRes);
            // For each tag, fetch top albums
            Promise.all(
              tagsRes.map((tag: Tag) =>
                fetch(`http://localhost:3000/api_lastfm/v1/topalbums/tag/${encodeURIComponent(tag.name)}?limit=14`)
                  .then(res => res.json())
                  .then(data => ({ tag: tag.name, albums: data.albums?.album || [] }))
                  .catch(() => ({ tag: tag.name, albums: [] }))
              )
            ).then(results => {
              const albumsMap: { [tag: string]: Album[] } = {};
              results.forEach(r => {
                albumsMap[r.tag] = r.albums;
              });
              setAlbumsByTag(albumsMap);
              setLoading(false);
            });
          })
          .catch(() => {
            setTags([]);
            setLoading(false);
          });
      })
      .catch(() => {
        setUserId(null);
        setTags([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-[#FEF4EA]">Loading...</div>;
  }

  return (
    <div className="bg-[#23232A] py-38" style={{ paddingLeft: '150px', paddingBottom: '32px' }}>
      <h1 style={{ color: '#FEF4EA', fontSize: '38px', fontWeight: 700, marginBottom: '32px' }}>Explore</h1>
      {tags.length === 0 ? (
        <div style={{ color: '#FEF4EA', background: '#23232A', fontSize: '20px', marginBottom: '32px' }}>No genres/tags selected. Go to your profile to add some!</div>
      ) : (
        tags.map(tag => (
          <div key={tag.id} style={{ marginBottom: '48px' }}>
            <div style={{ color: '#FEF4EA', fontSize: '28px', fontWeight: 600, marginBottom: '18px' }}>{tag.name}</div>
            <div style={{ display: 'flex', gap: '36px', flexWrap: 'wrap' }}>
              {albumsByTag[tag.name]?.length === 0 ? (
                <span style={{ color: '#FEF4EA', fontSize: '16px' }}>No albums found for this genre.</span>
              ) : (
                albumsByTag[tag.name].map(album => {
                  const imgObj = album.image?.find((img: any) => img.size === 'extralarge') || album.image?.[album.image.length - 1];
                  const handleAlbumClick = async () => {
                    // Remove '(Remastered)' do nome do álbum
                    const cleanAlbumName = album.name.replace(/\s*\(Remastered\)/gi, '').trim();
                    // Busca idAlbum na AudioDB
                    const res = await fetch(`http://localhost:3000/api_audiodb/v1/album?artist=${encodeURIComponent(album.artist.name)}&album=${encodeURIComponent(cleanAlbumName)}`);
                    const data = await res.json();
                    if (data.album && Array.isArray(data.album) && data.album.length > 0) {
                      const idAlbum = data.album[0].idAlbum;
                      navigate(`/album/${idAlbum}`);
                    } else {
                      alert('Album not found in AudioDB');
                    }
                  };
                  return (
                    <div key={album.name + album.artist.name} style={{ width: '160px', cursor: 'pointer', background: '#30323F', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={handleAlbumClick}>
                      <img src={imgObj?.['#text'] || ''} alt={album.name} style={{ width: '120px', height: '120px', borderRadius: '10px', objectFit: 'cover', marginBottom: '10px', background: '#8078a5' }} />
                      <span style={{ color: '#FEF4EA', fontSize: '16px', fontWeight: 600, textAlign: 'center', wordBreak: 'break-word', marginBottom: '4px' }}>{album.name}</span>
                      <span style={{ color: '#FEF4EA', fontSize: '15px', textAlign: 'center', wordBreak: 'break-word' }}>{album.artist?.name}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
