import { BsBellFill } from "react-icons/bs";
import { FaStarHalfAlt } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";
import { MdExplore, MdOutlineShoppingBag } from "react-icons/md";
import { Link } from "react-router-dom";

const Sidebar: React.FC<{ onReviewClick: () => void }> = ({ onReviewClick }) => {
  return (
    <div>
      <aside
        className="fixed top-28 left-0 z-40 w-28 h-[calc(100vh-4rem)] transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-[#262731]">
          <ul className="flex flex-col items-center space-y-6 font-medium">
            <li>
              <Link
                to="/"
                className="flex justify-center items-center text-[#A9A4BF] p-2 rounded-lg transition-colors duration-300 group hover:text-[#8078a5]"
              >
                <span>
                  <IoMdHome className="text-3xl" />
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/explore"
                className="flex justify-center items-center text-[#A9A4BF] p-2 rounded-lg transition-colors duration-300 group hover:text-[#8078a5]"
              >
                <span>
                  <MdExplore className="text-3xl" />
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="flex justify-center items-center text-[#A9A4BF] p-2 rounded-lg transition-colors duration-300 group hover:text-[#8078a5]"
              >
                <span>
                  <MdOutlineShoppingBag className="text-3xl" />
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/notifications"
                className="flex justify-center items-center text-[#A9A4BF] p-2 rounded-lg transition-colors duration-300 group hover:text-[#8078a5]"
              >
                <span>
                  <BsBellFill className="text-3xl" />
                </span>
              </Link>
            </li>
            <li>
              <button
                onClick={onReviewClick}
                className="flex justify-center items-center text-[#A9A4BF] p-2 rounded-lg transition-colors duration-300 group hover:text-[#8078a5]"
                style={{ width: "100%" }}
              >
                <span>
                  <FaStarHalfAlt className="text-3xl" />
                </span>
              </button>
            </li>
            <li>
              <Link
                to=""
                className="flex justify-center items-center text-[#A9A4BF] p-2 rounded-lg transition-colors duration-300 group hover:text-[#8078a5]"
              >
                <span>
                  <FaCirclePlus className="text-3xl" />
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;