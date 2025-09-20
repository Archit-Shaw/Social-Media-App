import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Icons
import { GoHomeFill, GoPlusCircle } from "react-icons/go";
import { FaRegUser } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline, IoImageOutline } from "react-icons/io5";
import { FiLogIn, FiLogOut } from "react-icons/fi";

const LeftSidebar = () => {
  const { currentUser, logoutUser } = useAuth();

  // Active link style with new emerald -> indigo theme
  const getLinkClass = ({ isActive }) =>
    `flex items-center gap-x-3 py-2.5 px-5 rounded-xl text-lg font-medium transition-all duration-200
     ${
       isActive
         ? "bg-gradient-to-r from-emerald-500 to-indigo-600 text-white shadow-lg scale-[1.02]"
         : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 hover:scale-[1.02]"
     }`;

  return (
    <aside className="w-[260px] h-screen sticky top-0 flex flex-col justify-between border-r border-slate-200 bg-white shadow-xl">
      <div>
        {/* Gradient Header Bar */}
        <div className="w-full h-2 bg-gradient-to-r from-emerald-500 to-indigo-600"></div>

        {/* Logo */}
        <div className="p-6">
          <Link to="/" className="flex items-center justify-center mb-8">
            {/* Use a sharper rounded badge with new color */}
            <div className="w-36 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-indigo-600 shadow-md">
              <span className="text-white font-bold">Social media</span>
            </div>
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

            {/* Changed "Designer" to "AI Image" with image icon */}
            <NavLink to="/imagine" className={getLinkClass}>
              <IoImageOutline size={24} />
              <span>AI Image</span>
            </NavLink>

            <NavLink to="/create" className={getLinkClass}>
              <GoPlusCircle size={24} />
              <span>Create</span>
            </NavLink>

            <NavLink to={`/profile/${currentUser?.username || ""}`} className={getLinkClass}>
              <FaRegUser size={22} />
              <span>Profile</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Logout/Login Button */}
      <div className="p-6 border-t border-slate-200">
        {currentUser ? (
          <button
            onClick={logoutUser}
            className="w-full flex items-center justify-center gap-x-3 py-2.5 px-5 
                       rounded-xl text-lg font-medium text-white 
                       bg-gradient-to-r from-red-500 to-pink-600 shadow-md 
                       hover:shadow-lg hover:scale-[1.03] transition-all"
          >
            <FiLogOut size={22} />
            <span>Logout</span>
          </button>
        ) : (
          <NavLink
            to="/login"
            className="w-full flex items-center justify-center gap-x-3 py-2.5 px-5 
                       rounded-xl text-lg font-medium text-white 
                       bg-gradient-to-r from-emerald-500 to-indigo-600 shadow-md 
                       hover:shadow-lg hover:scale-[1.03] transition-all"
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
