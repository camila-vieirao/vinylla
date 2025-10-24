import React from "react";
import { FaImage, FaMusic, FaVideo } from "react-icons/fa";
import avatar from "../../assets/borabill_avatar.jpeg";

interface CreatePostModalProps {
  postText?: string;
  postImg?: string;
  postMention?: string;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/10">
      <div className="flex justify-center items-start flex-1">
        <div className="bg-[#262730] max-w-2xl w-full p-6 rounded-2xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="cursor-pointer mb-4 text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex-shrink-0 text-sm bg-gray-800 rounded-full cursor-pointer"
            >
              <img
                className="w-12 h-12 rounded-full object-cover object-center"
                src={avatar}
                alt="user photo"
              />
            </button>

            <div className="bg-[#f8f6f3] rounded-2xl p-4 flex-1 flex flex-col gap-4">
              <input
                type="text"
                className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500"
                placeholder="What’s on your mind, USER_NAME?"
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
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
