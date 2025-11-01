import { Link } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { IoIosNotifications, IoIosPeople, IoMdSettings } from "react-icons/io";
import { SearchBar } from "../Search/SearchBar";
import { useEffect, useState } from "react";
import api from "../../services/api/api";

import avatar from "../../assets/borabill_avatar.jpeg";
import logo from "../../assets/logo 1.png";

const Header: React.FC = () => {
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <nav className="bg-[#262730] sticky top-0 z-50">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-2 ">
        <div className="flex items-center gap-8">
          <Link to="/feed" className="flex items-center rtl:space-x-reverse">
            <img src={logo} className="w-25" alt="Logo Vinylla" />
            <span className="cursor-pointer text-2xl font-bold text-white">
              Vinylla.
            </span>
          </Link>
          <div className="w-64">
            <SearchBar />
          </div>
        </div>
        <div className="flex items-center gap-6 text-3xl">
          {user && (
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
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="flex text-sm bg-gray-800 rounded-full cursor-pointer"
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
              <button
                onClick={handleLogout}
                className="cursor-pointer text-white text-sm bg-[#6a4c7d] px-4 py-2 rounded-full hover:bg-[#5a3f6b] transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-white text-sm bg-[#6a4c7d] px-4 py-2 rounded-full hover:bg-[#5a3f6b] transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-white text-sm bg-transparent border border-[#6a4c7d] px-4 py-2 rounded-full hover:bg-[#6a4c7d] transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
