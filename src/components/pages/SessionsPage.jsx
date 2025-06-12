import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SessionListSection from '@/components/organisms/SessionListSection';
import AudioPlayerControls from '@/components/organisms/AudioPlayerControls';
import BreathingVisualizerDisplay from '@/components/organisms/BreathingVisualizerDisplay';
import * as sessionService from '@/services/api/sessionService';
import { toast } from 'react-toastify';


const SessionsPage = () => {
  const [activeSession, setActiveSession] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'player', 'breathing'

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
        // Note: The original Sessions.jsx added to state, but here we just complete and return to list.
        // The SessionsListSection handles its own data loading, so a refresh will show it.
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

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <AnimatePresence mode="wait">
        {view === 'list' && (
          <motion.div
            key="list-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SessionListSection onSessionStart={handleSessionStart} />
          </motion.div>
        )}

        {view === 'player' && activeSession && (
          <motion.div
            key="player-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <AudioPlayerControls
              session={activeSession}
              onComplete={handleSessionComplete}
              onBack={handleBackToList}
            />
          </motion.div>
        )}

        {view === 'breathing' && activeSession && (
          <motion.div
            key="breathing-view"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
          >
            <BreathingVisualizerDisplay
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

export default SessionsPage;