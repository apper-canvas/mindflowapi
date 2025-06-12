import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';
import ApperIcon from '../components/ApperIcon';
import * as userProgressService from '../services/api/userProgressService';
import * as moodService from '../services/api/moodService';

const Home = () => {
  const [userProgress, setUserProgress] = useState(null);
  const [todayMood, setTodayMood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    setLoading(true);
    try {
      const [progress, moods] = await Promise.all([
        userProgressService.getAll(),
        moodService.getAll()
      ]);
      
      setUserProgress(progress[0] || {
        streak: 0,
        totalSessions: 0,
        averageMood: 5,
        lastCheckIn: null
      });

      // Get today's mood
      const today = new Date().toDateString();
      const todayMoodEntry = moods.find(mood => 
        new Date(mood.timestamp).toDateString() === today
      );
      setTodayMood(todayMoodEntry);
    } catch (error) {
      console.error('Failed to load home data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full overflow-y-auto bg-gradient-to-br from-primary/5 via-white to-secondary/5">
        <div className="p-6 space-y-6">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getMoodEmoji = (score) => {
    if (score <= 2) return '😢';
    if (score <= 4) return '😕';
    if (score <= 6) return '😐';
    if (score <= 8) return '🙂';
    return '😊';
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      {/* Header */}
      <div className="p-6 pb-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-heading font-bold text-gray-800 mb-2">
            {getGreeting()}! ✨
          </h1>
          <p className="text-gray-600">
            How are you feeling today?
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="text-2xl mb-1"
            >
              🔥
            </motion.div>
            <div className="text-xl font-bold text-accent">{userProgress?.streak || 0}</div>
            <div className="text-xs text-gray-600">Day Streak</div>
          </div>

          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="text-2xl mb-1"
            >
              {todayMood ? getMoodEmoji(todayMood.moodScore) : '💭'}
            </motion.div>
            <div className="text-xl font-bold text-primary">
              {todayMood ? `${todayMood.moodScore}/10` : '--'}
            </div>
            <div className="text-xs text-gray-600">Today's Mood</div>
          </div>

          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="text-2xl mb-1"
            >
              📊
            </motion.div>
            <div className="text-xl font-bold text-secondary">{userProgress?.totalSessions || 0}</div>
            <div className="text-xs text-gray-600">Sessions</div>
          </div>
        </motion.div>
      </div>

      {/* Main Feature */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <MainFeature />
      </motion.div>

      {/* Daily Inspiration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 pt-0"
      >
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start space-x-4">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4,
                ease: "easeInOut"
              }}
              className="text-3xl"
            >
              💜
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 mb-2">Daily Inspiration</h3>
              <p className="text-sm text-gray-600 break-words">
                "The present moment is the only time over which we have dominion." - Thích Nhất Hạnh
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Padding for Navigation */}
      <div className="h-4"></div>
    </div>
  );
};

export default Home;