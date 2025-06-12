import React from 'react';
import { motion } from 'framer-motion';

const PageHeader = ({ emoji, title, subtitle }) => {
  return (
    <div className="text-center mb-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="text-4xl mb-4"
      >
        {emoji}
      </motion.div>
      <h1 className="text-3xl font-heading font-bold text-gray-800 mb-2">
        {title}
      </h1>
      <p className="text-gray-600">
        {subtitle}
      </p>
    </div>
  );
};

export default PageHeader;