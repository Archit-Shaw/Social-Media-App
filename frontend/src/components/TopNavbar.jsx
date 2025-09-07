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
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/40 dark:bg-gray-900/40 backdrop-blur-lg shadow-md z-50 flex items-center justify-between px-4 sm:px-6 border-b border-gray-200 dark:border-gray-800">
      {/* Logo */}
      <Link to="/">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-500 text-transparent bg-clip-text tracking-tight">
          ChitChat
        </h1>
      </Link>

      {/* Right Actions */}
      <div className="flex items-center gap-x-6">
        {/* Messages */}
        <Link to="/messages">
          <IoChatbubbleEllipsesOutline
            size={26}
            className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          />
        </Link>

        {/* Theme Toggle */}
        <button onClick={toggleTheme}>
          {isDarkMode ? (
            <IoSunnyOutline
              size={26}
              className="text-yellow-500 hover:text-yellow-600 transition-colors"
            />
          ) : (
            <IoMoonOutline
              size={26}
              className="text-indigo-500 hover:text-indigo-600 transition-colors"
            />
          )}
        </button>

        {/* Profile Avatar Placeholder */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold cursor-pointer hover:opacity-90 transition-all">
          U
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
