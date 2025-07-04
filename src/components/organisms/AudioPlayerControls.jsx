import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const AudioPlayerControls = ({ session, onComplete, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime] = useState(session.duration * 60); // Convert minutes to seconds

  useEffect(() => {
    let interval;
    if (isPlaying && currentTime < totalTime) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev + 1 >= totalTime) {
            setIsPlaying(false);
            onComplete();
            return totalTime;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, totalTime, onComplete]);

const [timerActive, setTimerActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const startTimer = () => {
    setTimerActive(true);
    setIsPlaying(true);
  };

  const pauseTimer = () => {
    setTimerActive(false);
    setIsPlaying(false);
  };

  const stopTimer = () => {
    setTimerActive(false);
    setIsPlaying(false);
    setElapsedTime(0);
    setCurrentTime(0);
  };

  const resetTimer = () => {
    setElapsedTime(0);
    setCurrentTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerActive && isPlaying) {
      interval = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1;
          if (newTime >= session.duration * 60) {
            setTimerActive(false);
            setIsPlaying(false);
            onComplete && onComplete();
            return session.duration * 60;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, isPlaying, session.duration, onComplete]);
  const progress = (currentTime / totalTime) * 100;

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBack}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="ArrowLeft" size={20} />
          </Button>
          <div className="text-center flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-800 break-words">{session.title}</h2>
            <p className="text-sm text-gray-600">{session.duration} minute session</p>
          </div>
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>

        {/* Session Visual */}
        <div className="text-center mb-8">
          <motion.div
            animate={{
              scale: isPlaying ? [1, 1.05, 1] : 1,
              rotate: isPlaying ? 360 : 0
            }}
            transition={{
              scale: { repeat: Infinity, duration: 2 },
              rotate: { duration: 20, repeat: Infinity, ease: "linear" }
            }}
            className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-xl"
          >
            <ApperIcon name="Headphones" size={48} className="text-white" />
          </motion.div>

          {/* Current Activity */}
          <motion.div
            key={Math.floor(currentTime / 30)} // Change every 30 seconds
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/10 rounded-lg p-3 mb-4"
          >
            <p className="text-sm font-medium text-primary">
              Now: {session.activities[Math.floor((currentTime / totalTime) * session.activities.length)] || session.activities[0]}
            </p>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(totalTime)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Controls */}
{/* Timer Display */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-gray-800 mb-2">
            {formatTime(elapsedTime)}
          </div>
          <div className="text-sm text-gray-600">
            {formatTime(session.duration * 60 - elapsedTime)} remaining
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(elapsedTime / (session.duration * 60)) * 100}%` }}
            />
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Button
            onClick={stopTimer}
            className="p-3 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon name="Square" size={20} />
          </Button>

          <Button
            onClick={timerActive ? pauseTimer : startTimer}
            className="p-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name={timerActive && isPlaying ? "Pause" : "Play"} size={32} />
          </Button>

          <Button
            onClick={resetTimer}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon name="RotateCcw" size={20} />
          </Button>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center justify-center space-x-6 mb-6">
          <Button
            onClick={() => setCurrentTime(Math.max(0, currentTime - 30))}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon name="RotateCcw" size={20} />
          </Button>

          <Button
            onClick={togglePlayPause}
            className="p-4 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name={isPlaying ? "Pause" : "Play"} size={32} />
          </Button>

          <Button
            onClick={() => setCurrentTime(Math.min(totalTime, currentTime + 30))}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon name="RotateCw" size={20} />
          </Button>
        </div>

        {/* Session Info */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Session Guide</h3>
          <div className="space-y-2">
            {session.activities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0.5 }}
                animate={{
                  opacity: Math.floor((currentTime / totalTime) * session.activities.length) === index ? 1 : 0.5,
                  scale: Math.floor((currentTime / totalTime) * session.activities.length) === index ? 1.02 : 1
                }}
                className="flex items-center space-x-2"
              >
                <div className={`w-2 h-2 rounded-full ${
                  Math.floor((currentTime / totalTime) * session.activities.length) === index
                    ? 'bg-primary'
                    : 'bg-gray-300'
                }`} />
                <span className={`text-sm capitalize break-words ${
                  Math.floor((currentTime / totalTime) * session.activities.length) === index
                    ? 'text-primary font-medium'
                    : 'text-gray-600'
                }`}>
                  {activity}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Complete Session Button */}
        {currentTime >= totalTime && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Button
              onClick={onComplete}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <div className="flex items-center justify-center space-x-2">
                <ApperIcon name="CheckCircle" size={20} />
                <span>Session Complete!</span>
              </div>
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AudioPlayerControls;