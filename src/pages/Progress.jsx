import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';
import ApperIcon from '../components/ApperIcon';
import * as moodService from '../services/api/moodService';
import * as sessionService from '../services/api/sessionService';
import * as userProgressService from '../services/api/userProgressService';

const Progress = () => {
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
      setUserProgress(progress[0] || {
        streak: 0,
        totalSessions: sessionData.length,
        averageMood: moods.length > 0 
          ? moods.reduce((sum, mood) => sum + mood.moodScore, 0) / moods.length 
          : 5,
        lastCheckIn: moods[moods.length - 1]?.timestamp || null
      });
    } catch (err) {
      setError(err.message || 'Failed to load progress data');
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredMoodData = () => {
    const now = new Date();
    const daysBack = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    
    return moodData.filter(mood => new Date(mood.timestamp) >= startDate);
  };

  const getMoodChartData = () => {
    const filteredData = getFilteredMoodData();
    const sortedData = filteredData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    return {
      series: [{
        name: 'Mood Score',
        data: sortedData.map(mood => ({
          x: new Date(mood.timestamp).getTime(),
          y: mood.moodScore
        }))
      }],
      options: {
        chart: {
          type: 'line',
          height: 300,
          toolbar: { show: false },
          zoom: { enabled: false }
        },
        stroke: {
          curve: 'smooth',
          width: 3,
          colors: ['#7C3AED']
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3,
            stops: [0, 100]
          }
        },
        grid: {
          borderColor: '#e2e8f0',
          strokeDashArray: 5
        },
        xaxis: {
          type: 'datetime',
          labels: {
            style: { colors: '#64748b', fontSize: '12px' }
          }
        },
        yaxis: {
          min: 1,
          max: 10,
          labels: {
            style: { colors: '#64748b', fontSize: '12px' }
          }
        },
        tooltip: {
          theme: 'light',
          x: { format: 'MMM dd, yyyy' }
        },
        colors: ['#7C3AED']
      }
    };
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
    if (sortedDates.includes(today) || sortedDates.includes(yesterday)) {
      let checkDate = new Date();
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
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full overflow-y-auto bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-6"
        >
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to load progress</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadProgressData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const streakInfo = getStreakInfo();
  const emotionInsights = getEmotionInsights();
  const chartData = getMoodChartData();

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-4xl mb-4"
          >
            📊
          </motion.div>
          <h1 className="text-3xl font-heading font-bold text-gray-800 mb-2">
            Your Progress
          </h1>
          <p className="text-gray-600">
            Track your wellness journey
          </p>
        </div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-4 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="text-2xl mb-1"
            >
              🔥
            </motion.div>
            <div className="text-2xl font-bold">{streakInfo.current}</div>
            <div className="text-xs opacity-90">Current Streak</div>
          </div>

          <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl p-4 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="text-2xl mb-1"
            >
              📈
            </motion.div>
            <div className="text-2xl font-bold">{userProgress?.averageMood?.toFixed(1) || '0.0'}</div>
            <div className="text-xs opacity-90">Avg Mood</div>
          </div>

          <div className="bg-gradient-to-br from-accent to-accent/80 rounded-2xl p-4 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="text-2xl mb-1"
            >
              🧘‍♀️
            </motion.div>
            <div className="text-2xl font-bold">{sessions.length}</div>
            <div className="text-xs opacity-90">Sessions</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className="text-2xl mb-1"
            >
              🏆
            </motion.div>
            <div className="text-2xl font-bold">{streakInfo.longest}</div>
            <div className="text-xs opacity-90">Best Streak</div>
          </div>
        </motion.div>

        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex justify-center">
            <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
              {[
                { key: '7days', label: '7 Days' },
                { key: '30days', label: '30 Days' },
                { key: '90days', label: '90 Days' }
              ].map((option) => (
                <motion.button
                  key={option.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTimeRange(option.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === option.key
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Mood Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Mood Trends</h2>
          {moodData.length > 0 ? (
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="line"
              height={300}
            />
          ) : (
            <div className="text-center py-12">
              <ApperIcon name="TrendingUp" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No mood data yet. Start tracking to see your trends!</p>
            </div>
          )}
        </motion.div>

        {/* Emotion Insights */}
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
                <motion.div
                  key={emotion}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="font-medium text-gray-800 capitalize">{emotion}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / Math.max(...emotionInsights.map(([,c]) => c))) * 100}%` }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ApperIcon name="Heart" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No emotion data yet. Complete mood check-ins to see insights!</p>
            </div>
          )}
        </motion.div>

        {/* Recent Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <ApperIcon name="Award" className="text-white" size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-800">First Check-in</p>
                <p className="text-sm text-gray-600">Started your wellness journey</p>
              </div>
            </div>
            
            {streakInfo.current >= 3 && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <ApperIcon name="Flame" className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">3-Day Streak</p>
                  <p className="text-sm text-gray-600">Building healthy habits</p>
                </div>
              </div>
            )}
            
            {sessions.length >= 5 && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <ApperIcon name="Brain" className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Mindful Practitioner</p>
                  <p className="text-sm text-gray-600">Completed 5 sessions</p>
                </div>
              </div>
            )}
            
            {streakInfo.longest >= 7 && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <ApperIcon name="Trophy" className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Week Warrior</p>
                  <p className="text-sm text-gray-600">7-day streak achieved</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Bottom Padding */}
        <div className="h-4"></div>
      </div>
    </div>
  );
};

export default Progress;