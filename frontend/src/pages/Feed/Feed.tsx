import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import { FaImage, FaVideo, FaMusic } from "react-icons/fa";

import avatar from "../../assets/borabill_avatar.jpeg";

const Feed: React.FC = () => {
  return (
    <div>
      <Header />
      <Sidebar />
      <div className="p-10 ml-[112px]">
        <div className="bg-[#262730] max-w-xl p-6 rounded-2xl">
          <div className="flex items-start gap-4">
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

            <div className="bg-[#f8f6f3] rounded-2xl p-4 flex-1 flex flex-col gap-3">
              <input
                type="text"
                className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500"
                placeholder="What’s on your mind, Bill?"
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
                <button className="bg-[#6a4c7d] text-white px-8 py-1 rounded-full hover:bg-[#5a3f6b] transition">
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

export default Feed;
