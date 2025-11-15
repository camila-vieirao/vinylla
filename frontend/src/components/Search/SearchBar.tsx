import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

type SearchResult = {
  id: string;
  type: "artist" | "album" | "track";
  name: string;
  thumb?: string;
  subtitle?: string;
};

interface SearchBarProps {
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ className }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Busca sugestões ao digitar
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (value.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        // Busca artista
        const artistRes = await fetch(`http://localhost:3000/api_audiodb/v1/artist?s=${encodeURIComponent(value)}`);
        const artistData = await artistRes.json();
        // Busca álbum
        const albumRes = await fetch(`http://localhost:3000/api_audiodb/v1/album?artist=${encodeURIComponent(value)}`);
        const albumData = await albumRes.json();

        const results: SearchResult[] = [
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
        ].slice(0, 10);

        setResults(results);
        setShowDropdown(true);
        setLoading(false);
      } catch (err) {
        setResults([]);
        setShowDropdown(false);
        setLoading(false);
      }
    }, 300);
  };

  // Ao clicar em sugestão
  const handleSelect = (item: SearchResult) => {
    setShowDropdown(false);
    setQuery("");
    if (item.type === "artist") navigate(`/artist/${item.id}`);
    else if (item.type === "album") navigate(`/album/${item.id}`);
  };

  // Ao submeter (enter ou botão)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <>
      <style>{`
        .search-results-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .search-results-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .search-results-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 999px;
        }
      `}</style>
      <form className={`relative ${className || ""}`} onSubmit={handleSubmit} autoComplete="off">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <FaSearch className="text-neutral-600" />
      </div>
      <input
        type="search"
        value={query}
        onChange={handleChange}
        placeholder="Search for artist, album, or track..."
        className="block w-full p-3 ps-10 text-sm text-neutral-600 border border-[#3c3e4e] rounded-3xl bg-white placeholder-neutral-600 outline-none"
      />
      {showDropdown && (
        <div className="absolute left-0 right-0 z-50 mt-2">
          {results.length > 0 && (
            <div className="rounded-3xl border border-white/10 bg-[#080b16]/95 text-white shadow-2xl backdrop-blur">
              <button
                type="button"
                className="flex w-full items-center justify-between border-b border-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white/60 transition hover:text-white"
                onClick={() => {
                  setShowDropdown(false);
                  navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                }}
              >
                See all results
                <span className="text-white/40">↗</span>
              </button>
              <div
                className="search-results-scroll max-h-80 overflow-y-auto"
                style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.35) transparent" }}
              >
                {results.map(item => (
                  <button
                    key={item.type + item.id}
                    type="button"
                    className="flex w-full items-center gap-4 px-5 py-3 text-left transition hover:bg-white/5"
                    onClick={() => handleSelect(item)}
                  >
                    {item.thumb ? (
                      <img src={item.thumb} alt={item.name} className="h-12 w-12 rounded-2xl object-cover" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c5bff] to-[#ff6ec4] text-base font-semibold text-[#0b0615]">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-1 flex-col">
                      <span className="text-base font-semibold">{item.name}</span>
                      {item.subtitle && <span className="text-sm text-white/60">{item.subtitle}</span>}
                    </div>
                    <span className="rounded-full border border-white/15 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-white/70">
                      {item.type}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {!loading && results.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-[#080b16]/95 p-5 text-center text-sm text-white/60 shadow-2xl backdrop-blur">
              No results found.
            </div>
          )}
        </div>
      )}
      </form>
    </>
  );
};