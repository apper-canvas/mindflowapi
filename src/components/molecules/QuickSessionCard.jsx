import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const QuickSessionCard = ({ session, index, onStartSession }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-gradient-to-br ${session.color} rounded-2xl p-6 text-white shadow-lg cursor-pointer`}
      onClick={() => onStartSession(session)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="bg-white/20 p-2 rounded-full"
            >
              <ApperIcon name={session.icon} size={20} />
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold break-words">{session.title}</h3>
              <p className="text-sm opacity-90">{session.duration} minutes</p>
            </div>
          </div>
          <p className="text-sm opacity-90 break-words">{session.description}</p>
        </div>
      </div>

      <Button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-white/20 hover:bg-white/30 rounded-lg py-2 transition-colors"
        onClick={() => onStartSession(session)} // Redundant but harmless for card onClick
      >
        Start Session
      </Button>
    </motion.div>
  );
};

export default QuickSessionCard;