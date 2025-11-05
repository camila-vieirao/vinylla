import React, { useEffect, useState } from "react";
import { FaImage, FaMusic, FaVideo } from "react-icons/fa";
import avatar from "../../assets/borabill_avatar.jpeg";
import api from "../../services/api/api";

interface CreatePostModalProps {
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose }) => {
  const [user, setUser] = useState<any>(null);

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

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40"
      onClick={onClose}
    >
      <div
        className="relative bg-[#262730] max-w-2xl w-full p-6 rounded-2xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-2 right-4 text-gray-400 hover:text-white transition text-2xl"
        >
          ×
        </button>

        {!user && (
          <div className="text-center flex flex-col items-center gap-6 py-8">
            <p className="text-gray-300 text-lg">Want to create a post?</p>
            <button
              className="bg-[#6a4c7d] text-white px-6 py-2 rounded-full hover:bg-[#5a3f6b] transition cursor-pointer"
              onClick={() => (window.location.href = "/login")}
            >
              Sign In to Continue
            </button>
          </div>
        )}

        {user && (
          <div className="flex items-center gap-4 mt-4">
            <img
              className="w-12 h-12 rounded-full object-cover object-center"
              src={
                user?.profilePicture
                  ? `http://localhost:3000/uploads/profile/${user.profilePicture}`
                  : avatar
              }
              alt="user photo"
            />

            <div className="bg-[#f8f6f3] rounded-2xl p-4 flex-1 flex flex-col gap-4">
              <input
                type="text"
                className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500"
                placeholder={`What's on your mind, ${user?.name}?`}
              />

              <div className="flex items-center justify-between text-sm">
                <div className="flex gap-4 text-gray-600">
                  <button className="flex items-center gap-1 hover:text-black transition cursor-pointer">
                    <FaImage /> Image
                  </button>
                  <button className="flex items-center gap-1 hover:text-black transition cursor-pointer">
                    <FaVideo /> Video
                  </button>
                  <button className="flex items-center gap-1 hover:text-black transition cursor-pointer">
                    <FaMusic /> Music
                  </button>
                </div>
                <button className="bg-[#6a4c7d] font-semibold cursor-pointer text-white px-8 py-1 rounded-full hover:bg-[#5a3f6b] transition">
                  Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePostModal;
