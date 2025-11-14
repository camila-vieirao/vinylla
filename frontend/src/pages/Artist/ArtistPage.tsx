import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

    fetch(`http://localhost:3000/api_audiodb/v1/lookup/artist/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.artists && data.artists.length > 0) {
          const foundArtist = data.artists[0];
          setArtist(foundArtist);
          fetch(`http://localhost:3000/api_audiodb/v1/album?artist=${encodeURIComponent(foundArtist.strArtist)}`)
            .then((res) => res.json())
            .then((albumData) => {
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
    return <div className="py-8 text-center text-[#FEF4EA]">Loading...</div>;
  }

  if (!artist) {
    return <div className="py-8 text-center text-[#FEF4EA]">Artist not found.</div>;
  }

  const bannerUrl = artist.strArtistBanner || artist.strArtistWideThumb || artist.strArtistFanart || "";
  const infoChips = [artist.strStyle, artist.strGenre, artist.intFormedYear, artist.strCountry].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-[#05060b] text-white sm:pl-32">
      <section className="relative isolate">
        <div
          className="h-60 w-full bg-[#30323F]"
          style={
            bannerUrl
              ? {
                  backgroundImage: `url(${bannerUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-[#05060b]" />
      </section>

      <div className="relative z-10 mx-auto -mt-40 max-w-6xl px-6">
        <div className="flex flex-col gap-6 rounded-3xl pt-16 shadow-2xl sm:flex-row sm:items-center">
          {artist.strArtistThumb && (
            <img
              src={artist.strArtistThumb}
              alt={artist.strArtist}
              className="h-40 w-40 rounded-2xl border border-white/10 object-cover shadow-2xl sm:h-48 sm:w-48"
            />
          )}
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Artist</p>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">{artist.strArtist}</h1>
            </div>
            {infoChips.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {infoChips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/20 bg-white/5 px-4 py-1 text-sm font-medium text-white/80"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-12 pt-12">
        <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-gradient-to-r from-[#7c5bff] to-[#ff6ec4]" />
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Story</p>
                <h2 className="text-3xl font-semibold">Biography</h2>
              </div>
            </div>
            <div
              className="biography-scroll mt-6 max-h-100 overflow-y-auto pr-2 text-lg leading-relaxed text-white/80 whitespace-pre-line"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(255,255,255,0.25) transparent",
              }}
            >
              {artist.strBiographyEN || "No biography available."}
            </div>
            <style>{`
              .biography-scroll::-webkit-scrollbar {
                width: 6px;
              }
              .biography-scroll::-webkit-scrollbar-track {
                background: transparent;
              }
              .biography-scroll::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,0.25);
                border-radius: 999px;
              }
            `}</style>
            {artist.strLastFMChart && (
              <a
                href={artist.strLastFMChart}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-white/80 underline-offset-4 hover:text-white"
              >
                View on LastFM →
              </a>
            )}
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-gradient-to-r from-[#ffb347] to-[#ffcc33]" />
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Catalogue</p>
                <h2 className="text-3xl font-semibold">Discography</h2>
              </div>
            </div>
            {albums.length === 0 ? (
              <p className="mt-6 text-white/70">No albums found.</p>
            ) : (
              <div
                className="mt-6 space-y-3 overflow-y-auto pr-2"
                style={{
                  maxHeight: "28rem",
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(255,255,255,0.3) transparent",
                }}
              >
                <style>{`
                  .artist-scroll::-webkit-scrollbar {
                    width: 6px;
                  }
                  .artist-scroll::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  .artist-scroll::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.25);
                    border-radius: 999px;
                  }
                `}</style>
                <div className="artist-scroll space-y-3">
                  {albums.map((album) => (
                    <button
                      type="button"
                      key={album.idAlbum}
                      onClick={() => navigate(`/album/${album.idAlbum}`)}
                      className="group flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition hover:border-white/30 hover:bg-white/10"
                    >
                      {album.strAlbumThumb ? (
                        <img
                          src={album.strAlbumThumb}
                          alt={album.strAlbum}
                          className="h-16 w-16 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 text-xs uppercase text-white/60">
                          No cover
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-base font-semibold">{album.strAlbum}</p>
                        {album.intYearReleased && (
                          <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                            {album.intYearReleased}
                          </p>
                        )}
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50 transition group-hover:text-white">
                        View
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};