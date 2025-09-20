import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  IoChatbubbleEllipsesOutline,
  IoSunnyOutline,
  IoMoonOutline,
} from "react-icons/io5";

const TopNavbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 
                 bg-white/10 dark:bg-gray-900/30 
                 backdrop-blur-md border-b border-white/20 dark:border-gray-800/40 
                 shadow-lg z-50 flex items-center justify-between 
                 px-4 sm:px-6"
    >
      {/* Logo */}
      <Link to="/">
        <h1
          className="text-2xl font-extrabold 
                     bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                     text-transparent bg-clip-text tracking-tight"
        >
          Social media
        </h1>
      </Link>

      {/* Right Actions */}
      <div className="flex items-center gap-x-6">
        {/* Messages */}
        <Link to="/messages">
          <IoChatbubbleEllipsesOutline
            size={26}
            className="text-gray-700 dark:text-gray-200 
                       hover:text-blue-500 dark:hover:text-blue-400 
                       transition-colors"
          />
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 
                     dark:bg-gray-800/40 dark:hover:bg-gray-700/60 
                     border border-white/10 dark:border-gray-700/50 
                     transition"
        >
          {isDarkMode ? (
            <IoSunnyOutline
              size={22}
              className="text-yellow-400 hover:text-yellow-500 transition-colors"
            />
          ) : (
            <IoMoonOutline
              size={22}
              className="text-indigo-400 hover:text-indigo-500 transition-colors"
            />
          )}
        </button>

        {/* Profile Avatar Placeholder */}
        <div
          className="w-9 h-9 rounded-full 
                     bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                     flex items-center justify-center 
                     text-white font-semibold cursor-pointer 
                     shadow-md hover:shadow-lg hover:scale-105 
                     transition-all"
        >
          U
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
