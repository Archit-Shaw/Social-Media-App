import React from 'react';
import { Link } from 'react-router-dom';

const MobileHeader = () => {
  return (
    // Fixed header for mobile, visible only on < lg
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm z-40 flex items-center justify-center lg:hidden">
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo.png" alt="Postify Logo" className="h-10 w-auto" />
        <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-500 text-transparent bg-clip-text">
          Postify
        </span>
      </Link>
    </header>
  );
};

export default MobileHeader;
