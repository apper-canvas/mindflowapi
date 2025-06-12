import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import StatCard from '@/components/molecules/StatCard';
import TimeRangeSelector from '@/components/molecules/TimeRangeSelector';
import MoodTrendChart from '@/components/organisms/MoodTrendChart';
import EmotionInsightsList from '@/components/organisms/EmotionInsightsList';
import AchievementsSection from '@/components/organisms/AchievementsSection';
import Spinner from '@/components/atoms/Spinner';
import ErrorState from '@/components/atoms/ErrorState';
import * as moodService from '@/services/api/moodService';
import * as sessionService from '@/services/api/sessionService';
import * as userProgressService from '@/services/api/userProgressService';

const ProgressDashboard = () => {
  const [moodData, setMoodData] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7days'); // 7days, 30days, 90days

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [moods, sessionData, progress] = await Promise.all([
        moodService.getAll(),
        sessionService.getAll(),
        userProgressService.getAll()
      ]);

      setMoodData(moods);
      setSessions(sessionData);

      const calculatedAverageMood = moods.length > 0
        ? moods.reduce((sum, mood) => sum + mood.moodScore, 0) / moods.length
        : 5;

      const streakInfo = getStreakInfo(moods); // Pass moods to streak calculation

      setUserProgress(progress[0] || {
        streak: streakInfo.current, // Use calculated streak
        totalSessions: sessionData.length,
        averageMood: calculatedAverageMood,
        lastCheckIn: moods[moods.length - 1]?.timestamp || null
      });
    } catch (err) {
      setError(err.message || 'Failed to load progress data');
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  // Helper for streak calculation (moved here to be self-contained for initial load)
  const getStreakInfo = (moodsArr) => {
    if (moodsArr.length === 0) return { current: 0, longest: 0 };

    const sortedDates = moodsArr
      .map(mood => new Date(mood.timestamp).toDateString())
      .sort()
      .filter((date, index, arr) => arr.indexOf(date) === index);

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    if (sortedDates.includes(today)) {
      let checkDate = new Date();
      while (sortedDates.includes(checkDate.toDateString())) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    } else if (sortedDates.includes(yesterday)) {
        let checkDate = new Date(yesterday);
        while (sortedDates.includes(checkDate.toDateString())) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }
    }

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

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadProgressData} />;
  }

  const streakInfo = getStreakInfo(moodData); // Recalculate if moodData changes after initial load

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          emoji="🔥"
          value={streakInfo.current}
          label="Current Streak"
          delay={0.3}
          className="bg-gradient-to-br from-primary to-primary/80 text-white"
        />
        <StatCard
          emoji="📈"
          value={userProgress?.averageMood?.toFixed(1) || '0.0'}
          label="Avg Mood"
          delay={0.4}
          className="bg-gradient-to-br from-secondary to-secondary/80 text-white"
        />
        <StatCard
          emoji="🧘‍♀️"
          value={sessions.length}
          label="Sessions"
          delay={0.5}
          className="bg-gradient-to-br from-accent to-accent/80 text-white"
        />
        <StatCard
          emoji="🏆"
          value={streakInfo.longest}
          label="Best Streak"
          delay={0.6}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white"
        />
      </div>

      <TimeRangeSelector
        timeRange={timeRange}
        onSelectRange={setTimeRange}
        options={[
          { key: '7days', label: '7 Days' },
          { key: '30days', label: '30 Days' },
          { key: '90days', label: '90 Days' }
        ]}
      />

      <MoodTrendChart moodData={moodData} timeRange={timeRange} />

      <EmotionInsightsList moodData={moodData} timeRange={timeRange} />

      <AchievementsSection moodData={moodData} sessions={sessions} />

      <div className="h-4"></div>
    </div>
  );
};

export default ProgressDashboard;