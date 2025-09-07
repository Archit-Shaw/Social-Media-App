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
    `transition-colors duration-200 ${
      isActive
        ? "text-blue-600 dark:text-blue-400"
        : "text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
    }`;

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md px-6 py-3 
      bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl 
      rounded-full shadow-lg z-50 border border-gray-200 dark:border-gray-800 lg:hidden">
      <div className="flex justify-around items-center gap-x-6 text-2xl">
        <NavLink to="/" className={getLinkClass}>
          <GoHomeFill />
        </NavLink>
        <NavLink to="/messages" className={getLinkClass}>
          <IoChatbubbleEllipsesOutline />
        </NavLink>

        {/* Center Create Button - Highlighted */}
        <NavLink
          to="/create"
          className="relative -top-6 flex items-center justify-center w-14 h-14 rounded-full 
          bg-gradient-to-r from-blue-600 to-purple-500 text-white shadow-xl hover:scale-105 transition-transform"
        >
          <GoPlusCircle size={30} />
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
