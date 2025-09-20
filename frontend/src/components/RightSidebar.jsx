import React from 'react';

const RightSidebar = () => {
  return (
    <aside className="w-80 p-4 sticky top-0 hidden lg:block">
      <div
        className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-emerald-200/30 dark:border-emerald-500/20 
                   rounded-2xl shadow-lg p-4 hover:shadow-xl hover:border-indigo-400/30 
                   transition"
      >
        <h3 className="font-bold mb-4 bg-gradient-to-r from-emerald-500 to-indigo-600 
                       text-transparent bg-clip-text">
          Who to follow
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Suggestions will appear here.
        </p>
      </div>
    </aside>
  );
};

export default RightSidebar;