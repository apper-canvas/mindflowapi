import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const SessionHistoryItem = ({ session, index, onStartSession }) => {
  return (
    <motion.div
      key={session.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
          <ApperIcon
            name={session.type === 'breathing' ? 'Wind' : 'Brain'}
            className="text-white"
            size={20}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 break-words">{session.title}</h3>
          <p className="text-sm text-gray-600">
            {session.duration} minutes • {new Date(session.completedAt).toLocaleDateString()}
          </p>
        </div>
        <Button
          onClick={() => onStartSession(session)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ApperIcon name="Play" size={16} />
        </Button>
      </div>
    </motion.div>
  );
};

export default SessionHistoryItem;