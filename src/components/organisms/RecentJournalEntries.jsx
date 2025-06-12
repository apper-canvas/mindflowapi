import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import JournalEntryCard from '@/components/molecules/JournalEntryCard';
import JournalPromptCard from '@/components/molecules/JournalPromptCard';
import Button from '@/components/atoms/Button';
import Spinner from '@/components/atoms/Spinner';
import ErrorState from '@/components/atoms/ErrorState';
import * as journalService from '@/services/api/journalService';

const RecentJournalEntries = ({ onStartWriting }) => {
  // Validate onStartWriting prop
  if (!onStartWriting || typeof onStartWriting !== 'function') {
    console.error('RecentJournalEntries: onStartWriting prop is required and must be a function');
    return null;
  }
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const journalPrompts = [
    "What am I grateful for today?",
    "How did I show kindness to myself or others?",
    "What challenged me today and how did I respond?",
    "What emotions did I experience and what triggered them?",
    "What would I like to release or let go of?",
    "How did I take care of my mental health today?",
    "What brought me joy or peace today?",
    "What lesson did I learn about myself?",
    "How did I practice mindfulness today?",
    "What do I want to focus on tomorrow?"
  ];

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await journalService.getAll();
      setEntries(result);
    } catch (err) {
      setError(err.message || 'Failed to load journal entries');
      toast.error('Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadEntries} />;
  }

  return (
    <motion.div
      key="list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6"
    >
<motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
<Button
          onClick={() => {
            try {
              onStartWriting(null); // Consistent with JournalEditor's initialPrompt handling
            } catch (error) {
              console.error('Error starting new entry:', error);
            }
          }}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-center space-x-2">
            <ApperIcon name="PenTool" size={20} />
            <span>Start New Entry</span>
          </div>
        </Button>
      </motion.div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Prompts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {journalPrompts.slice(0, 4).map((prompt, index) => (
<JournalPromptCard
              key={index}
              prompt={prompt}
              index={index}
              onStartWriting={(selectedPrompt) => {
                try {
                  // Ensure prompt string is passed consistently
                  onStartWriting(selectedPrompt);
                } catch (error) {
                  console.error('Error starting writing with prompt:', error);
                }
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Entries</h2>
        {entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-2xl shadow-sm"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <ApperIcon name="BookOpen" className="w-16 h-16 text-gray-300 mx-auto" />
            </motion.div>
            <h3 className="mt-4 text-lg font-medium text-gray-800">No entries yet</h3>
            <p className="mt-2 text-gray-500">Start writing your first journal entry</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry, index) => (
              <JournalEntryCard key={entry.id} entry={entry} index={index} />
            ))}
          </div>
        )}
      </div>

      <div className="h-4"></div>
    </motion.div>
  );
};

export default RecentJournalEntries;