import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Album {
  idAlbum: string;
  strAlbum: string;
  strArtist: string;
  intYearReleased?: string;
  strStyle?: string;
  strLabel?: string;
  strAlbumThumb?: string;
  strDescriptionEN?: string;
}

interface Track {
  idTrack: string;
  strTrack: string;
}

export const AlbumPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [moreAlbums, setMoreAlbums] = useState<Album[]>([]);
  const [idArtist, setIdArtist] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    // Busca dados do álbum
    fetch(`http://localhost:3000/api_audiodb/v1/lookup/album/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.album && data.album.length > 0) {
          setAlbum(data.album[0]);
          setIdArtist(data.album[0].idArtist || "");
          // Busca faixas do álbum
          fetch(`http://localhost:3000/api_audiodb/v1/lookup/track/${id}`)
            .then(res => res.json())
            .then(trackData => {
              if (trackData.track && Array.isArray(trackData.track)) {
                setTracks(trackData.track);
              } else {
                setTracks([]);
              }
              // Busca mais álbuns do artista (igual ArtistPage)
              const artistName = data.album[0].strArtist;
              fetch(`http://localhost:3000/api_audiodb/v1/album?artist=${encodeURIComponent(artistName)}`)
                .then(res => res.json())
                .then(albumsData => {
                  if (albumsData.album && Array.isArray(albumsData.album)) {
                    // Exclui o álbum atual e pega até 6
                    const filtered = albumsData.album.filter((a: Album) => a.idAlbum !== id).slice(0, 6);
                    setMoreAlbums(filtered);
                  } else {
                    setMoreAlbums([]);
                  }
                  setLoading(false);
                })
                .catch(() => {
                  setMoreAlbums([]);
                  setLoading(false);
                });
            })
            .catch(() => {
              setTracks([]);
              setMoreAlbums([]);
              setLoading(false);
            });
        } else {
          setAlbum(null);
          setTracks([]);
          setMoreAlbums([]);
          setIdArtist("");
          setLoading(false);
        }
      })
      .catch(() => {
        setAlbum(null);
        setTracks([]);
        setMoreAlbums([]);
        setIdArtist("");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-center py-8 text-[#FEF4EA]">Loading...</div>;
  }

  if (!album) {
    return <div className="text-center py-8 text-[#FEF4EA]">Album not found.</div>;
  }

  return (
    <div className="relative w-full min-h-screen">
      {/* Banner do álbum */}
      <div className="w-full h-[300px] overflow-hidden relative" style={{ background: 'none' }}>
        {album.strAlbumThumb && (
          <img
            src={album.strAlbumThumb}
            alt={album.strAlbum}
            className="absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-full object-cover object-center"
            style={{ objectPosition: 'center' }}
          />
        )}
        {/* Fade suave para o fundo, sem bg escuro */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(17, 18, 19, 0.7) 30%, #464753 100%)',
          }}
        />
      </div>
      {/* Cards principais sobrepostos ao banner, alinhados com padding/margin */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', position: 'absolute', top: '60px', left: '180px', right: '40px', gap: '32px', zIndex: 3 }}>
        {/* Coluna esquerda: infos e descrição */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '750px' }}>
          {/* Retângulo principal com infos do álbum */}
          <div style={{ display: 'flex', background: '#30323F', borderRadius: '18px', padding: '32px 24px 24px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}>
            {/* Capa do álbum à esquerda */}
            {album.strAlbumThumb && (
              <div style={{ marginRight: '32px', display: 'flex', alignItems: 'flex-start', height: '110px' }}>
                <img
                  src={album.strAlbumThumb}
                  alt={album.strAlbum}
                  style={{ width: '110px', height: '110px', borderRadius: '12px', objectFit: 'cover', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}
                />
              </div>
            )}
            {/* Infos do álbum */}
            <div style={{ flex: 1 }}>
              <div style={{ color: '#FEF4EA', fontSize: '36px', fontWeight: 600, marginBottom: '10px', wordBreak: 'break-word' }}>{album.strAlbum}</div>
              <div
                style={{ color: '#FEF4EA', fontSize: '22px', fontWeight: 500, marginBottom: '10px', wordBreak: 'break-word', cursor: 'pointer', textDecoration: 'none' }}
                onClick={() => navigate(`/artist/${idArtist}`)}
                onMouseOver={e => (e.currentTarget.style.textDecoration = 'none')}
                onMouseOut={e => (e.currentTarget.style.textDecoration = 'none')}
              >
                {album.strArtist}
              </div>
              <div style={{ color: '#FEF4EA', fontSize: '18px', fontWeight: 500, marginBottom: '10px' }}>
                {album.intYearReleased && <span>{album.intYearReleased} • </span>}
                {album.strStyle && <span>{album.strStyle} • </span>}
                {album.strLabel && <span>{album.strLabel}</span>}
              </div>
            </div>
          </div>
          {/* descrição do álbum */}
          <div style={{ background: '#30323F', borderRadius: '18px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', position: 'relative' }}>
            <div style={{ color: '#FEF4EA', fontSize: '18px', fontWeight: 400, marginBottom: '18px', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
              {album.strDescriptionEN || 'No description available.'}
            </div>
          </div>
          {/* More from {artist} */}
          <div style={{ background: '#30323F', borderRadius: '18px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', marginTop: '8px', marginBottom: '20px', position: 'relative', minHeight: '120px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: '#FEF4EA', fontSize: '22px', fontWeight: 600 }}>
                More from {album.strArtist}
              </span>
              <button
                style={{ background: '#8078a5', color: '#FEF4EA', border: 'none', borderRadius: '8px', padding: '8px 18px', fontWeight: 600, fontSize: '15px', cursor: 'pointer' }}
                onClick={() => navigate(`/artist/${idArtist}`)}
              >
                Visit artist page
              </button>
            </div>
            <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {moreAlbums.length === 0 ? (
                <span style={{ color: '#FEF4EA', fontSize: '16px' }}>No other albums found.</span>
              ) : (
                moreAlbums.map(a => {
                  const albumName = a.strAlbum.length > 15 ? a.strAlbum.slice(0, 15) + '...' : a.strAlbum;
                  return (
                    <div key={a.idAlbum} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90px', cursor: 'pointer', marginLeft: '5px', marginRight: '5px' }} onClick={() => navigate(`/album/${a.idAlbum}`)}>
                      <img src={a.strAlbumThumb || ''} alt={a.strAlbum} style={{ width: '90px', height: '90px', borderRadius: '10px', objectFit: 'cover', marginBottom: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} />
                      <span style={{ color: '#FEF4EA', fontSize: '14px', textAlign: 'center', wordBreak: 'break-word' }}>{albumName}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        {/* Retângulo de tracks à direita, alinhado */}
        <div style={{ width: '496px', minHeight: '340px', background: '#30323F', borderRadius: '18px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', marginBottom: '15px' }}>
          <div style={{ color: '#FEF4EA', fontSize: '28px', fontWeight: 600, marginBottom: '18px', marginLeft: '10px' }}>Tracks</div>
          <ul style={{ color: '#FEF4EA', fontSize: '18px', fontWeight: 500, marginLeft: '10px' }}>
            {tracks.length === 0 ? (
              <li>No tracks found.</li>
            ) : (
              tracks.map(track => (
                <li key={track.idTrack} style={{ marginBottom: '10px', padding: '8px 0', borderBottom: '1px solid #8078a5' }}>{track.strTrack}</li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
