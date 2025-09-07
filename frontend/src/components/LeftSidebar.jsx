import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Icons
import { GoHomeFill, GoPlusCircle } from "react-icons/go";
import { FaRegUser } from "react-icons/fa";
import {
  IoChatbubbleEllipsesOutline,
  IoSparklesOutline,
} from "react-icons/io5";
import { FiLogIn, FiLogOut } from "react-icons/fi";

const LeftSidebar = () => {
  const { currentUser, logoutUser } = useAuth();

  // Active link style
  const getLinkClass = ({ isActive }) =>
    `flex items-center gap-x-3 py-2 px-4 rounded-xl text-lg font-medium transition-all duration-200
     ${
       isActive
         ? "bg-blue-600 text-white shadow-md"
         : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
     }`;

  return (
    <aside className="w-[250px] h-screen sticky top-0 flex flex-col justify-between border-r border-gray-200 bg-white shadow-md">
      <div className="p-6">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center mb-8">
          <img src="/logo.png" alt="Postify Logo" className="w-32" />
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-3">
          <NavLink to="/" className={getLinkClass}>
            <GoHomeFill size={24} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/messages" className={getLinkClass}>
            <IoChatbubbleEllipsesOutline size={24} />
            <span>Messages</span>
          </NavLink>
          <NavLink to="/imagine" className={getLinkClass}>
            <IoSparklesOutline size={24} />
            <span>Desinger</span>
          </NavLink>
          <NavLink to="/create" className={getLinkClass}>
            <GoPlusCircle size={24} />
            <span>Create</span>
          </NavLink>
          <NavLink
            to={`/profile/${currentUser?.username || ""}`}
            className={getLinkClass}
          >
            <FaRegUser size={22} />
            <span>Profile</span>
          </NavLink>
        </nav>
      </div>

      {/* Logout/Login Button */}
      <div className="p-6 border-t border-gray-200">
        {currentUser ? (
          <button
            onClick={logoutUser}
            className="w-full flex items-center gap-x-3 py-2 px-4 rounded-xl text-lg font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <FiLogOut size={22} />
            <span>Logout</span>
          </button>
        ) : (
          <NavLink
            to="/login"
            className="flex items-center gap-x-3 py-2 px-4 rounded-xl text-lg font-medium text-blue-600 hover:bg-blue-50 transition-all duration-200"
          >
            <FiLogIn size={22} />
            <span>Login</span>
          </NavLink>
        )}
      </div>
    </aside>
  );
};

export default LeftSidebar;
