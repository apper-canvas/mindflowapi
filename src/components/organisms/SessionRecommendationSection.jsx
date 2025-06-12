import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const SessionRecommendationSection = ({ onSessionStart, recentMoods = [] }) => {
  const [recommendedSession, setRecommendedSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateRecommendation();
  }, [recentMoods]);

  const generateRecommendation = () => {
    setLoading(true);

    // AI-like session generation based on mood patterns
    setTimeout(() => {
      const avgMood = recentMoods.length > 0
        ? recentMoods.reduce((sum, mood) => sum + mood.moodScore, 0) / recentMoods.length
        : 5;

      const hasAnxiety = recentMoods.some(mood => mood.emotions?.includes('anxious'));
      const hasSadness = recentMoods.some(mood => mood.emotions?.includes('sad'));
      const hasTired = recentMoods.some(mood => mood.emotions?.includes('tired'));

      let session;

      if (hasAnxiety || avgMood < 4) {
        session = {
          id: Date.now().toString(),
          type: 'breathing',
          title: 'Calming Breath Work',
          description: 'A gentle breathing exercise to help reduce anxiety and restore calm',
          duration: 5,
          activities: ['4-7-8 breathing', 'body scan', 'positive affirmations'],
          color: 'from-blue-400 to-blue-500',
          icon: 'Wind'
        };
      } else if (hasSadness || avgMood < 6) {
        session = {
          id: Date.now().toString(),
          type: 'meditation',
          title: 'Loving Kindness Meditation',
          description: 'Cultivate compassion and warmth to lift your spirits',
          duration: 10,
          activities: ['guided meditation', 'loving kindness phrases', 'gentle music'],
          color: 'from-pink-400 to-pink-500',
          icon: 'Heart'
        };
      } else if (hasTired) {
        session = {
          id: Date.now().toString(),
          type: 'breathing',
          title: 'Energizing Breath',
          description: 'Revitalizing breathing techniques to boost your energy',
          duration: 7,
          activities: ['energizing breath', 'movement meditation', 'intention setting'],
          color: 'from-orange-400 to-orange-500',
          icon: 'Zap'
        };
      } else {
        session = {
          id: Date.now().toString(),
          type: 'meditation',
          title: 'Gratitude & Mindfulness',
          description: 'Enhance your positive state with mindful appreciation',
          duration: 8,
          activities: ['gratitude meditation', 'present moment awareness', 'joy cultivation'],
          color: 'from-green-400 to-green-500',
          icon: 'Sparkles'
        };
      }

      setRecommendedSession(session);
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 shadow-lg"
        >
          <div className="animate-pulse space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* AI Recommendation Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <ApperIcon name="Sparkles" size={16} />
            <span>AI Recommendation</span>
          </motion.div>
          <h2 className="text-2xl font-heading font-bold text-gray-800 mb-2">
            Perfect session for you
          </h2>
          <p className="text-gray-600">
            Based on your recent mood patterns
          </p>
        </div>

        {/* Recommended Session Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`bg-gradient-to-br ${recommendedSession.color} rounded-2xl p-6 text-white shadow-xl`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <motion.div
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className="bg-white/20 p-3 rounded-full"
                >
                  <ApperIcon name={recommendedSession.icon} size={24} />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold break-words">{recommendedSession.title}</h3>
                  <p className="text-sm opacity-90">{recommendedSession.duration} minutes</p>
                </div>
              </div>
              <p className="text-sm opacity-90 mb-4 break-words">
                {recommendedSession.description}
              </p>
            </div>
          </div>

          {/* Activities Preview */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-3 opacity-90">This session includes:</h4>
            <div className="grid grid-cols-1 gap-2">
              {recommendedSession.activities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center space-x-2"
                >
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span className="text-sm capitalize break-words">{activity}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={() => onSessionStart(recommendedSession)}
              className="flex-1 bg-white text-gray-800 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Start Session
            </Button>
            <Button
              onClick={generateRecommendation}
              className="px-4 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="RefreshCw" size={20} />
            </Button>
          </div>
        </motion.div>

        {/* Alternative Sessions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Options</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => onSessionStart({
                id: 'quick-breathing',
                type: 'breathing',
                title: '3-Minute Breathing',
                duration: 3,
                activities: ['box breathing'],
                icon: 'Wind'
              })}
              className="bg-blue-100 hover:bg-blue-200 rounded-xl p-4 text-left transition-colors"
            >
              <ApperIcon name="Wind" className="text-blue-600 mb-2" size={20} />
              <h4 className="font-semibold text-gray-800">Quick Breathing</h4>
              <p className="text-sm text-gray-600">3 minutes</p>
            </Button>

            <Button
              onClick={() => onSessionStart({
                id: 'mini-meditation',
                type: 'meditation',
                title: '5-Minute Meditation',
                duration: 5,
                activities: ['mindfulness meditation'],
                icon: 'Brain'
              })}
              className="bg-purple-100 hover:bg-purple-200 rounded-xl p-4 text-left transition-colors"
            >
              <ApperIcon name="Brain" className="text-purple-600 mb-2" size={20} />
              <h4 className="font-semibold text-gray-800">Mini Meditation</h4>
              <p className="text-sm text-gray-600">5 minutes</p>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SessionRecommendationSection;