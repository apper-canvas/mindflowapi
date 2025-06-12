import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ message, onRetry }) => (
  <div className="h-full overflow-y-auto bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center p-6"
    >
      <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Oops! Something went wrong.</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      <Button
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Try Again
      </Button>
    </motion.div>
  </div>
);

export default ErrorState;