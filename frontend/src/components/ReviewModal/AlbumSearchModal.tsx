import React, { useState } from 'react';

export function AlbumSearchModal({ onSelect, onClose }) {
  const [searchArtist, setSearchArtist] = useState('');
  const [searchAlbum, setSearchAlbum] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    setLoading(true);
    const res = await fetch(`http://localhost:3000/api_audiodb/v1/album?artist=${searchArtist}&album=${searchAlbum}`);
    const data = await res.json();
    setResults(data.album || []);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/10">
      <div className="bg-white rounded-lg p-8 shadow-lg w-[400px] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Buscar Álbum</h2>
        <input
          value={searchArtist}
          onChange={e => setSearchArtist(e.target.value)}
          placeholder="Artista"
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          value={searchAlbum}
          onChange={e => setSearchAlbum(e.target.value)}
          placeholder="Álbum (opcional)"
          className="w-full mb-4 p-2 border rounded"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full bg-[#262731] text-white py-2 rounded mb-4"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
        <div>
          {results.map(album => (
            <div key={album.idAlbum} className="flex items-center mb-2">
              <img src={album.strAlbumThumb} alt={album.strAlbum} className="w-12 h-12 mr-2 rounded" />
              <span>{album.strAlbum} - {album.strArtist}</span>
              <button
                onClick={() => onSelect(album)}
                className="ml-auto bg-[#8078a5] text-white px-2 py-1 rounded"
              >
                Selecionar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}