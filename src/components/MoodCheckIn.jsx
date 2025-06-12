import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const MoodCheckIn = ({ onSubmit }) => {
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
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-4xl mb-4"
          >
            🌸
          </motion.div>
          <h2 className="text-2xl font-heading font-bold text-gray-800 mb-2">
            How are you feeling today?
          </h2>
          <p className="text-gray-600">
            Take a moment to check in with yourself
          </p>
        </div>

        {/* Mood Scale */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Not great</span>
            <span className="text-sm text-gray-500">Amazing</span>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="1"
              max="10"
              value={moodScore}
              onChange={(e) => setMoodScore(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)`
              }}
            />
            <motion.div
              key={moodScore}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${((moodScore - 1) / 9) * 100}%` }}
            >
              <div className={`text-2xl mb-1 p-2 rounded-full bg-gradient-to-r ${getMoodColor(moodScore)} text-white shadow-lg`}>
                {getMoodEmoji(moodScore)}
              </div>
              <span className="text-sm font-medium text-gray-700">{moodScore}/10</span>
            </motion.div>
          </div>
        </div>

        {/* Emotion Wheel */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">What emotions are you experiencing?</h3>
          <div className="grid grid-cols-4 gap-3">
            {emotions.map((emotion, index) => (
              <motion.button
                key={emotion.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEmotionToggle(emotion.id)}
                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                  selectedEmotions.includes(emotion.id)
                    ? 'border-primary bg-primary/10 scale-105'
                    : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <ApperIcon 
                    name={emotion.icon} 
                    className={`${emotion.color} ${selectedEmotions.includes(emotion.id) ? 'scale-110' : ''} transition-transform`}
                    size={20}
                  />
                  <span className={`text-xs font-medium ${
                    selectedEmotions.includes(emotion.id) ? 'text-primary' : 'text-gray-600'
                  }`}>
                    {emotion.label}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Any additional thoughts? (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What's on your mind today..."
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            rows="3"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Complete Check-in
        </motion.button>
      </motion.div>
    </div>
  );
};

export default MoodCheckIn;