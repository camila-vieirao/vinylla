import { Link } from "react-router-dom";

import { FaCartShopping } from "react-icons/fa6";
import { IoIosNotifications, IoIosPeople, IoMdSettings } from "react-icons/io";
import { FaSearch } from "react-icons/fa";

import avatar from "../../assets/borabill_avatar.jpeg";
import logo from "../../assets/logo 1.png";

const Feed: React.FC = () => {
  return (
    <nav className="bg-[#262730]">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <div className="flex items-center gap-8">
          <Link to="/feed" className="flex items-center rtl:space-x-reverse">
            <img src={logo} className="w-20" alt="Logo Vinylla" />
            <span className="cursor-pointer text-2xl font-bold text-white">
              Vinylla.
            </span>
          </Link>

          <form className="w-64">
            <label className="sr-only">Search</label>

            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <FaSearch className="text-neutral-600" />
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-3 ps-10 text-sm text-neutral-600 border border-[#3c3e4e] rounded-3xl bg-white placeholder-neutral-600 outline-none"
                placeholder="Search here..."
                required
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-6 text-3xl">
          <ul className="flex gap-6 p-2 pl-6 pr-6 bg-[#30323F] rounded-3xl">
            <li>
              <Link
                to="/marketplace"
                className="text-white hover:text-[#795277] transition-colors duration-300"
              >
                <FaCartShopping />
              </Link>
            </li>
            <li>
              <Link
                to="/groups"
                className="text-white hover:text-[#795277] transition-colors duration-300"
              >
                <IoIosPeople />
              </Link>
            </li>
            <li>
              <Link
                to=""
                className="text-white hover:text-[#795277] transition-colors duration-400"
              >
                <IoIosNotifications />
              </Link>
            </li>
            <li>
              <Link
                to="/user/settings"
                className="text-white hover:text-[#795277] transition-colors duration-400"
              >
                <IoMdSettings />
              </Link>
            </li>
          </ul>

          <button
            type="button"
            className="flex text-sm bg-gray-800 rounded-full cursor-pointer"
          >
            <img
              className="w-18 h-18 rounded-full object-cover object-center"
              src={avatar}
              alt="user photo"
            />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Feed;
