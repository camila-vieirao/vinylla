import { BsBellFill } from "react-icons/bs";
import { FaStarHalfAlt } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";
import { MdExplore, MdOutlineShoppingBag } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC<{ onReviewClick: () => void; onPostClick: () => void }> = ({ onReviewClick, onPostClick }) => {
  const location = useLocation();
  // Rotas para cada ícone
  const items = [
    { to: "/feed", icon: <IoMdHome className="text-3xl" />, key: "home" },
    { to: "/explore", icon: <MdExplore className="text-3xl" />, key: "explore" },
    { to: "/cart", icon: <MdOutlineShoppingBag className="text-3xl" />, key: "cart" },
    { to: "/notifications", icon: <BsBellFill className="text-3xl" />, key: "notifications" },
  ];
  // Detecta rota ativa
  const isActive = (to: string) => {
    return location.pathname === to;
  };

  return (
    <div>
      <aside
        className="fixed top-28 left-0 z-40 w-28 h-[calc(100vh-4rem)] transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 overflow-y-auto bg-[#262731]">
          <ul className="flex flex-col items-center space-y-10 font-medium mt-10">
            {items.map(item => (
              <li key={item.key} className="w-full flex flex-col items-center">
                <Link
                  to={item.to}
                  className={`flex justify-center items-center p-2 rounded-lg transition-all duration-300 group w-full
                    ${isActive(item.to)
                      ? "text-[#6a4c7d] shadow-lg border-b-4 border-[#6B818C] scale-105"
                      : "text-[#A9A4BF] hover:text-[#8078a5]"}
                  `}
                  style={{ position: "relative" }}
                >
                  <span className="flex items-center justify-center w-full mb-2">
                    {item.icon}
                  </span>
                </Link>
              </li>
            ))}
            {/* Botão de review */}
            <li className="w-full flex flex-col items-center">
              <button
                onClick={onReviewClick}
                className={`flex justify-center items-center text-[#A9A4BF] p-2 rounded-lg transition-colors duration-300 group hover:text-[#8078a5] cursor-pointer w-full`}
                style={{ width: "100%" }}
              >
                <span>
                  <FaStarHalfAlt className="text-3xl" />
                </span>
              </button>
            </li>
            {/* Botão de post/modal */}
            <li className="w-full flex flex-col items-center">
              <button
                onClick={onPostClick}
                className="cursor-pointer flex justify-center items-center text-[#A9A4BF] p-2 rounded-lg transition-colors duration-300 group hover:text-[#8078a5] w-full"
              >
                <span>
                  <FaCirclePlus className="text-3xl" />
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