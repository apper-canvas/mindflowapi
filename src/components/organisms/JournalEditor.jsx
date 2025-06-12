import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import * as moodService from '@/services/api/moodService';

const JournalEditor = ({ onSave, onCancel }) => {
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
    // Generate an initial prompt when the editor mounts
    generateAIPrompt();
  }, []);

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

  const handleSave = () => {
    if (!currentEntry.content.trim()) {
      toast.error('Please write something before saving');
      return;
    }
    onSave(currentEntry);
  };

  return (
    <motion.div
      key="writing"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6"
    >
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onCancel}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ApperIcon name="ArrowLeft" size={20} />
          </Button>
          <h2 className="text-xl font-bold text-gray-800">Journal Entry</h2>
          <Button
            onClick={generateAIPrompt}
            className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            <ApperIcon name="RefreshCw" size={20} className="text-primary" />
          </Button>
        </div>

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

        <div className="mb-6">
          <Input
            as="textarea"
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

        <div className="flex space-x-3">
          <Button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-shadow"
          >
            Save Entry
          </Button>
          <Button
            onClick={onCancel}
            className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default JournalEditor;