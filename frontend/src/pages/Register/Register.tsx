import { useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";

import logo from "../../assets/logo 1.png";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api/api";
import { toast } from "react-toastify";
import { IoMdPerson } from "react-icons/io";
import { FaUserCheck } from "react-icons/fa";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await api.post("/api/users", {
        name,
        username,
        email,
        password,
      });
      navigate("/login");
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[#3d3d4f]">
      <div className="bg-[#2c2c38] rounded-2xl p-10 w-full max-w-md min-h-[500px] shadow-lg flex flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <img className="cursor-pointer w-20 h-20" src={logo} />
            <h1 className="cursor-pointer text-white font-bold text-3xl">
              Vinylla.
            </h1>
          </div>
        </div>

        <h2 className="text-white text-xl font-semibold">Register</h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-6 w-full">
          {/* Name */}
          <div className="flex flex-col gap-1 relative">
            <label className="text-gray-300 text-sm font-medium">Name</label>
            <div className="relative">
              <IoMdPerson
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="John Doe"
                className="pl-10 px-4 py-3 rounded-md bg-[#f2e8e4] text-base text-gray-700 outline-none focus:ring-2 focus:ring-[#7b5b78] transition w-full"
              />
            </div>
          </div>

          {/* Username */}
          <div className="flex flex-col gap-1 relative">
            <label className="text-gray-300 text-sm font-medium">
              Username
            </label>
            <div className="relative">
              <FaUserCheck
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="johndoe123"
                className="pl-10 px-4 py-3 rounded-md bg-[#f2e8e4] text-base text-gray-700 outline-none focus:ring-2 focus:ring-[#7b5b78] transition w-full"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1 relative">
            <label className="text-gray-300 text-sm font-medium">Email</label>
            <div className="relative">
              <FiMail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="example@example.com"
                className="pl-10 px-4 py-3 rounded-md bg-[#f2e8e4] text-base text-gray-700 outline-none focus:ring-2 focus:ring-[#7b5b78] transition w-full"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1 relative">
            <label className="text-gray-300 text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <FiLock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="•••••••••••"
                className="pl-10 px-4 py-3 rounded-md bg-[#f2e8e4] text-base text-gray-700 outline-none focus:ring-2 focus:ring-[#7b5b78] transition w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#7b5b78] text-white py-3 rounded-lg cursor-pointer mt-2 font-medium hover:bg-[#8d6c8b] transition"
          >
            Register
          </button>
          <p className="text-center text-white">
            Already have an account?{" "}
            <Link
              to="/login"
              className="ml-2 text-blue-400 font-italic underline cursor-pointer"
            >
              Log In here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
