import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

const Toast = ({ message }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed top-5 left-1/2 -translate-x-1/2 
                     bg-white/10 backdrop-blur-md border border-white/20
                     text-white px-6 py-3 rounded-full shadow-lg 
                     flex items-center gap-x-3 z-50"
        >
          <FaCheckCircle className="text-green-400" size={20} />
          <span className="font-medium bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
