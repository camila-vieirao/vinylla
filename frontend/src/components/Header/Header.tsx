import { Link } from "react-router-dom";
import { FaBagShopping } from "react-icons/fa6";
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#080b16]/90 via-[#1c1e2b]/95 to-[#080b16]/90 backdrop-blur-lg shadow-lg transition-shadow duration-500">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <Link
            to="/feed"
            className="flex items-center gap-3 rounded-full px-2 py-1 transition-all duration-300 hover:scale-105"
          >
            <img src={logo} className="w-20" alt="Logo Vinylla" />
            <span className="cursor-pointer text-2xl font-semibold tracking-wide text-white">
              Vinylla.
            </span>
          </Link>
        </div>
        <div className="flex flex-1 justify-center px-6">
          <div className="w-full max-w-[420px] rounded-full border border-white/10 bg-white/5 px-4 py-2 shadow-inner transition focus-within:border-white/40">
            <SearchBar />
          </div>
        </div>
        <div className="flex items-center gap-6 text-3xl">
          {user && (
            <ul className="flex gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-2 text-white/70 shadow-inner">
              <li>
                <Link
                  to="/cart"
                  className="flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300 hover:text-white hover:shadow-lg hover:shadow-rose-500/20 active:scale-95"
                >
                  <FaBagShopping />
                </Link>
              </li>
              <li>
                <Link
                  to="/groups"
                  className="flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300 hover:text-white hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"
                >
                  <IoIosPeople />
                </Link>
              </li>
              <li>
                <Link
                  to=""
                  className="flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300 hover:text-white hover:shadow-lg hover:shadow-amber-400/20 active:scale-95"
                >
                  <IoIosNotifications />
                </Link>
              </li>
              <li>
                <Link
                  to="/user/settings"
                  className="flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300 hover:text-white hover:shadow-lg hover:shadow-emerald-400/20 active:scale-95"
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
                className="flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-1 text-sm text-white shadow-inner transition hover:border-white/40 hover:bg-white/10 active:scale-95"
              >
                <img
                  className="h-12 w-12 rounded-full object-cover object-center"
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
                className="cursor-pointer rounded-full bg-gradient-to-r from-[#7c5bff] via-[#ff6ec4] to-[#ff9671] px-5 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-[#ff6ec4]/40 active:scale-95"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="rounded-full bg-[#6a4c7d] px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#5a3f6b] hover:shadow-lg hover:shadow-[#6a4c7d]/40 active:scale-95"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full border border-[#6a4c7d] px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#6a4c7d] hover:shadow-lg hover:shadow-[#6a4c7d]/40 active:scale-95"
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
