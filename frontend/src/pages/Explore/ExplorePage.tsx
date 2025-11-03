import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface TrendingItem {
  // Removido, pois Last.fm tem estrutura diferente
}

export const ExplorePage: React.FC = () => {
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    // Fetch top artists
    fetch("http://localhost:3000/api_lastfm/v1/topartists")
      .then(res => res.json())
      .then(data => {
        setTopArtists(data.artists?.artist || []);
        // Fetch top tracks
        fetch("http://localhost:3000/api_lastfm/v1/toptracks")
          .then(res => res.json())
          .then(data2 => {
            setTopTracks(data2.tracks?.track || []);
            setLoading(false);
          })
          .catch(() => {
            setTopTracks([]);
            setLoading(false);
          });
      })
      .catch(() => {
        setTopArtists([]);
        setTopTracks([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
  return <div className="text-center py-8 text-[#FEF4EA]">Loading...</div>;
  }

  return (
    <div className="bg-[#23232A] py-8" style={{ paddingLeft: 'max(80px, 8vw)', paddingRight: 'max(80px, 8vw)' }}>
      <h1 style={{ color: '#FEF4EA', fontSize: '38px', fontWeight: 700, marginBottom: '32px' }}>Explore</h1>
      {/* Top Artists */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ color: '#FEF4EA', fontSize: '28px', fontWeight: 600, marginBottom: '18px' }}>Top Artists</div>
        <div style={{ display: 'flex', gap: '36px', flexWrap: 'wrap' }}>
          {topArtists.length === 0 ? (
            <span style={{ color: '#FEF4EA', fontSize: '16px' }}>No top artists found.</span>
          ) : (
            topArtists.map(artist => {
              // Pega imagem extralarge ou a maior disponível
              const imgObj = artist.image?.find((img: any) => img.size === 'extralarge') || artist.image?.[artist.image.length - 1];
              return (
                <div key={artist.mbid || artist.name} style={{ width: '160px', cursor: 'pointer', background: '#30323F', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={() => window.open(artist.url, '_blank')}>
                  <img src={imgObj?.['#text'] || ''} alt={artist.name} style={{ width: '120px', height: '120px', borderRadius: '10px', objectFit: 'cover', marginBottom: '10px', background: '#8078a5' }} />
                  <span style={{ color: '#FEF4EA', fontSize: '16px', fontWeight: 600, textAlign: 'center', wordBreak: 'break-word', marginBottom: '4px' }}>{artist.name}</span>
                  <span style={{ color: '#FEF4EA', fontSize: '15px', textAlign: 'center', wordBreak: 'break-word' }}>{artist.playcount} plays</span>
                </div>
              );
            })
          )}
        </div>
      </div>
      {/* Top Tracks */}
      <div>
        <div style={{ color: '#FEF4EA', fontSize: '28px', fontWeight: 600, marginBottom: '18px' }}>Top Tracks</div>
        <div style={{ display: 'flex', gap: '36px', flexWrap: 'wrap' }}>
          {topTracks.length === 0 ? (
            <span style={{ color: '#FEF4EA', fontSize: '16px' }}>No top tracks found.</span>
          ) : (
            topTracks.map(track => {
              const imgObj = track.image?.find((img: any) => img.size === 'extralarge') || track.image?.[track.image.length - 1];
              return (
                <div key={track.mbid || track.name} style={{ width: '160px', cursor: 'pointer', background: '#30323F', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={() => window.open(track.url, '_blank')}>
                  <img src={imgObj?.['#text'] || ''} alt={track.name} style={{ width: '120px', height: '120px', borderRadius: '10px', objectFit: 'cover', marginBottom: '10px', background: '#8078a5' }} />
                  <span style={{ color: '#FEF4EA', fontSize: '16px', fontWeight: 600, textAlign: 'center', wordBreak: 'break-word', marginBottom: '4px' }}>{track.name}</span>
                  <span style={{ color: '#FEF4EA', fontSize: '15px', textAlign: 'center', wordBreak: 'break-word' }}>{track.artist?.name}</span>
                  <span style={{ color: '#FEF4EA', fontSize: '13px', textAlign: 'center', wordBreak: 'break-word', marginTop: '2px' }}>{track.playcount} plays</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
