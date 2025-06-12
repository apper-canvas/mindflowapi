import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const JournalEntryCard = ({ entry, index }) => {
  return (
    <motion.div
      key={entry.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-primary break-words">{entry.prompt}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(entry.createdAt).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <ApperIcon name="Heart" className="text-red-400" size={16} />
      </div>
      <p className="text-gray-700 text-sm leading-relaxed break-words">
        {entry.content.length > 150
          ? `${entry.content.substring(0, 150)}...`
          : entry.content
        }
      </p>
    </motion.div>
  );
};

export default JournalEntryCard;