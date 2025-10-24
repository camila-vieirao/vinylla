import { FaImage, FaVideo, FaMusic } from "react-icons/fa";
import avatar from "../../assets/borabill_avatar.jpeg";
import { MdGroups } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";

const Feed: React.FC = () => {
  return (
    <div>
      <div className="p-14 ml-[112px] flex gap-8">
        <div className="flex flex-col items-start flex-1">
          <div className="bg-[#262730] max-w-2xl w-full p-6 rounded-2xl">
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
                  <button className="bg-[#6a4c7d] font-semibold cursor-pointer text-white px-8 py-1  rounded-full hover:bg-[#5a3f6b] transition">
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          <div className="w-74 mr-8">
            <div className="bg-[#262730] rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">Groups</h1>
                <MdGroups size={26} />
              </div>

              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-neutral-700 ps-3 p-2 w-full bg-white rounded-3xl cursor-pointer">
                  <img
                    className="w-8 h-8 rounded-full object-cover object-center"
                    src={avatar}
                    alt="group avatar"
                  />
                  <span>GROUP_NAME</span>
                </li>
              </ul>

              <button className="p-2 w-full hover:scale-102 transition-all duration-300 mt-8 cursor-pointer bg-[#60435F] rounded-2xl">
                See all
              </button>
            </div>
          </div>

          <div className="w-74 mr-8">
            <div className="bg-[#262730] rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-semibold">Suggestions</h1>
                <IoPersonAddSharp size={20} />
              </div>

              <ul className="flex justify-center space-y-2 text-sm">
                <li className="flex items-center text-neutral-700 ps-3 p-2 w-full rounded-3xl">
                  <img
                    className="w-14 h-14 rounded-full object-cover object-center cursor-pointer hover:scale-108 duration-400"
                    src={avatar}
                    alt="group avatar"
                  />
                </li>
                <li className="flex items-center text-neutral-700 ps-3 p-2 w-full rounded-3xl">
                  <img
                    className="w-14 h-14 rounded-full object-cover object-center cursor-pointer hover:scale-108 duration-400"
                    src={avatar}
                    alt="group avatar"
                  />
                </li>
                <li className="flex items-center text-neutral-700 ps-3 p-2 w-full rounded-3xl">
                  <img
                    className="w-14 h-14 rounded-full object-cover object-center cursor-pointer hover:scale-108 duration-400"
                    src={avatar}
                    alt="group avatar"
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
