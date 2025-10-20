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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      {showDropdown && results.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          <div
            className="text-left pl-4 py-2 text-[#8078a5] cursor-pointer hover:underline"
            onClick={() => {
              setShowDropdown(false);
              navigate(`/search?q=${encodeURIComponent(query.trim())}`);
            }}
          >
            See all results
          </div>
          {results.map(item => (
            <div
              key={item.type + item.id}
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-[#f3f3f3]"
              onClick={() => handleSelect(item)}
            >
              {item.thumb && (
                <img src={item.thumb} alt={item.name} className="w-8 h-8 rounded mr-3" />
              )}
              <div>
                <div className="font-medium">{item.name}</div>
                {item.subtitle && <div className="text-xs text-gray-500">{item.subtitle}</div>}
                <span className="text-xs text-[#8078a5]">{item.type}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {showDropdown && !loading && results.length === 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-50 p-4 text-center text-gray-500">
          No results found.
        </div>
      )}
    </form>
  );
};