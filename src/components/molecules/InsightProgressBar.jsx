import React from 'react';
import { motion } from 'framer-motion';

const InsightProgressBar = ({ label, count, maxCount, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 + index * 0.1 }}
      className="flex items-center justify-between"
    >
      <div className="flex items-center space-x-3">
        <div className="w-3 h-3 bg-primary rounded-full"></div>
        <span className="font-medium text-gray-800 capitalize">{label}</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-20 bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(count / maxCount) * 100}%` }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
          />
        </div>
        <span className="text-sm text-gray-600 w-8">{count}</span>
      </div>
    </motion.div>
  );
};

export default InsightProgressBar;