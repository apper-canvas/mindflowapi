import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';

const TimeRangeSelector = ({ timeRange, onSelectRange, options }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-6"
    >
      <div className="flex justify-center">
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
          {options.map((option) => (
            <Button
              key={option.key}
              onClick={() => onSelectRange(option.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === option.key
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 hover:text-primary'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TimeRangeSelector;