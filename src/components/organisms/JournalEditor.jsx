import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import * as moodService from '@/services/api/moodService';

const JournalEditor = ({ onSave, onCancel, initialPrompt = null }) => {
  const [currentEntry, setCurrentEntry] = useState({ prompt: '', content: '' });
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [loading, setLoading] = useState(false);

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
    // Handle initialPrompt parameter consistently
    if (initialPrompt && typeof initialPrompt === 'string') {
      // Use the provided prompt string
      setSelectedPrompt(initialPrompt);
      setCurrentEntry({ prompt: initialPrompt, content: '' });
    } else {
      // Generate an AI prompt when no specific prompt is provided or initialPrompt is null
      setSelectedPrompt(null);
      generateAIPrompt();
    }
  }, [initialPrompt]);
const generateAIPrompt = async () => {
    setLoading(true);
    try {
      const moods = await moodService.getAll();
      const recentMood = moods?.[moods.length - 1];

      if (recentMood) {
        const avgMood = recentMood.moodScore || 5;
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
      console.error('Error generating AI prompt:', error);
      toast.error('Failed to generate personalized prompt, using random prompt');
      const randomPrompt = journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
      setSelectedPrompt(randomPrompt);
      setCurrentEntry({ prompt: randomPrompt, content: '' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!currentEntry.content.trim()) {
      toast.error('Please write something before saving');
      return;
    }
    
    if (onSave && typeof onSave === 'function') {
      onSave(currentEntry);
    }
  };

  const handleContentChange = (e) => {
    setCurrentEntry(prev => ({
      ...prev,
      content: e.target.value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Journal Entry</h2>
          {selectedPrompt && (
            <div className="bg-primary/10 p-4 rounded-lg mb-4">
              <p className="text-primary font-medium">{selectedPrompt}</p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <Input
            as="textarea"
            value={currentEntry.content}
            onChange={handleContentChange}
            placeholder="Start writing your thoughts..."
            className="w-full h-64 resize-none"
            rows={10}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            onClick={onCancel}
            variant="outline"
            className="px-6 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="px-6 py-2 bg-primary text-white"
            disabled={!currentEntry.content.trim()}
          >
            Save Entry
          </Button>
        </div>
      </div>
    </motion.div>
);
};

export default JournalEditor;