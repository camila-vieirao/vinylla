import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CreatePostModal from "../../components/CreatePostModal/CreatePostModal";

type Artist = {
  idArtist: string;
  strArtist: string;
  strArtistThumb?: string;
  strArtistBanner?: string;
  strArtistWideThumb?: string;
  strArtistFanart?: string;
  strBiographyPT?: string;
  strBiographyEN?: string;
  strGenre?: string;
  strCountry?: string;
  strStyle?: string;
  intFormedYear?: string;
  strLastFMChart?: string;
};

type Album = {
  idAlbum: string;
  strAlbum: string;
  strAlbumThumb?: string;
  intYearReleased?: string;
};

export const ArtistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    // Busca dados do artista
    fetch(`http://localhost:3000/api_audiodb/v1/lookup/artist/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.artists && data.artists.length > 0) {
          const foundArtist = data.artists[0];
          setArtist(foundArtist);
          // Busca álbuns usando o nome do artista
          fetch(`http://localhost:3000/api_audiodb/v1/album?artist=${encodeURIComponent(foundArtist.strArtist)}`)
            .then(res => res.json())
            .then(albumData => {
              if (albumData.album && Array.isArray(albumData.album)) {
                setAlbums(albumData.album);
              } else {
                setAlbums([]);
              }
              setLoading(false);
            })
            .catch(() => {
              setAlbums([]);
              setLoading(false);
            });
        } else {
          setArtist(null);
          setAlbums([]);
          setLoading(false);
        }
      })
      .catch(() => {
        setArtist(null);
        setAlbums([]);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-center py-8 text-[#FEF4EA]">Loading...</div>;
  }

  if (!artist) {
    return <div className="text-center py-8 text-[#FEF4EA]">Artist not found.</div>;
  }

  // Banner: pega wide, se não, fanart
  const bannerUrl = artist.strArtistBanner || artist.strArtistWideThumb || artist.strArtistFanart || "";

  return (
    <div className="relative w-full min-h-screen">
      {/* Banner */}
      <div
        className="w-full h-[234px] overflow-hidden relative"
        style={{ background: bannerUrl ? `url(${bannerUrl}) center center / cover no-repeat` : '#30323F' }}
      >
        {bannerUrl && (
          <img
            src={bannerUrl}
            alt="Artist Banner"
            className="absolute top-0 left-1/2 -translate-x-1/2 h-[234px] w-full object-cover object-center"
            style={{ objectPosition: 'center' }}
          />
        )}
        {/* Overlay escuro/fade */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.85) 100%)',
            mixBlendMode: 'multiply',
          }}
        />
      </div>
      {/* Faixa abaixo do banner */}
      <div className="w-full h-[118px] bg-[#30323F]" />
      {/* Foto de perfil */}
      {artist.strArtistThumb && (
        <img
          src={artist.strArtistThumb}
          alt={artist.strArtist}
          className="absolute rounded-full shadow"
          style={{
            width: '220px',
            height: '220px',
            top: '100px',
            left: '220px',
            objectFit: 'cover',
            border: '6px solid #30323F',
            background: '#30323F',
          }}
        />
      )}
      {/* Nome do artista */}
      <div
        className="absolute"
        style={{
          top: '160px',
          left: '460px',
          padding: '10px',
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontSize: '40px',
            fontWeight: 600,
            color: '#FEF4EA',
            lineHeight: '1.1',
            padding: '10px',
          }}
        >
          {artist.strArtist}
        </div>
      </div>
      {/* Faixa cinza com infos */}
      <div
        className="absolute flex items-center gap-6"
        style={{
          top: '235px',
          left: '460px',
          height: '58px',
          minWidth: '320px',
          background: '#30323F',
          borderRadius: '12px',
          padding: '10px 18px',
          zIndex: 2,
          color: '#FEF4EA'
        }}
      >
        <span style={{ fontWeight: 500, fontSize: '18px' }}>{artist.strStyle}</span><span> • </span>
        <span style={{ fontWeight: 500, fontSize: '18px' }}>{artist.strGenre}</span><span> • </span>
        <span style={{ fontWeight: 500, fontSize: '18px' }}>{artist.intFormedYear}</span><span> • </span>
        <span style={{ fontWeight: 500, fontSize: '18px' }}>{artist.strCountry}</span>
      </div>
      {/* Biografia e link LastFM */}
      
      <div
        className="absolute"
        style={{
          top: '380px', // mesma altura da discografia
          left: '180px',
          width: '750px',
          minHeight: '180px',
          background: '#30323F',
          borderRadius: '18px',
          padding: '18px 18px 18px 18px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
          zIndex: 2,
        }}
      >
        <div
          style={{
            color: '#FEF4EA',
            fontSize: '36px',
            fontWeight: 600,
            marginBottom: '18px',
          }}
        >
          Biography
        </div>
        <div style={{ color: '#FEF4EA', fontSize: '18px', fontWeight: 500, marginBottom: '18px', whiteSpace: 'pre-line' }}>
          {artist.strBiographyEN || 'No biography available.'}
        </div>
        {artist.strLastFMChart && (
          <div style={{ marginTop: '8px' }}>
            <a
              href={artist.strLastFMChart}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#FEF4EA', fontWeight: 600, fontSize: '18px', textDecoration: 'underline', display: 'inline-block' }}
            >
              View on LastFM
            </a>
          </div>
        )}
      </div>
      {/* Conteúdo principal */}
      {/* Discografia: retângulo à direita */}
      <div
        className="absolute"
        style={{
          top: '380px',
          right: '40px',
          width: '496px',
          minHeight: '340px',
          background: '#30323F',
          borderRadius: '18px',
          padding: '10px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
          zIndex: 2,
        }}
      >
        <div
          style={{
            color: '#FEF4EA',
            fontSize: '36px',
            fontWeight: 600,
            marginBottom: '18px',
            marginLeft: '10px',
          }}
        >
          Discography
        </div>
        {albums.length === 0 ? (
          <div style={{ color: '#FEF4EA', marginLeft: '10px' }}>No albums found.</div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px 10px',
              padding: '10px',
            }}
          >
            {albums.map(album => (
              <div
                key={album.idAlbum}
                className="flex flex-col items-center cursor-pointer hover:bg-[#262730] p-2 rounded transition"
                onClick={() => navigate(`/album/${album.idAlbum}`)}
                style={{ minHeight: '180px' }}
              >
                {album.strAlbumThumb ? (
                  <img
                    src={album.strAlbumThumb}
                    alt={album.strAlbum}
                    style={{ width: '114px', height: '114px', borderRadius: '10px', objectFit: 'cover', marginBottom: '10px' }}
                  />
                ) : (
                  <div style={{ width: '114px', height: '114px', background: '#8078a5', borderRadius: '10px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FEF4EA' }}>
                    No cover
                  </div>
                )}
                <div style={{ color: '#FEF4EA', fontSize: '20px', fontWeight: 600, textAlign: 'center', marginBottom: '4px', wordBreak: 'break-word' }}>{album.strAlbum}</div>
                {album.intYearReleased && (
                  <div style={{ color: '#FEF4EA', fontSize: '14px', textAlign: 'center' }}>{album.intYearReleased}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};