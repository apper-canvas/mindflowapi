import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import QuickSessionCard from '@/components/molecules/QuickSessionCard';
import SessionHistoryItem from '@/components/molecules/SessionHistoryItem';
import PageHeader from '@/components/molecules/PageHeader';
import Spinner from '@/components/atoms/Spinner';
import ErrorState from '@/components/atoms/ErrorState';
import * as sessionService from '@/services/api/sessionService';

const SessionListSection = ({ onSessionStart }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    return <Spinner />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadSessions} />;
  }

  return (
    <motion.div
      key="list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6"
    >
      <PageHeader
        emoji="🧘‍♀️"
        title="Mindful Sessions"
        subtitle="Choose your practice for today"
      />

<div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Start</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {quickSessions.map((session, index) => (
            <QuickSessionCard
              key={session.id}
              session={session}
              index={index}
              onStartSession={onSessionStart}
            />
          ))}
        </div>
      </div>

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
              <SessionHistoryItem
                key={session.id}
                session={session}
                index={index}
                onStartSession={onSessionStart}
              />
            ))}
          </div>
        )}
      </div>

      <div className="h-4"></div>
    </motion.div>
  );
};

export default SessionListSection;