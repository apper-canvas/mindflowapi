import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MoodSlider from '@/components/molecules/MoodSlider';
import EmotionButton from '@/components/molecules/EmotionButton';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import PageHeader from '@/components/molecules/PageHeader';

const MoodCheckInForm = ({ onSubmit }) => {
  const [moodScore, setMoodScore] = useState(5);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [notes, setNotes] = useState('');

  const emotions = [
    { id: 'happy', label: 'Happy', icon: 'Smile', color: 'text-green-500' },
    { id: 'sad', label: 'Sad', icon: 'Frown', color: 'text-blue-500' },
    { id: 'anxious', label: 'Anxious', icon: 'Zap', color: 'text-yellow-500' },
    { id: 'angry', label: 'Angry', icon: 'Flame', color: 'text-red-500' },
    { id: 'calm', label: 'Calm', icon: 'Waves', color: 'text-blue-400' },
    { id: 'excited', label: 'Excited', icon: 'Star', color: 'text-purple-500' },
    { id: 'tired', label: 'Tired', icon: 'Moon', color: 'text-gray-500' },
    { id: 'grateful', label: 'Grateful', icon: 'Heart', color: 'text-pink-500' }
  ];

  const handleEmotionToggle = (emotionId) => {
    setSelectedEmotions(prev =>
      prev.includes(emotionId)
        ? prev.filter(id => id !== emotionId)
        : [...prev, emotionId]
    );
  };

  const handleSubmit = () => {
    const moodData = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      moodScore,
      emotions: selectedEmotions,
      notes
    };
    onSubmit(moodData);
  };

  const getMoodColor = (score) => {
    if (score <= 3) return 'from-red-400 to-red-500';
    if (score <= 6) return 'from-yellow-400 to-orange-500';
    return 'from-green-400 to-green-500';
  };

  const getMoodEmoji = (score) => {
    if (score <= 2) return '😢';
    if (score <= 4) return '😕';
    if (score <= 6) return '😐';
    if (score <= 8) return '🙂';
    return '😊';
  };

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/5 via-white to-secondary/5 rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <PageHeader
          emoji="🌸"
          title="How are you feeling today?"
          subtitle="Take a moment to check in with yourself"
        />

        <MoodSlider
          moodScore={moodScore}
          onScoreChange={setMoodScore}
          getMoodEmoji={getMoodEmoji}
          getMoodColor={getMoodColor}
        />

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">What emotions are you experiencing?</h3>
          <div className="grid grid-cols-4 gap-3">
            {emotions.map((emotion, index) => (
              <EmotionButton
                key={emotion.id}
                emotion={emotion}
                isSelected={selectedEmotions.includes(emotion.id)}
                onClick={() => handleEmotionToggle(emotion.id)}
                delay={index * 0.05}
              />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Any additional thoughts? (optional)
          </label>
          <Input
            as="textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What's on your mind today..."
            rows="3"
          />
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Complete Check-in
        </Button>
      </motion.div>
    </div>
  );
};

export default MoodCheckInForm;