import React from 'react';

const RightSidebar = () => {
  return (
    <aside className="w-80 p-4 sticky top-0 hidden lg:block">
      <div
        className="bg-white/5 backdrop-blur-md border border-white/10 
                   rounded-2xl shadow-lg p-4 hover:shadow-xl hover:border-white/20 
                   transition"
      >
        <h3 className="font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 
                       text-transparent bg-clip-text">
          Who to follow
        </h3>
        <p className="text-sm text-gray-300">
          Suggestions will appear here.
        </p>
      </div>
    </aside>
  );
};

export default RightSidebar;
