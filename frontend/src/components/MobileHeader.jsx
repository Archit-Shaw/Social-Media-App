import React from 'react';
import { Link } from 'react-router-dom';

const MobileHeader = () => {
  return (
    // Fixed header for mobile, visible only on < lg
    <header className="fixed top-0 left-0 right-0 h-16 
                       bg-white/70 dark:bg-gray-900/70 
                       backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 
                       shadow-md z-40 flex items-center justify-center lg:hidden">
      <Link 
        to="/" 
        className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
      >
        {/* <img 
          src="/logo.png" 
          alt="Postify Logo" 
          className="h-10 w-auto drop-shadow-sm" 
        /> */}
        <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Social media
        </span>
      </Link>
    </header>
  );
};

export default MobileHeader;
