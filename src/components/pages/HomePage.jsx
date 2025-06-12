import React, { useState, useEffect } from 'react';
import StatCard from '@/components/molecules/StatCard';
import PageHeader from '@/components/molecules/PageHeader';
import HomePageFeatureManager from '@/components/organisms/HomePageFeatureManager';
import InspirationCard from '@/components/molecules/InspirationCard';
import Spinner from '@/components/atoms/Spinner';
import * as userProgressService from '@/services/api/userProgressService';
import * as moodService from '@/services/api/moodService';

const HomePage = () => {
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

      const today = new Date().toDateString();
      const todayMoodEntry = moods.find(mood =>
        new Date(mood.timestamp).toDateString() === today
      );
      setTodayMood(todayMoodEntry);
    } catch (error) {
      console.error('Failed to load home data:', error);
      // For a home page, we might choose not to show an error state if data fails,
      // but rather fallback to default values or show partial data.
      // For this refactor, we'll keep the spinner if there's an issue with initial data.
    } finally {
      setLoading(false);
    }
  };

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getCurrentDate = () => {
    const today = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('en-US', options);
  };

  const getMoodEmoji = (score) => {
    if (score <= 2) return '😢';
    if (score <= 4) return '😕';
    if (score <= 6) return '😐';
    if (score <= 8) return '🙂';
    return '😊';
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <div className="p-6 pb-0">
<PageHeader
          emoji="✨" // This emoji is part of the greeting, not the header emoji
          title={`${getGreeting()}! ✨`}
          subtitle={`${getCurrentDate()} • How are you feeling today?`}
          className="text-center mb-6"
          hideEmoji={true} // Custom prop to not render emoji for this specific header
        />

        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard emoji="🔥" value={userProgress?.streak || 0} label="Day Streak" delay={0.2} />
          <StatCard emoji={todayMood ? getMoodEmoji(todayMood.moodScore) : '💭'} value={todayMood ? `${todayMood.moodScore}/10` : '--'} label="Today's Mood" delay={0.3} />
          <StatCard emoji="📊" value={userProgress?.totalSessions || 0} label="Sessions" delay={0.4} />
        </div>
      </div>

      <HomePageFeatureManager />

      <InspirationCard />

      <div className="h-4"></div>
    </div>
  );
};

export default HomePage;