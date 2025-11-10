import { useEffect, useState } from "react";
import api from "../../services/api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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

  if (loading)
    return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className="h-screen flex items-center justify-center bg-[#3d3d4f]">
      <div className="bg-[#262730] p-10 rounded-2xl w-full max-w-2xl shadow-lg flex flex-col items-center">
        <h1 className="text-white text-3xl font-semibold mb-6 text-center">
          Choose your <span className="text-[#6a4c7d]">musical styles</span>
        </h1>

        <p className="text-gray-300 text-sm mb-6 text-center max-w-md">
          Select some genres to personalize your experience on the platform.
        </p>

        <div className="flex flex-wrap gap-3 justify-center max-h-80 overflow-y-auto pr-2">
          {tags.map((tag) => (
            <button
              key={tag.name}
              onClick={() => toggleTag(tag.name)}
              className={`cursor-pointer px-4 py-2 rounded-full text-sm transition border
              ${
                selected.includes(tag.name)
                  ? "bg-[#6a4c7d] border-[#6a4c7d] text-white"
                  : "bg-[#f8f6f3] border-gray-300 text-gray-800 hover:bg-[#e8e3df]"
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="mt-8 w-full py-3 bg-[#6a4c7d] text-white rounded-lg font-semibold hover:bg-[#5a3f6b] transition cursor-pointer"
        >
          Save and Continue
        </button>
      </div>
    </div>
  );
}
