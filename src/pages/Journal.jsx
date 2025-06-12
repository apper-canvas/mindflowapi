import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import * as journalService from '../services/api/journalService';
import * as moodService from '../services/api/moodService';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWriting, setIsWriting] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({ prompt: '', content: '' });
  const [selectedPrompt, setSelectedPrompt] = useState(null);

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

  const generateAIPrompt = async () => {
    try {
      const moods = await moodService.getAll();
      const recentMood = moods[moods.length - 1];
      
      if (recentMood) {
        const avgMood = recentMood.moodScore;
        const emotions = recentMood.emotions || [];
        
        let prompt;
        if (avgMood < 4) {
          prompt = "What support do you need right now, and how can you be gentle with yourself?";
        } else if (emotions.includes('anxious')) {
          prompt = "What thoughts are creating anxiety, and what truths can you remind yourself of?";
        } else if (emotions.includes('grateful')) {
          prompt = "What moments of beauty or connection did you notice today?";
        } else if (avgMood > 7) {
          prompt = "How can you carry this positive energy forward into tomorrow?";
        } else {
          prompt = journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
        }
        
        setSelectedPrompt(prompt);
        setCurrentEntry({ prompt, content: '' });
      } else {
        const randomPrompt = journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
        setSelectedPrompt(randomPrompt);
        setCurrentEntry({ prompt: randomPrompt, content: '' });
      }
    } catch (error) {
      const randomPrompt = journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
      setSelectedPrompt(randomPrompt);
      setCurrentEntry({ prompt: randomPrompt, content: '' });
    }
  };

  const startWriting = (prompt = null) => {
    if (prompt) {
      setSelectedPrompt(prompt);
      setCurrentEntry({ prompt, content: '' });
    } else {
      generateAIPrompt();
    }
    setIsWriting(true);
  };

  const saveEntry = async () => {
    if (!currentEntry.content.trim()) {
      toast.error('Please write something before saving');
      return;
    }

    try {
      const entry = {
        id: Date.now().toString(),
        prompt: currentEntry.prompt,
        content: currentEntry.content,
        moodId: null, // Link to mood if available
        createdAt: new Date().toISOString()
      };

      await journalService.create(entry);
      setEntries(prev => [entry, ...prev]);
      setIsWriting(false);
      setCurrentEntry({ prompt: '', content: '' });
      setSelectedPrompt(null);
      toast.success('Journal entry saved!');
    } catch (error) {
      toast.error('Failed to save entry');
    }
  };

  const cancelWriting = () => {
    setIsWriting(false);
    setCurrentEntry({ prompt: '', content: '' });
    setSelectedPrompt(null);
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
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to load journal</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadEntries}
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
        {isWriting ? (
          <motion.div
            key="writing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6"
          >
            {/* Writing Interface */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelWriting}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ApperIcon name="ArrowLeft" size={20} />
                </motion.button>
                <h2 className="text-xl font-bold text-gray-800">Journal Entry</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generateAIPrompt}
                  className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <ApperIcon name="RefreshCw" size={20} className="text-primary" />
                </motion.button>
              </div>

              {/* Prompt */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 mb-6"
              >
                <div className="flex items-start space-x-3">
                  <ApperIcon name="Lightbulb" className="text-accent mt-1" size={20} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 mb-1">Writing Prompt</h3>
                    <p className="text-gray-700 break-words">{currentEntry.prompt}</p>
                  </div>
                </div>
              </motion.div>

              {/* Text Area */}
              <div className="mb-6">
                <textarea
                  value={currentEntry.content}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Start writing your thoughts..."
                  className="w-full h-64 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                  autoFocus
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">
                    {currentEntry.content.length} characters
                  </span>
                  <span className="text-xs text-gray-400">Auto-saving...</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={saveEntry}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-shadow"
                >
                  Save Entry
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelWriting}
                  className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
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
                📖
              </motion.div>
              <h1 className="text-3xl font-heading font-bold text-gray-800 mb-2">
                Mindful Journal
              </h1>
              <p className="text-gray-600">
                Reflect on your thoughts and feelings
              </p>
            </div>

            {/* New Entry Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startWriting()}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-center space-x-2">
                  <ApperIcon name="PenTool" size={20} />
                  <span>Start New Entry</span>
                </div>
              </motion.button>
            </motion.div>

            {/* Quick Prompts */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Prompts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {journalPrompts.slice(0, 4).map((prompt, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startWriting(prompt)}
                    className="text-left p-4 bg-white rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <p className="text-sm text-gray-700 break-words">{prompt}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Recent Entries */}
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
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-primary break-words">{entry.prompt}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(entry.createdAt).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <ApperIcon name="Heart" className="text-red-400" size={16} />
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed break-words">
                        {entry.content.length > 150 
                          ? `${entry.content.substring(0, 150)}...` 
                          : entry.content
                        }
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Padding */}
            <div className="h-4"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Journal;