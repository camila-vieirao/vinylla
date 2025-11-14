import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Album {
  name: string;
  url: string;
  artist: { name: string; url: string };
  image: { size: string; ['#text']: string }[];
}

interface Tag {
  id: number;
  name: string;
}

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState<Tag[]>([]);
  const [albumsByTag, setAlbumsByTag] = useState<{ [tag: string]: Album[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch userId from /api/users/me
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:3000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(user => {
        // Fetch tags for user
        fetch(`http://localhost:3000/api/users/${user.id}/tags`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => res.json())
          .then(tagsRes => {
            setTags(tagsRes);
            // For each tag, fetch top albums
            Promise.all(
              tagsRes.map((tag: Tag) =>
                fetch(`http://localhost:3000/api_lastfm/v1/topalbums/tag/${encodeURIComponent(tag.name)}?limit=12`)
                  .then(res => res.json())
                  .then(data => ({ tag: tag.name, albums: data.albums?.album || [] }))
                  .catch(() => ({ tag: tag.name, albums: [] }))
              )
            ).then(results => {
              const albumsMap: { [tag: string]: Album[] } = {};
              results.forEach(r => {
                albumsMap[r.tag] = r.albums;
              });
              setAlbumsByTag(albumsMap);
              setLoading(false);
            });
          })
          .catch(() => {
            setTags([]);
            setLoading(false);
          });
      })
      .catch(() => {
        setTags([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05060b] text-white sm:pl-32">
        <p className="text-sm uppercase tracking-[0.4em] text-white/60">Loading recommendations…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05060b] text-white sm:pl-32">
      <section className="bg-[radial-gradient(circle_at_top,_rgba(124,91,255,0.15),_transparent_60%)] py-12">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Discover</p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Curated albums for you</h1>
          <p className="mt-3 text-white/70">
            Fresh drops based on your favorite tags and listening habits.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 pb-16">
        {tags.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-lg text-white/70 shadow-xl backdrop-blur">
            You haven’t selected any genres yet. Head over to your profile to choose a few and personalize this feed.
          </div>
        ) : (
          tags.map((tag) => (
            <section key={tag.id} className="mt-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-gradient-to-r from-[#7c5bff] to-[#ff6ec4]" />
                  <h2 className="text-2xl font-semibold">{tag.name}</h2>
                </div>
              </div>

              {albumsByTag[tag.name]?.length === 0 ? (
                <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
                  No albums found for this genre.
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {albumsByTag[tag.name].map((album) => {
                  const imgObj = album.image?.find((img: any) => img.size === 'extralarge') || album.image?.[album.image.length - 1];
                  const handleAlbumClick = async () => {
                      const cleanAlbumName = album.name.replace(/\s*\(Remastered\)/gi, '').trim();
                      const res = await fetch(
                        `http://localhost:3000/api_audiodb/v1/album?artist=${encodeURIComponent(album.artist.name)}&album=${encodeURIComponent(cleanAlbumName)}`
                      );
                      const data = await res.json();
                      if (data.album && Array.isArray(data.album) && data.album.length > 0) {
                        navigate(`/album/${data.album[0].idAlbum}`);
                      } else {
                        alert("Album not found in AudioDB");
                      }
                    };
                    return (
                      <button
                        type="button"
                        key={album.name + album.artist.name}
                        onClick={handleAlbumClick}
                        className="group rounded-3xl border border-white/10 bg-white/5 p-4 text-left shadow-lg backdrop-blur transition hover:border-white/30 hover:bg-white/10"
                      >
                        {imgObj?.["#text"] ? (
                          <img
                            src={imgObj["#text"]}
                            alt={album.name}
                            className="h-50 w-50 rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="flex h-40 w-full items-center justify-center rounded-2xl bg-white/10 text-xs uppercase text-white/60">
                            No cover
                          </div>
                        )}
                        <div className="mt-3 space-y-1">
                          <p className="text-sm font-semibold text-white">{album.name}</p>
                          <p className="text-xs uppercase tracking-[0.3em] text-white/50">{album.artist?.name}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          ))
        )}
      </div>
    </div>
  );
};
