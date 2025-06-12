import React from 'react';
import { motion } from 'framer-motion';

const InspirationCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="p-6 pt-0"
    >
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start space-x-4">
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut"
            }}
            className="text-3xl"
          >
            💜
          </motion.div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 mb-2">Daily Inspiration</h3>
            <p className="text-sm text-gray-600 break-words">
              "The present moment is the only time over which we have dominion." - Thích Nhất Hạnh
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InspirationCard;