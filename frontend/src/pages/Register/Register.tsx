import { useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { IoMdPerson } from "react-icons/io";
import { FaUserCheck } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../assets/logo 1.png";
import api from "../../services/api/api";

const inputStyles =
  "relative rounded-2xl border border-white/10 bg-white/5 px-12 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:border-white/40 focus:ring-0";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post("/api/users", {
        name,
        username,
        email,
        password,
      });
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed.");
    }
  }

  return (
    <div className="min-h-screen bg-[#05060b] text-white">
      <div className="relative isolate flex min-h-screen items-center justify-center px-6 py-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(255,110,196,0.18),_transparent_55%)]" />
        <div className="w-full max-w-5xl rounded-[40px] border border-white/10 bg-white/5 p-1 shadow-[0_25px_60px_rgba(5,6,11,0.65)] backdrop-blur">
          <div className="grid gap-8 rounded-[36px] bg-[#0b0d19]/85 p-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1d2d] to-[#0f111d] p-8 shadow-inner">
              <Link to="/" className="flex items-center">
                <img src={logo} alt="Vinylla" className="h-20 w-20 rounded-2xl" />
                <span className="text-3xl font-semibold tracking-wide">Vinylla.</span>
              </Link>
              <div className="mt-8 space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Create your handle</p>
                <h1 className="text-3xl font-semibold leading-tight">Join a community of vinyl obsessives</h1>
                <p className="text-white/70 text-base">
                  Secure a username, log spins, review albums, and trade grails with people who treat crates like galleries.
                </p>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {["Curated tags", "Drop alerts", "Group chats", "Marketplace"].map((label) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white/70"
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur">
              <div className="mb-8 space-y-2">
                <h2 className="text-3xl font-semibold">Create account</h2>
              </div>
              <form className="space-y-5" onSubmit={handleRegister}>
                <div>
                  <label className="block text-xs uppercase tracking-[0.3em] text-white/60 pb-2" htmlFor="name">
                    Name
                  </label>
                  <div className="relative">
                    <IoMdPerson className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputStyles}
                      placeholder="Full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.3em] text-white/60 pb-2" htmlFor="username">
                    Username
                  </label>
                  <div className="relative">
                    <FaUserCheck className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={inputStyles}
                      placeholder="cratecollector"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.3em] text-white/60 pb-2" htmlFor="email">
                    Email
                  </label>
                  <div className="relative">
                    <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputStyles}
                      placeholder="you@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.3em] text-white/60 pb-2" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputStyles}
                      placeholder="••••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full rounded-full bg-gradient-to-r from-[#7c5bff] via-[#b978ff] to-[#ff6ec4] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg transition hover:opacity-95"
                >
                  Create profile
                </button>
              </form>
              <p className="mt-8 text-center text-sm text-white/70">
                Already part of Vinylla?
                <Link to="/login" className="ml-2 font-semibold text-white hover:text-white/80 underline-offset-4">
                  Log in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
