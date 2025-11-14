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
    return <div className="py-8 text-center text-[#FEF4EA]">Loading...</div>;
  }

  if (!album) {
    return <div className="py-8 text-center text-[#FEF4EA]">Album not found.</div>;
  }

  return (
    <div className="min-h-screen bg-[#05060b] text-white sm:pl-32">
      <section className="relative isolate">
        <div
          className="h-60 w-full bg-[#30323F]"
          style={
            album.strAlbumThumb
              ? {
                  backgroundImage: `url(${album.strAlbumThumb})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-[#05060b]" />
      </section>

      <div className="relative z-10 mx-auto -mt-24 max-w-6xl px-6">
        <div className="flex flex-col gap-6 rounded-3xl p-6 shadow-2xl sm:flex-row sm:items-center">
          <div className="flex items-center gap-6">
            <div className="h-32 w-32 rounded-2xl border border-white/10 bg-white/10 shadow-2xl sm:h-40 sm:w-40">
              {album.strAlbumThumb ? (
                <img
                  src={album.strAlbumThumb}
                  alt={album.strAlbum}
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-2xl text-sm uppercase text-white/50">
                  No cover
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Album</p>
                <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{album.strAlbum}</h1>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/artist/${idArtist}`)}
                className="text-left text-lg font-semibold text-white/80 transition hover:text-white"
              >
                {album.strArtist}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            {album.intYearReleased && (
              <span className="rounded-full border border-white/20 bg-white/5 px-4 py-1 text-white/80">
                {album.intYearReleased}
              </span>
            )}
            {album.strStyle && (
              <span className="rounded-full border border-white/20 bg-white/5 px-4 py-1 text-white/80">
                {album.strStyle}
              </span>
            )}
            {album.strLabel && (
              <span className="rounded-full border border-white/20 bg-white/5 px-4 py-1 text-white/80">
                {album.strLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-12 pt-12 space-y-8">
        <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-gradient-to-r from-[#7c5bff] to-[#ff6ec4]" />
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Overview</p>
                <h2 className="text-3xl font-semibold">Description</h2>
              </div>
            </div>
            <div
              className="mt-6 max-h-72 overflow-y-auto pr-2 text-lg leading-relaxed text-white/80 whitespace-pre-line"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(255,255,255,0.25) transparent",
              }}
            >
              {album.strDescriptionEN || "No description available."}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-gradient-to-r from-[#ffb347] to-[#ffcc33]" />
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Listing</p>
                <h2 className="text-3xl font-semibold">Tracks</h2>
              </div>
            </div>
            <div
              className="mt-6 max-h-80 overflow-y-auto pr-2"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(255,255,255,0.25) transparent",
              }}
            >
              {tracks.length === 0 ? (
                <p className="text-white/70">No tracks found.</p>
              ) : (
                <ul className="space-y-3">
                  {tracks.map((track, index) => (
                    <li
                      key={track.idTrack}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80"
                    >
                      <span className="text-white/50">{index + 1}.</span>
                      <span className="flex-1 px-3 text-white">{track.strTrack}</span>
                      <span className="h-2 w-2 rounded-full bg-white/20" />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">More</p>
              <h2 className="text-3xl font-semibold">More from {album.strArtist}</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/artist/${idArtist}`)}
              className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
            >
              Visit artist page
            </button>
          </div>

          {moreAlbums.length === 0 ? (
            <p className="mt-6 text-white/70">No other albums found.</p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {moreAlbums.map((item) => (
                <button
                  type="button"
                  key={item.idAlbum}
                  onClick={() => navigate(`/album/${item.idAlbum}`)}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-2 text-left transition hover:border-white/30 hover:bg-white/10"
                >
                  {item.strAlbumThumb ? (
                    <img
                      src={item.strAlbumThumb}
                      alt={item.strAlbum}
                      className="h-35 w-35 items-center justify-center rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-28 w-full items-center justify-center rounded-xl bg-white/10 text-xs uppercase text-white/60">
                      No cover
                    </div>
                  )}
                  <p className="mt-3 text-sm font-semibold text-white">{item.strAlbum}</p>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
