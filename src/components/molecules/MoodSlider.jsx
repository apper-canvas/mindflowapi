import React from 'react';
import { motion } from 'framer-motion';

const MoodSlider = ({ moodScore, onScoreChange, getMoodEmoji, getMoodColor }) => {
  return (
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
          onChange={(e) => onScoreChange(Number(e.target.value))}
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
  );
};

export default MoodSlider;