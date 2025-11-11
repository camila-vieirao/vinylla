import { FaImage, FaVideo, FaMusic } from "react-icons/fa";
import Post from "../../components/Post/Post";
import avatar from "../../assets/borabill_avatar.jpeg";
import { MdGroups } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import api from "../../services/api/api";
import { toast } from "react-toastify";

const Feed: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [postText, setPostText] = useState("");
  const [postImg, setPostImg] = useState<File | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const res = await api.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      }
    }

    fetchUser();
  }, []);

  async function handleCreatePost() {
    if (!postText.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const formData = new FormData();
      formData.append("postText", postText);
      if (postImg) formData.append("postImg", postImg);

      await api.post("/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setPostText("");
      setPostImg(null);
      toast.success("Post created successfully!");
    } catch (error: any) {
      toast.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#464753] to-[#23232A]">
      <div className="p-14 ml-[112px] flex gap-8">
        <div className="flex flex-col items-start flex-1">
          {user && (
            <div className="bg-[#262730] max-w-2xl w-full p-6 rounded-2xl mb-6 shadow-lg border border-[#6B818C]">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="flex-shrink-0 text-sm bg-gray-800 rounded-full cursor-pointer shadow-md border border-[#6B818C]"
                >
                  <img
                    className="w-12 h-12 rounded-full object-cover object-center"
                    src={
                      user.profilePicture
                        ? `http://localhost:3000/uploads/profile/${user.profilePicture}`
                        : avatar
                    }
                    alt="user photo"
                  />
                </button>

                <div className="bg-[#f8f6f3] rounded-2xl p-4 flex-1 flex flex-col gap-4 border border-[#6B818C] shadow-sm">
                  <input
                    type="text"
                    className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500 text-lg"
                    placeholder={`What's on your mind, ${user.name}?`}
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                  />

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex gap-4 text-gray-600">
                      <button className="flex items-center gap-1 hover:text-black transition cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="post-image"
                          onChange={(e) =>
                            setPostImg(e.target.files?.[0] || null)
                          }
                        />
                        <label
                          htmlFor="post-image"
                          className="flex items-center gap-1 hover:text-black transition cursor-pointer"
                        >
                          <FaImage /> Image
                        </label>
                      </button>
                      <button className="flex items-center gap-1 hover:text-black transition cursor-pointer">
                        <FaVideo /> Video
                      </button>
                      <button className="flex items-center gap-1 hover:text-black transition cursor-pointer">
                        <FaMusic /> Music
                      </button>
                    </div>
                    <button
                      onClick={handleCreatePost}
                      className="bg-[#6a4c7d] font-semibold cursor-pointer text-white px-8 py-1 rounded-full hover:bg-[#5a3f6b] transition shadow-md"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="w-full max-w-2xl space-y-6">
            {!user && (
              <div className="bg-[#262730] rounded-2xl p-6 text-center shadow-lg border border-[#6B818C]">
                <p className="text-gray-400 mb-3 text-lg">
                  Want to join the conversation?
                </p>
                <button
                  className="cursor-pointer bg-[#6a4c7d] text-white px-6 py-2 rounded-full hover:bg-[#5a3f6b] transition shadow-md"
                  onClick={() => {
                    window.location.href = "/login";
                  }}
                >
                  Sign In to Post
                </button>
              </div>
            )}
            <div>
              {/* Linha de demarcação fina acima dos posts */}
              <div className="border-t border-[#6B818C] mb-4 mt-2"></div>
              <Post />
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          <div className="w-74 mr-8">
            <div className="bg-[#262730] rounded-2xl p-6 text-white shadow-lg border border-[#6B818C]">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#6B818C]">
                <h1 className="text-2xl font-semibold">Groups</h1>
                <MdGroups size={26} />
              </div>

              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-neutral-700 ps-3 p-2 w-full bg-white rounded-3xl cursor-pointer border border-[#6B818C] shadow-sm">
                  <img
                    className="w-8 h-8 rounded-full object-cover object-center"
                    src={avatar}
                    alt="group avatar"
                  />
                  <span>GROUP_NAME</span>
                </li>
              </ul>

              <button className="p-2 w-full hover:scale-102 transition-all duration-300 mt-8 cursor-pointer bg-[#60435F] rounded-2xl shadow-md">
                See all
              </button>
            </div>
          </div>

          <div className="w-74 mr-8">
            <div className="bg-[#262730] rounded-2xl p-6 text-white shadow-lg border border-[#6B818C]">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#6B818C]">
                <h1 className="text-2xl font-semibold">Suggestions</h1>
                <IoPersonAddSharp size={20} />
              </div>

              <ul className="flex justify-center space-y-2 text-sm">
                <li className="flex items-center text-neutral-700 ps-3 p-2 w-full">
                  <img
                    className="w-14 h-14 rounded-full object-cover object-center cursor-pointer hover:scale-108 duration-400"
                    src={avatar}
                    alt="suggestion avatar"
                  />
                </li>
                <li className="flex items-center text-neutral-700 ps-3 p-2 w-full">
                  <img
                    className="w-14 h-14 rounded-full object-cover object-center cursor-pointer hover:scale-108 duration-400"
                    src={avatar}
                    alt="suggestion avatar"
                  />
                </li>
                <li className="flex items-center text-neutral-700 ps-3 p-2 w-full">
                  <img
                    className="w-14 h-14 rounded-full object-cover object-center cursor-pointer hover:scale-108 duration-400"
                    src={avatar}
                    alt="suggestion avatar"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
