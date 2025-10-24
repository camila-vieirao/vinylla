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
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/10">
      <div className="bg-[#272730] rounded-lg p-8 shadow-lg w-[520px] relative">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-2 right-2 text-gray-500 text-xl"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-[#FEF4EA]">Search Album</h2>
        <input
          value={searchArtist}
          onChange={(e) => setSearchArtist(e.target.value)}
          placeholder="Artist"
          className="w-full mb-2 p-2 border rounded text-[#FEF4EA]"
        />
        <input
          value={searchAlbum}
          onChange={(e) => setSearchAlbum(e.target.value)}
          placeholder="Album (optional)"
          className="w-full mb-4 p-2 border rounded text-[#FEF4EA]"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="cursor-pointer w-full bg-[#6B818C] text-[#FEF4EA] py-2 rounded-full mb-4 hover:bg-[#435761]"
        >
          {loading ? "Searching..." : "Search"}
        </button>
        <div
          className="max-h-64 overflow-y-auto mb-2 pr-1 pl-6 custom-scrollbar"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#262730 #464753",
          }}
        >
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #262730;
              border-radius: 6px;
            }
          `}</style>
          {results.length === 0 && !loading && hasSearched && (
            <div className="text-center text-[#E16A71] py-4 font-bold">
              Could not find the searched album/artist.
            </div>
          )}
          {results.slice(0, visibleCount).map((album) => (
            <div key={album.idAlbum} className="flex items-center mb-2">
              <img
                src={album.strAlbumThumb}
                alt={album.strAlbum}
                className="w-12 h-12 mr-2 rounded"
              />
              <span className="text-[#FEF4EA] max-w-[160px] break-words whitespace-normal">
                {album.strAlbum}
              </span>
              <button
                onClick={() => onSelect(album)}
                className="cursor-pointer ml-auto mr-6 bg-[#8078a5] text-[#FEF4EA] px-5 py-1 rounded-full hover:bg-[#9a8fc1]"
              >
                Select
              </button>
            </div>
          ))}
        </div>
        {results.length > visibleCount && (
          <button
            onClick={() => setVisibleCount(visibleCount + 5)}
            className="cursor-pointer w-full mt-2 bg-[#6B818C] text-[#FEF4EA] py-2 rounded-full hover:bg-[#435761]"
          >
            See more
          </button>
        )}
      </div>
    </div>
  );
}
