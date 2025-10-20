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
    <div className="max-w-2xl mx-50 py-8">
      <h1 className="text-2xl font-bold mb-4 text-[#FEF4EA]">Results for "{q}"</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {results.length === 0 ? (
            <div className="text-[#FEF4EA]">No results found.</div>
          ) : (
            <ul>
              {results.map(item => (
                <li
                  key={item.type + item.id}
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-[#262730] transition rounded"
                  onClick={() => handleSelect(item)}
                >
                  {item.thumb && (
                    <img src={item.thumb} alt={item.name} className="w-10 h-10 rounded mr-3" />
                  )}
                  <div>
                    <div className="font-medium text-[#FEF4EA]">{item.name}</div>
                    {item.subtitle && <div className="text-xs text-[#FEF4EA]">{item.subtitle}</div>}
                    <span className="text-xs text-[#FEF4EA]">{item.type}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-between mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 rounded bg-[#8078a5] text-white disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-[#FEF4EA]">
              Page {page} of {Math.ceil(total / 10) || 1}
            </span>
            <button
              disabled={page * 10 >= total}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 rounded bg-[#8078a5] text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};