import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ emoji, value, label, delay = 0.3, className = '' }) => {
  return (
<div className={`bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-4 text-center shadow-sm border border-purple-200 ${className}`}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay, type: 'spring' }}
        className="text-2xl mb-1"
      >
        {emoji}
      </motion.div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-white">{label}</div>
    </div>
  );
};

export default StatCard;