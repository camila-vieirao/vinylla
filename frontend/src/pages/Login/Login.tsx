import { useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../assets/logo 1.png";
import api from "../../services/api/api";

const fieldStyles =
  "relative rounded-2xl border border-white/10 bg-white/5 px-12 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:border-white/40 focus:ring-0";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await api.post("/api/login", { email, password });
      const token = res.data.token;
      localStorage.setItem("token", token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      const tagsRes = await api.get(`/api/users/me/tags`);
      if (tagsRes.data.length === 0) {
        navigate("/select-tags");
        return;
      }
      toast.success("Welcome back!");
      navigate("/feed");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed.");
    }
  }

  return (
    <div className="min-h-screen bg-[#05060b] text-white">
      <div className="relative isolate flex min-h-screen items-center justify-center px-6 py-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(124,91,255,0.2),_transparent_55%)]" />
        <div className="w-full max-w-5xl rounded-[40px] border border-white/10 bg-white/5 p-1 shadow-[0_25px_60px_rgba(5,6,11,0.65)] backdrop-blur">
          <div className="grid gap-8 rounded-[36px] bg-[#0b0d19]/85 p-8 lg:grid-cols-2">
            <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-br from-[#191b2a] to-[#0c0f1a] p-8 shadow-inner">
              <div className="space-y-6">
                <Link to="/" className="flex items-center">
                  <img src={logo} alt="Vinylla" className="h-20 w-20 rounded-2xl" />
                  <span className="text-3xl font-semibold tracking-wide">Vinylla.</span>
                </Link>
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">Community</p>
                  <h1 className="text-3xl font-semibold leading-tight">Spin up your next record session</h1>
                  <p className="text-white/70 text-base">
                    Drop into your personalized feed of vinyl reviews, collector stories, and marketplace drops curated by the crate.
                  </p>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#7c5bff] to-[#ff6ec4]" />
                  Exclusive artist deep dives
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#7c5bff] to-[#ff6ec4]" />
                  Weekly marketplace drops
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#7c5bff] to-[#ff6ec4]" />
                  Chat with genre collectives
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur">
              <div className="mb-8 space-y-2">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Welcome back</p>
                <h2 className="text-3xl font-semibold">Log in</h2>
              </div>
              <form className="space-y-5" onSubmit={handleLogin}>
                <label className="block text-xs uppercase tracking-[0.3em] text-white/60" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={fieldStyles}
                    placeholder="you@email.com"
                    required
                  />
                </div>

                <label className="mt-6 block text-xs uppercase tracking-[0.3em] text-white/60" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={fieldStyles}
                    placeholder="••••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full rounded-full bg-gradient-to-r from-[#7c5bff] via-[#b978ff] to-[#ff6ec4] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg transition hover:opacity-95"
                >
                  Enter the crate
                </button>
              </form>
              <p className="mt-8 text-center text-sm text-white/70">
                Do not have an account?
                <Link to="/register" className="ml-2 font-semibold text-white hover:text-white/80 underline-offset-4">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
