import React from 'react';
import { motion } from 'framer-motion';

const MoodSlider = ({ selectedMilestone, onMilestoneChange }) => {
  const milestones = [
{ id: 'struggling', label: 'Struggling', emoji: '😢', color: 'from-red-400 to-red-500', description: 'Having a really tough time' },
    { id: 'rough', label: 'Rough Day', emoji: '😕', color: 'from-orange-400 to-red-400', description: 'Things feel challenging' },
    { id: 'getting-by', label: 'Getting By', emoji: '😐', color: 'from-yellow-400 to-orange-400', description: 'Managing but not great' },
    { id: 'ok', label: 'Okay', emoji: '🙂', color: 'from-yellow-400 to-green-400', description: 'Feeling alright today' },
    { id: 'good', label: 'Good', emoji: '😊', color: 'from-green-400 to-green-500', description: 'Having a nice day' },
    { id: 'great', label: 'Great', emoji: '😄', color: 'from-green-500 to-emerald-500', description: 'Feeling really positive' },
    { id: 'amazing', label: 'Amazing', emoji: '🤩', color: 'from-emerald-500 to-cyan-500', description: 'On top of the world!' }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-500">How are you feeling today?</span>
        <span className="text-sm text-gray-500">Select your current state</span>
      </div>

      <div className="space-y-3">
        {milestones.map((milestone, index) => (
          <motion.button
            key={milestone.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onMilestoneChange(milestone.id)}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              selectedMilestone === milestone.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`text-2xl p-2 rounded-full bg-gradient-to-r ${milestone.color} text-white shadow-sm`}>
                  {milestone.emoji}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{milestone.label}</h4>
                  <p className="text-sm text-gray-600">{milestone.description}</p>
                </div>
              </div>
              {selectedMilestone === milestone.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default MoodSlider;