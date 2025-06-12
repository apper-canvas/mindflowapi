import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import PageHeader from '@/components/molecules/PageHeader';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-6 max-w-md"
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }}
          className="text-6xl mb-6"
        >
          🧘‍♀️
        </motion.div>

        <PageHeader
          title="404"
          subtitle="Page Not Found"
          emoji="" // No emoji for this header
          className="!mb-4" // Override default margin bottom
          hideEmoji={true}
        />

        <p className="text-gray-600 mb-8">
          This page seems to have wandered off during meditation. Let's guide you back to your mindful journey.
        </p>

        <Button
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center space-x-2">
            <ApperIcon name="Home" size={20} />
            <span>Return Home</span>
          </div>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;