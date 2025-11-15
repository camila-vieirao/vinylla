import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api/api";
import logo from "../../assets/logo 1.png";

export default function SelectTags() {
  const [tags, setTags] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadTags() {
      try {
        const res = await api.get("/api_lastfm/v1/toptags?limit=50");
        setTags(res.data.tags.tag);
      } catch (error) {
        console.error(error);
        toast.error("Error loading tags.");
      } finally {
        setLoading(false);
      }
    }

    loadTags();
  }, []);

  function toggleTag(name: string) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  }

  const handleSave = async () => {
    if (selected.length === 0) {
      toast.warning("Please, select at least one tag.");
      return;
    }

    try {
      await Promise.all(
        selected.map((tagName) => {
          const index = tags.findIndex((t) => t.name === tagName);
          const tagId = index + 1;

          return api.post(
            `/api/users/tags/${tagId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
        })
      );

      toast.success("Tags successfully saved!");
      navigate("/feed");
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05060b] text-white">
        <p className="text-sm uppercase tracking-[0.4em] text-white/60">
          Loading tags…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05060b] text-white">
      <style>{`
        .tag-scroll::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .tag-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .tag-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.25);
          border-radius: 999px;
        }
      `}</style>
      <div className="relative isolate flex min-h-screen items-center justify-center px-6 py-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(124,91,255,0.18),_transparent_60%)]" />
        <div className="w-full max-w-6xl space-y-10">
          <div className="flex justify-center">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Vinylla" className="h-16 w-16 rounded-2xl" />
              <span className="text-3xl font-semibold tracking-wide">Vinylla.</span>
            </Link>
          </div>

          <section className="rounded-[36px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
            <div className="mb-8 space-y-4 text-center">
              <h1 className="text-4xl font-semibold leading-tight">
                Choose your sonic DNA
              </h1>
            </div>

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                  Genres
                </p>
                <h2 className="text-2xl font-semibold">Tap to select</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelected([])}
                className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/60 transition hover:border-white/40 hover:text-white"
              >
                Clear all
              </button>
            </div>

            <div
              className="tag-scroll mx-auto flex flex-wrap justify-center gap-3 overflow-y-auto rounded-3xl border border-white/10 bg-[#080b16]/60 p-5"
              style={{
                maxHeight: "360px",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(255,255,255,0.25) transparent",
              }}
            >
              {tags.map((tag) => {
                const isSelected = selected.includes(tag.name);
                return (
                  <button
                    key={tag.name}
                    type="button"
                    onClick={() => toggleTag(tag.name)}
                    aria-pressed={isSelected}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      isSelected
                        ? "border-transparent bg-gradient-to-r from-[#7c5bff] via-[#b978ff] to-[#ff6ec4] text-[#0b0615]"
                        : "border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="mt-8 w-full rounded-full bg-gradient-to-r from-[#7c5bff] via-[#b978ff] to-[#ff6ec4] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg transition hover:opacity-95"
            >
              Save and continue
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
