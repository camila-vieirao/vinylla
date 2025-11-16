import { Link } from "react-router-dom";
import { FaBagShopping } from "react-icons/fa6";
import { IoIosNotifications, IoMdSettings } from "react-icons/io";
import { FaUserPlus } from "react-icons/fa";
import { SearchBar } from "../Search/SearchBar";
import { useEffect, useState, useRef } from "react";
import api from "../../services/api/api";

import avatar from "../../assets/borabill_avatar.jpeg";
import logo from "../../assets/logo 1.png";

interface User {
  id: number;
  name: string;
  username: string;
  profilePicture: string;
}

const Header: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  const handleUserSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const allUsersRes = await api.get("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredUsers = allUsersRes.data
        .filter(
          (user: User) =>
            user.username.toLowerCase().includes(query.toLowerCase()) ||
            user.name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5); // Limitar a 5 resultados

      setSearchResults(filteredUsers);
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUserSelect = (selectedUser: User) => {
    setSearchQuery("");
    setSearchResults([]);
    setIsUserDropdownOpen(false);
    // Navegar para o perfil do usuário selecionado
    window.location.href = `/profile/${selectedUser.username}`;
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
              <li className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300 hover:text-white hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 ${
                    isUserDropdownOpen
                      ? "text-white shadow-lg shadow-indigo-500/20"
                      : ""
                  }`}
                  title="Find people"
                >
                  <FaUserPlus />
                </button>

                {/* Dropdown de busca de usuários */}
                {isUserDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 top-12 w-[22rem] rounded-3xl border border-white/10 bg-gradient-to-b from-[#0a0c15] via-[#0b0d19] to-[#05060b] p-5 text-white shadow-2xl backdrop-blur-xl"
                  >
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/60">
                            Community
                          </p>
                          <h3 className="text-lg font-semibold">
                            Find crate pals
                          </h3>
                        </div>
                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                          {searchResults.length} results
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Type a name or username"
                          value={searchQuery}
                          onChange={(e) => handleUserSearch(e.target.value)}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
                          autoFocus
                        />
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs uppercase tracking-[0.3em] text-white/40">
                          Search
                        </span>
                      </div>
                    </div>
                    <div
                      className="space-y-2 overflow-y-auto pr-1"
                      style={{ maxHeight: "16rem" }}
                    >
                      {isSearching ? (
                        <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-6 text-sm text-white/60">
                          Searching...
                        </div>
                      ) : searchResults.length > 0 ? (
                        searchResults.map((result) => (
                          <button
                            key={result.id}
                            onClick={() => handleUserSelect(result)}
                            className="group flex w-full items-center gap-3 rounded-2xl border border-white/5 bg-white/0 p-3 text-left transition hover:border-white/30 hover:bg-white/5 active:scale-95"
                          >
                            <img
                              src={
                                result.profilePicture &&
                                result.profilePicture !== "default-profile.png"
                                  ? `http://localhost:3000/uploads/profile/${result.profilePicture}`
                                  : avatar
                              }
                              alt={result.name}
                              className="h-11 w-11 rounded-2xl object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-sm font-semibold text-white">
                                {result.name}
                              </p>
                              <p className="truncate text-xs text-white/60">
                                @{result.username}
                                </p>
                            </div>
                            <span className="rounded-full border border-white/15 px-2 py-1 text-[0.6rem] uppercase tracking-[0.3em] text-white/50 transition group-hover:border-white/40 group-hover:text-white/80">
                              View
                            </span>
                          </button>
                        ))
                      ) : searchQuery.length >= 2 ? (
                        <div className="rounded-2xl border border-white/10 bg-white/5 py-6 text-center text-sm text-white/60">
                          No users match that search.
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-white/10 bg-white/5 py-6 text-center text-sm text-white/60">
                          Start typing to explore profiles.
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
                <Link to="/user/profile">
                  <img
                    className="h-12 w-12 rounded-full object-cover object-center"
                    src={
                      user.profilePicture
                        ? `http://localhost:3000/uploads/profile/${user.profilePicture}`
                        : avatar
                    }
                    alt="user photo"
                  />
                </Link>
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
