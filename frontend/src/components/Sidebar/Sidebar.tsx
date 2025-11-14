import { BsBellFill } from "react-icons/bs";
import { FaStarHalfAlt } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";
import { MdExplore, MdOutlineShoppingCart } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC<{ onReviewClick: () => void; onPostClick: () => void }> = ({ onReviewClick, onPostClick }) => {
  const location = useLocation();
  // Rotas para cada ícone
  const items = [
    { to: "/feed", icon: <IoMdHome className="text-3xl" />, key: "home", label: "Feed" },
    { to: "/explore", icon: <MdExplore className="text-3xl" />, key: "explore", label: "Explore" },
    { to: "/marketplace", icon: <MdOutlineShoppingCart className="text-3xl" />, key: "cart", label: "Shop" },
    { to: "/notifications", icon: <BsBellFill className="text-3xl" />, key: "notifications", label: "Alerts" },
  ];
  // Detecta rota ativa
  const isActive = (to: string) => {
    return location.pathname === to;
  };

  return (
    <div>
      <aside className="fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-32 bg-transparent transition-transform sm:translate-x-0" aria-label="Sidebar">
        <div className="flex h-full flex-col items-center rounded-r-3xl bg-[#080b16]/90 px-3 py-6 text-white shadow-2xl backdrop-blur-xl">
          <ul className="flex w-full flex-col items-center space-y-5 pt-14 font-medium">
            {items.map(item => (
              <li key={item.key} className="flex w-full flex-col items-center">
                <Link
                  to={item.to}
                  className={`group relative flex w-full flex-col items-center justify-center rounded-2xl border border-transparent px-3 py-3 text-center text-xs uppercase tracking-[0.2em] transition-all duration-300
                    ${
                      isActive(item.to)
                        ? "bg-gradient-to-br from-[#7c5bff]/20 to-[#ff6ec4]/20 text-white shadow-lg shadow-[#7c5bff]/30"
                        : "text-[#A9A4BF] hover:border-white/20 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <span className="flex items-center justify-center text-3xl transition-transform duration-300 group-hover:-translate-y-1 group-active:scale-95">
                    {item.icon}
                  </span>
                  <span className="mt-2 text-[0.6rem] tracking-[0.35em] text-white/70 transition-opacity duration-300 group-hover:opacity-100">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
            <li className="flex w-full flex-col items-center">
              <button
                onClick={onReviewClick}
                className="group relative flex w-full flex-col items-center justify-center rounded-2xl border border-transparent px-3 py-3 text-center text-xs uppercase tracking-[0.2em] text-[#A9A4BF] transition-all duration-300 hover:border-white/20 hover:bg-white/5 hover:text-white active:scale-95 cursor-pointer"
              >
                <span className="flex items-center justify-center text-3xl transition-transform duration-300 group-hover:-translate-y-1 group-active:scale-95">
                  <FaStarHalfAlt />
                </span>
                <span className="mt-2 text-[0.6rem] tracking-[0.35em] text-white/70 transition-opacity duration-300 group-hover:opacity-100">
                  Review
                </span>
              </button>
            </li>
            <li className="flex w-full flex-col items-center">
              <button
                onClick={onPostClick}
                className="group relative flex w-full flex-col items-center justify-center rounded-2xl border border-transparent px-3 py-3 text-center text-xs uppercase tracking-[0.2em] text-[#A9A4BF] transition-all duration-300 hover:border-white/20 hover:bg-white/5 hover:text-white active:scale-95 cursor-pointer"
              >
                <span className="flex items-center justify-center text-3xl transition-transform duration-300 group-hover:-translate-y-1 group-active:scale-95">
                  <FaCirclePlus />
                </span>
                <span className="mt-2 text-[0.6rem] tracking-[0.35em] text-white/70 transition-opacity duration-300 group-hover:opacity-100">
                  Post
                </span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;