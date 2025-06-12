import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const BreathingVisualizer = ({ session, onComplete, onBack }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('inhale'); // inhale, hold, exhale, hold
  const [cycleCount, setCycleCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(session.duration * 60);
  
  // 4-7-8 breathing pattern: inhale for 4, hold for 7, exhale for 8
  const breathingPattern = {
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 1
  };

  const phaseInstructions = {
    inhale: 'Breathe in slowly through your nose',
    hold1: 'Hold your breath gently',
    exhale: 'Exhale slowly through your mouth',
    hold2: 'Rest for a moment'
  };

  useEffect(() => {
    let interval;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsActive(false);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining, onComplete]);

  useEffect(() => {
    if (!isActive) return;

    const cycleDuration = Object.values(breathingPattern).reduce((sum, duration) => sum + duration, 0) * 1000;
    const phases = Object.keys(breathingPattern);
    
    let phaseIndex = 0;
    let phaseStartTime = Date.now();

    const updatePhase = () => {
      const elapsed = Date.now() - phaseStartTime;
      const currentPhaseDuration = breathingPattern[phases[phaseIndex]] * 1000;

      if (elapsed >= currentPhaseDuration) {
        phaseIndex = (phaseIndex + 1) % phases.length;
        if (phaseIndex === 0) {
          setCycleCount(prev => prev + 1);
        }
        setCurrentPhase(phases[phaseIndex]);
        phaseStartTime = Date.now();
      }
    };

    const interval = setInterval(updatePhase, 100);
    return () => clearInterval(interval);
  }, [isActive]);

  const toggleBreathing = () => {
    setIsActive(!isActive);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCircleSize = () => {
    switch (currentPhase) {
      case 'inhale': return 'scale-110';
      case 'hold1': return 'scale-110';
      case 'exhale': return 'scale-75';
      case 'hold2': return 'scale-75';
      default: return 'scale-100';
    }
  };

  const getCircleColor = () => {
    switch (currentPhase) {
      case 'inhale': return 'from-blue-400 to-blue-500';
      case 'hold1': return 'from-purple-400 to-purple-500';
      case 'exhale': return 'from-green-400 to-green-500';
      case 'hold2': return 'from-gray-400 to-gray-500';
      default: return 'from-primary to-secondary';
    }
  };

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-2 rounded-full bg-white/60 hover:bg-white/80 transition-colors"
          >
            <ApperIcon name="ArrowLeft" size={20} />
          </motion.button>
          <div className="text-center flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-800 break-words">{session.title}</h2>
            <p className="text-sm text-gray-600">{formatTime(timeRemaining)} remaining</p>
          </div>
          <div className="w-10"></div>
        </div>

        {/* Breathing Circle */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-64 h-64 flex items-center justify-center mb-6">
            {/* Outer Guide Circle */}
            <div className="absolute w-48 h-48 border-2 border-gray-300 rounded-full opacity-30"></div>
            
            {/* Breathing Circle */}
            <motion.div
              animate={{
                scale: currentPhase === 'inhale' || currentPhase === 'hold1' ? 1.2 : 0.8,
              }}
              transition={{
                duration: currentPhase === 'inhale' ? breathingPattern.inhale : 
                         currentPhase === 'exhale' ? breathingPattern.exhale : 0.5,
                ease: "easeInOut"
              }}
              className={`w-32 h-32 rounded-full bg-gradient-to-br ${getCircleColor()} shadow-2xl flex items-center justify-center`}
            >
              <motion.div
                animate={{ 
                  opacity: isActive ? [0.7, 1, 0.7] : 0.7
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut"
                }}
                className="text-white text-center"
              >
                <ApperIcon name="Wind" size={32} className="mx-auto mb-1" />
                <div className="text-xs font-medium capitalize">{currentPhase.replace('1', '').replace('2', '')}</div>
              </motion.div>
            </motion.div>

            {/* Pulse Rings */}
            {isActive && (
              <>
                <motion.div
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0, 0.3]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3,
                    ease: "easeOut"
                  }}
                  className="absolute w-32 h-32 rounded-full border-2 border-primary"
                />
                <motion.div
                  animate={{ 
                    scale: [1, 1.8, 1],
                    opacity: [0.2, 0, 0.2]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3,
                    delay: 0.5,
                    ease: "easeOut"
                  }}
                  className="absolute w-32 h-32 rounded-full border border-secondary"
                />
              </>
            )}
          </div>

          {/* Instruction Text */}
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2 break-words">
              {phaseInstructions[currentPhase]}
            </h3>
            <p className="text-sm text-gray-600">
              Cycle {cycleCount + 1} • {breathingPattern[currentPhase]} seconds
            </p>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex justify-center mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleBreathing}
            className={`px-8 py-4 rounded-full font-semibold shadow-lg transition-all duration-200 ${
              isActive 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-xl'
            }`}
          >
            <div className="flex items-center space-x-2">
              <ApperIcon name={isActive ? "Pause" : "Play"} size={20} />
              <span>{isActive ? 'Pause' : 'Start Breathing'}</span>
            </div>
          </motion.button>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/60 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-primary">{cycleCount}</div>
            <div className="text-xs text-gray-600">Cycles</div>
          </div>
          <div className="bg-white/60 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-secondary">{Math.floor((session.duration * 60 - timeRemaining) / 60)}</div>
            <div className="text-xs text-gray-600">Minutes</div>
          </div>
          <div className="bg-white/60 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-accent">{breathingPattern[currentPhase]}</div>
            <div className="text-xs text-gray-600">Seconds</div>
          </div>
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/60 rounded-xl p-4"
        >
          <h4 className="font-semibold text-gray-800 mb-2">Breathing Tips</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Find a comfortable seated position</li>
            <li>• Place one hand on your chest, one on your belly</li>
            <li>• Focus on expanding your diaphragm, not your chest</li>
            <li>• If you feel dizzy, take a break and breathe normally</li>
          </ul>
        </motion.div>

        {/* Complete Session Button */}
        {timeRemaining <= 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onComplete}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <div className="flex items-center justify-center space-x-2">
                <ApperIcon name="CheckCircle" size={20} />
                <span>Breathing Session Complete!</span>
              </div>
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default BreathingVisualizer;