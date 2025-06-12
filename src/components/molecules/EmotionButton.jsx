import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmotionButton = ({ emotion, isSelected, onClick, delay }) => {
  return (
    <Button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={`p-3 rounded-xl border-2 transition-all duration-200 ${
        isSelected
          ? 'border-primary bg-primary/10 scale-105'
          : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'
      }`}
    >
      <div className="flex flex-col items-center space-y-1">
        <ApperIcon
          name={emotion.icon}
          className={`${emotion.color} ${isSelected ? 'scale-110' : ''} transition-transform`}
          size={20}
        />
        <span className={`text-xs font-medium ${
          isSelected ? 'text-primary' : 'text-gray-600'
        }`}>
          {emotion.label}
        </span>
      </div>
    </Button>
  );
};

export default EmotionButton;