import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';

const JournalPromptCard = ({ prompt, index, onStartWriting }) => {
  if (!prompt || !onStartWriting) {
    return null;
  }

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Button
        onClick={() => onStartWriting(prompt)}
        className="text-left p-4 bg-white rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all w-full"
      >
        <p className="text-sm text-gray-700 break-words">{prompt}</p>
      </Button>
    </motion.div>
  );
};

export default JournalPromptCard;