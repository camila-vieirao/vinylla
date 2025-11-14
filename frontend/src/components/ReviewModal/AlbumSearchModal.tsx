import { useState } from "react";

type Album = {
  idAlbum: string;
  strAlbum: string;
  strArtist: string;
  strAlbumThumb: string;
};

interface AlbumSearchModalProps {
  onSelect: (album: Album) => void;
  onClose: () => void;
}

export function AlbumSearchModal({ onSelect, onClose }: AlbumSearchModalProps) {
  const [searchArtist, setSearchArtist] = useState("");
  const [searchAlbum, setSearchAlbum] = useState("");
  const [results, setResults] = useState<Album[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearch() {
    setLoading(true);
    const res = await fetch(
      `http://localhost:3000/api_audiodb/v1/album?artist=${searchArtist}&album=${searchAlbum}`
    );
    const data = await res.json();
    setResults(data.album || []);
    setVisibleCount(5);
    setLoading(false);
    setHasSearched(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#080b16] text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Review</p>
            <p className="text-xl font-semibold">Search for an album</p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-full border border-white/10 p-2 text-lg text-white/70 transition hover:border-white/40 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Artist</p>
              <input
                value={searchArtist}
                onChange={(e) => setSearchArtist(e.target.value)}
                placeholder="Enter artist name"
                className="mt-2 w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none"
              />
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Album (optional)</p>
              <input
                value={searchAlbum}
                onChange={(e) => setSearchAlbum(e.target.value)}
                placeholder="Album title"
                className="mt-2 w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading || !searchArtist.trim()}
            className="w-full rounded-full bg-gradient-to-r from-[#7c5bff] to-[#ff6ec4] py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg transition hover:opacity-90 disabled:opacity-40 cursor-pointer"
          >
            {loading ? "Searching..." : "Search"}
          </button>

          <div
            className="max-h-64 space-y-3 overflow-y-auto pr-2 custom-scroll"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#7c5bff transparent",
            }}
          >
            <style>{`
              .custom-scroll::-webkit-scrollbar {
                width: 6px;
              }
              .custom-scroll::-webkit-scrollbar-track {
                background: transparent;
              }
              .custom-scroll::-webkit-scrollbar-thumb {
                background: rgba(124, 91, 255, 0.5);
                border-radius: 999px;
              }
            `}</style>
            {results.length === 0 && !loading && hasSearched && (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-center text-sm font-semibold text-white/70">
                Could not find the searched album/artist.
              </div>
            )}
            {results.slice(0, visibleCount).map((album) => (
              <div
                key={album.idAlbum}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
              >
                <img
                  src={album.strAlbumThumb}
                  alt={album.strAlbum}
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{album.strAlbum}</p>
                  <p className="text-xs text-white/60">{album.strArtist}</p>
                </div>
                <button
                  onClick={() => onSelect(album)}
                  className="cursor-pointer rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white/10"
                >
                  Select
                </button>
              </div>
            ))}
          </div>

          {results.length > visibleCount && (
            <button
              onClick={() => setVisibleCount(visibleCount + 5)}
              className="cursor-pointer w-full rounded-full border border-white/20 py-2 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              See more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
