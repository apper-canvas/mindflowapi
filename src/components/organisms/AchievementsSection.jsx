import React from 'react';
import { motion } from 'framer-motion';
import AchievementItem from '@/components/molecules/AchievementItem';

const AchievementsSection = ({ moodData, sessions }) => {

  const getStreakInfo = () => {
    if (moodData.length === 0) return { current: 0, longest: 0 };

    const sortedDates = moodData
      .map(mood => new Date(mood.timestamp).toDateString())
      .sort()
      .filter((date, index, arr) => arr.indexOf(date) === index);

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    // Calculate current streak
    if (sortedDates.includes(today)) { // Only count today if it's there
      let checkDate = new Date();
      while (sortedDates.includes(checkDate.toDateString())) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    } else if (sortedDates.includes(yesterday)) { // If today is not there, check for yesterday as end of streak
        let checkDate = new Date(yesterday);
        while (sortedDates.includes(checkDate.toDateString())) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }
    }


    // Calculate longest streak
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const dayDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);

      if (dayDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { current: currentStreak, longest: longestStreak };
  };

  const streakInfo = getStreakInfo();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Achievements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {moodData.length > 0 && (
          <AchievementItem
            iconName="Award"
            iconColor="bg-green-500"
            title="First Check-in"
            description="Started your wellness journey"
          />
        )}

        {streakInfo.current >= 3 && (
          <AchievementItem
            iconName="Flame"
            iconColor="bg-orange-500"
            title="3-Day Streak"
            description="Building healthy habits"
          />
        )}

        {sessions.length >= 5 && (
          <AchievementItem
            iconName="Brain"
            iconColor="bg-purple-500"
            title="Mindful Practitioner"
            description="Completed 5 sessions"
          />
        )}

        {streakInfo.longest >= 7 && (
          <AchievementItem
            iconName="Trophy"
            iconColor="bg-blue-500"
            title="Week Warrior"
            description="7-day streak achieved"
          />
        )}
        {moodData.length === 0 && sessions.length === 0 && (
            <p className="text-gray-500 text-sm">Start your journey to unlock achievements!</p>
        )}
      </div>
    </motion.div>
  );
};

export default AchievementsSection;