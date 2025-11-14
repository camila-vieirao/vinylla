import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

type SearchResult = {
  id: string;
  type: "artist" | "album" | "track";
  name: string;
  thumb?: string;
  subtitle?: string;
};

export const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const q = searchParams.get("q") || "";

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        // Busca artista
        const artistRes = await fetch(`http://localhost:3000/api_audiodb/v1/artist?s=${encodeURIComponent(q)}`);
        const artistData = await artistRes.json();
        // Busca álbum
        const albumRes = await fetch(`http://localhost:3000/api_audiodb/v1/album?artist=${encodeURIComponent(q)}`);
        const albumData = await albumRes.json();

        const allResults: SearchResult[] = [
          ...(artistData.artists || []).map((a: any) => ({
            id: a.idArtist,
            type: "artist",
            name: a.strArtist,
            thumb: a.strArtistThumb,
            subtitle: a.strGenre,
          })),
          ...(albumData.album || []).map((a: any) => ({
            id: a.idAlbum,
            type: "album",
            name: a.strAlbum,
            thumb: a.strAlbumThumb,
            subtitle: a.strArtist,
          })),
        ];

        setTotal(allResults.length);
        setResults(allResults.slice((page - 1) * 10, page * 10));
        setLoading(false);
      } catch (err) {
        setResults([]);
        setTotal(0);
        setLoading(false);
      }
    })();
  }, [q, page]);

  const handleSelect = (item: SearchResult) => {
    if (item.type === "artist") navigate(`/artist/${item.id}`);
    else if (item.type === "album") navigate(`/album/${item.id}`);
  };

  return (
    <div className="min-h-screen bg-[#05060b] text-white sm:pl-32">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Search</p>
          <h1 className="text-4xl font-semibold">Results for “{q}”</h1>
          <p className="text-sm text-white/60">{total} matches across artists and albums</p>
        </header>
        {loading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm uppercase tracking-[0.4em] text-white/60 shadow-xl backdrop-blur">
          Loading…
        </div>
      ) : (
        <>
          {results.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/70 shadow-xl backdrop-blur">
              No results found. Try a different artist or album.
            </div>
          ) : (
            <ul className="space-y-3">
              {results.map((item) => (
                <li key={item.type + item.id}>
                  <button
                    type="button"
                    className="group flex w-full items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-left shadow-lg backdrop-blur transition hover:border-white/30 hover:bg-white/10"
                    onClick={() => handleSelect(item)}
                  >
                    {item.thumb ? (
                      <img src={item.thumb} alt={item.name} className="h-14 w-14 rounded-2xl object-cover" />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-xs uppercase text-white/60">
                        No art
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-base font-semibold text-white">{item.name}</p>
                      {item.subtitle && <p className="text-sm text-white/70">{item.subtitle}</p>}
                      <span className="text-xs uppercase tracking-[0.3em] text-white/50">{item.type}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm shadow-lg backdrop-blur">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded-full border border-white/15 px-4 py-2 text-white/70 transition hover:border-white/30 hover:text-white disabled:opacity-30"
            >
              Previous
            </button>
            <span className="text-white/70">
              Page {page} of {Math.ceil(total / 10) || 1}
            </span>
            <button
              type="button"
              disabled={page * 10 >= total}
              onClick={() => setPage(page + 1)}
              className="rounded-full border border-white/15 px-4 py-2 text-white/70 transition hover:border-white/30 hover:text-white disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </>
        )}
      </div>
    </div>
  );
};