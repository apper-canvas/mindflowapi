import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import InsightProgressBar from '@/components/molecules/InsightProgressBar';

const EmotionInsightsList = ({ moodData, timeRange }) => {

  const getFilteredMoodData = () => {
    const now = new Date();
    const daysBack = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

    return moodData.filter(mood => new Date(mood.timestamp) >= startDate);
  };

  const getEmotionInsights = () => {
    const filteredData = getFilteredMoodData();
    const emotionCounts = {};

    filteredData.forEach(mood => {
      mood.emotions?.forEach(emotion => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
    });

    return Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const emotionInsights = getEmotionInsights();
  const maxCount = emotionInsights.length > 0 ? Math.max(...emotionInsights.map(([,c]) => c)) : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Most Common Emotions</h2>
      {emotionInsights.length > 0 ? (
        <div className="space-y-3">
          {emotionInsights.map(([emotion, count], index) => (
            <InsightProgressBar
              key={emotion}
              label={emotion}
              count={count}
              maxCount={maxCount}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ApperIcon name="Heart" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No emotion data yet. Complete mood check-ins to see insights!</p>
        </div>
      )}
    </motion.div>
  );
};

export default EmotionInsightsList;