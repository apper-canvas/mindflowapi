import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import AudioPlayer from '../components/AudioPlayer';
import BreathingVisualizer from '../components/BreathingVisualizer';
import * as sessionService from '../services/api/sessionService';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'player', 'breathing'

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await sessionService.getAll();
      setSessions(result);
    } catch (err) {
      setError(err.message || 'Failed to load sessions');
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleSessionStart = (session) => {
    setActiveSession(session);
    setView(session.type === 'breathing' ? 'breathing' : 'player');
  };

  const handleSessionComplete = async () => {
    if (activeSession) {
      try {
        const completedSession = {
          ...activeSession,
          completedAt: new Date().toISOString()
        };
        await sessionService.create(completedSession);
        setSessions(prev => [completedSession, ...prev]);
        setActiveSession(null);
        setView('list');
        toast.success('Session completed! Great work!');
      } catch (error) {
        toast.error('Failed to save session');
      }
    }
  };

  const handleBackToList = () => {
    setActiveSession(null);
    setView('list');
  };

  const quickSessions = [
    {
      id: 'quick-breathing',
      type: 'breathing',
      title: '3-Minute Breathing',
      description: 'Quick stress relief with focused breathing',
      duration: 3,
      activities: ['box breathing', 'relaxation'],
      icon: 'Wind',
      color: 'from-blue-400 to-blue-500'
    },
    {
      id: 'mini-meditation',
      type: 'meditation',
      title: '5-Minute Meditation',
      description: 'Brief mindfulness practice for busy schedules',
      duration: 5,
      activities: ['mindfulness', 'body awareness'],
      icon: 'Brain',
      color: 'from-purple-400 to-purple-500'
    },
    {
      id: 'energy-boost',
      type: 'breathing',
      title: 'Energy Boost',
      description: 'Revitalizing breathing to increase alertness',
      duration: 4,
      activities: ['energizing breath', 'focus enhancement'],
      icon: 'Zap',
      color: 'from-orange-400 to-orange-500'
    },
    {
      id: 'sleep-prep',
      type: 'meditation',
      title: 'Sleep Preparation',
      description: 'Calming meditation for better rest',
      duration: 10,
      activities: ['progressive relaxation', 'sleep meditation'],
      icon: 'Moon',
      color: 'from-indigo-400 to-indigo-500'
    }
  ];

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
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to load sessions</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadSessions}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <AnimatePresence mode="wait">
        {view === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="text-4xl mb-4"
              >
                🧘‍♀️
              </motion.div>
              <h1 className="text-3xl font-heading font-bold text-gray-800 mb-2">
                Mindful Sessions
              </h1>
              <p className="text-gray-600">
                Choose your practice for today
              </p>
            </div>

            {/* Quick Start Sessions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Start</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className={`bg-gradient-to-br ${session.color} rounded-2xl p-6 text-white shadow-lg cursor-pointer`}
                    onClick={() => handleSessionStart(session)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <motion.div
                            whileHover={{ rotate: 10 }}
                            className="bg-white/20 p-2 rounded-full"
                          >
                            <ApperIcon name={session.icon} size={20} />
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold break-words">{session.title}</h3>
                            <p className="text-sm opacity-90">{session.duration} minutes</p>
                          </div>
                        </div>
                        <p className="text-sm opacity-90 break-words">{session.description}</p>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-white/20 hover:bg-white/30 rounded-lg py-2 transition-colors"
                    >
                      Start Session
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Session History */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Sessions</h2>
              {sessions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 bg-white rounded-2xl shadow-sm"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  >
                    <ApperIcon name="Heart" className="w-16 h-16 text-gray-300 mx-auto" />
                  </motion.div>
                  <h3 className="mt-4 text-lg font-medium text-gray-800">No sessions yet</h3>
                  <p className="mt-2 text-gray-500">Start your first mindful session above</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                          <ApperIcon 
                            name={session.type === 'breathing' ? 'Wind' : 'Brain'} 
                            className="text-white" 
                            size={20} 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 break-words">{session.title}</h3>
                          <p className="text-sm text-gray-600">
                            {session.duration} minutes • {new Date(session.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleSessionStart(session)}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <ApperIcon name="Play" size={16} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Padding */}
            <div className="h-4"></div>
          </motion.div>
        )}

        {view === 'player' && activeSession && (
          <motion.div
            key="player"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <AudioPlayer 
              session={activeSession}
              onComplete={handleSessionComplete}
              onBack={handleBackToList}
            />
          </motion.div>
        )}

        {view === 'breathing' && activeSession && (
          <motion.div
            key="breathing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
          >
            <BreathingVisualizer 
              session={activeSession}
              onComplete={handleSessionComplete}
              onBack={handleBackToList}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sessions;