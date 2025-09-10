import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPost } from '../services/apiService';

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const newPost = await createPost({ content });
      onPostCreated(newPost);
      setContent('');
      onClose();
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Could not create post.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
              rounded-3xl shadow-2xl w-full max-w-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition"
            >
              ✕
            </button>

            {/* Heading */}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
              ✨ Create a New Post
            </h2>

            {/* Post form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full h-32 p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
                  rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-400 
                  focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-purple-500 resize-none"
                maxLength="280"
              ></textarea>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-500 text-white font-semibold 
                    rounded-full shadow-md hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
                  disabled={!content.trim()}
                >
                  🚀 Post
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;
