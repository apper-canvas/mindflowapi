import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import MoodCheckIn from './MoodCheckIn';
import SessionRecommendation from './SessionRecommendation';
import AudioPlayer from './AudioPlayer';
import BreathingVisualizer from './BreathingVisualizer';
import * as moodService from '../services/api/moodService';
import * as sessionService from '../services/api/sessionService';

const MainFeature = () => {
  const [activeFeature, setActiveFeature] = useState('checkin');
  const [currentSession, setCurrentSession] = useState(null);
  const [sessionData, setSessionData] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sessions, moods] = await Promise.all([
        sessionService.getAll(),
        moodService.getAll()
      ]);
      setSessionData(sessions);
      setMoodData(moods);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSubmit = async (moodData) => {
    try {
      await moodService.create(moodData);
      setActiveFeature('recommendation');
      toast.success('Mood check-in completed!');
    } catch (error) {
      toast.error('Failed to save mood check-in');
    }
  };

  const handleSessionStart = (session) => {
    setCurrentSession(session);
    if (session.type === 'breathing') {
      setActiveFeature('breathing');
    } else {
      setActiveFeature('player');
    }
  };

  const handleSessionComplete = async () => {
    if (currentSession) {
      try {
        await sessionService.create({
          ...currentSession,
          completedAt: new Date().toISOString()
        });
        setCurrentSession(null);
        setActiveFeature('checkin');
        toast.success('Session completed! Great work!');
      } catch (error) {
        toast.error('Failed to save session');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-6 shadow-md"
          >
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden">
      <AnimatePresence mode="wait">
        {activeFeature === 'checkin' && (
          <motion.div
            key="checkin"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <MoodCheckIn onSubmit={handleMoodSubmit} />
          </motion.div>
        )}

        {activeFeature === 'recommendation' && (
          <motion.div
            key="recommendation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SessionRecommendation 
              onSessionStart={handleSessionStart}
              recentMoods={moodData.slice(-3)}
            />
          </motion.div>
        )}

        {activeFeature === 'player' && currentSession && (
          <motion.div
            key="player"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AudioPlayer 
              session={currentSession}
              onComplete={handleSessionComplete}
              onBack={() => setActiveFeature('recommendation')}
            />
          </motion.div>
        )}

        {activeFeature === 'breathing' && currentSession && (
          <motion.div
            key="breathing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <BreathingVisualizer 
              session={currentSession}
              onComplete={handleSessionComplete}
              onBack={() => setActiveFeature('recommendation')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Access Navigation */}
      <motion.div 
        className="fixed bottom-20 right-6 z-30"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveFeature('checkin')}
          className="bg-gradient-to-r from-primary to-secondary text-white rounded-full p-4 shadow-lg"
        >
          <ApperIcon name="Heart" size={24} />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default MainFeature;