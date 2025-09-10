import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// Icons
import { GoHomeFill, GoPlusCircle } from "react-icons/go";
import { FaRegUser } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline, IoSparklesOutline } from "react-icons/io5";
import { FiLogIn, FiLogOut } from "react-icons/fi";

const BottomNavbar = () => {
  const { currentUser, logoutUser } = useAuth();

  const getLinkClass = ({ isActive }) =>
    `relative transition-all duration-300 ${
      isActive
        ? "text-blue-600 dark:text-purple-400 scale-110"
        : "text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-purple-400"
    }`;

  return (
    <nav
      className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-lg px-6 py-4
       bg-gradient-to-r from-white/80 via-white/60 to-white/80 dark:from-gray-900/80 dark:via-gray-800/70 dark:to-gray-900/80
       backdrop-blur-2xl border border-gray-200/60 dark:border-gray-700/60
       rounded-3xl shadow-2xl z-50 lg:hidden"
    >
      <div className="flex justify-around items-center gap-x-8 text-2xl">
        <NavLink to="/" className={getLinkClass}>
          <GoHomeFill />
        </NavLink>

        <NavLink to="/messages" className={getLinkClass}>
          <IoChatbubbleEllipsesOutline />
        </NavLink>

        {/* Center Create Button - Highlighted */}
        <NavLink
          to="/create"
          className="relative -top-8 flex items-center justify-center w-16 h-16 rounded-full
           bg-gradient-to-tr from-blue-600 via-purple-500 to-pink-500 text-white
           shadow-[0_8px_20px_rgba(0,0,0,0.25)] hover:scale-110 active:scale-95 transition-transform"
        >
          <GoPlusCircle size={34} />
        </NavLink>

        <NavLink to="/imagine" className={getLinkClass}>
          <IoSparklesOutline />
        </NavLink>

        {currentUser ? (
          <>
            <NavLink
              to={`/profile/${currentUser.username}`}
              className={getLinkClass}
            >
              <FaRegUser />
            </NavLink>
            <button
              onClick={logoutUser}
              className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
            >
              <FiLogOut />
            </button>
          </>
        ) : (
          <NavLink to="/login" className={getLinkClass}>
            <FiLogIn />
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default BottomNavbar;
