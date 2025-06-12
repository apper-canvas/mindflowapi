import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import * as analysisService from '@/services/api/analysisService';

const JournalEntryCard = ({ entry, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

useEffect(() => {
    if (!analysis && entry.id && entry.content && entry.content.trim().length > 0) {
      loadAnalysis();
    }
  }, [entry.id, entry.content]);

  const loadAnalysis = async () => {
    setLoadingAnalysis(true);
    try {
      const analysisData = await analysisService.getByJournalId(entry.id);
      setAnalysis(analysisData);
    } catch (error) {
      console.warn('Failed to load analysis:', error);
    }
    setLoadingAnalysis(false);
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-orange-600 bg-orange-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'Smile';
      case 'negative': return 'CloudRain';
      default: return 'Brain';
    }
  };

  return (
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
        <div className="flex items-center space-x-2">
          <ApperIcon name="Heart" className="text-red-400" size={16} />
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 transition-all duration-200"
          >
            <ApperIcon 
              name="Brain" 
              className="text-primary" 
              size={14} 
            />
          </button>
        </div>
      </div>
      
      <p className="text-gray-700 text-sm leading-relaxed break-words">
        {entry.content.length > 150
          ? `${entry.content.substring(0, 150)}...`
          : entry.content
        }
      </p>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 border-t border-gray-100 pt-4"
          >
            {loadingAnalysis ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-gray-500">Loading insights...</span>
              </div>
) : analysis ? (
              <div className="space-y-4">
                {/* Sentiment Analysis */}
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getSentimentColor(analysis.sentiment)}`}>
                  <ApperIcon 
                    name={getSentimentIcon(analysis.sentiment)} 
                    size={12} 
                    className="mr-1.5" 
                  />
                  {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)} Sentiment
                  <span className="ml-1 opacity-75">
                    ({Math.round(analysis.confidence * 100)}%)
                  </span>
                </div>

                {/* Key Insights */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                    <ApperIcon name="Lightbulb" size={14} className="mr-1.5 text-accent" />
                    Key Insights
                  </h4>
                  <ul className="space-y-1">
                    {analysis.insights.map((insight, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start">
                        <span className="text-primary mr-2">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Emotional Progression */}
                {analysis.emotionalProgression && analysis.emotionalProgression.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                      <ApperIcon name="TrendingUp" size={14} className="mr-1.5 text-purple-500" />
                      Emotional Progression
                    </h4>
                    <ul className="space-y-1">
                      {analysis.emotionalProgression.map((progression, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-start">
                          <span className="text-purple-500 mr-2">↗</span>
                          {progression}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Writing Patterns */}
                {analysis.writingPatterns && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                      <ApperIcon name="FileText" size={14} className="mr-1.5 text-indigo-500" />
                      Writing Patterns
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Complexity:</span>
                        <span className="font-medium capitalize">{analysis.writingPatterns.complexity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Emotional Range:</span>
                        <span className="font-medium capitalize">{analysis.writingPatterns.emotionalRange}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Introspection:</span>
                        <span className="font-medium capitalize">{analysis.writingPatterns.introspectionLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Future Focus:</span>
                        <span className="font-medium capitalize">{analysis.writingPatterns.futureOrientation}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Goal Indicators */}
                {analysis.goalIndicators && analysis.goalIndicators.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                      <ApperIcon name="Target" size={14} className="mr-1.5 text-orange-500" />
                      Goal Indicators
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {analysis.goalIndicators.map((goal, idx) => (
                        <span 
                          key={idx}
                          className="inline-block px-2 py-1 bg-gradient-to-r from-orange-50 to-amber-50 text-xs text-orange-700 rounded-full border border-orange-100"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Emotional Themes */}
                {analysis.emotionalThemes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                      <ApperIcon name="Palette" size={14} className="mr-1.5 text-secondary" />
                      Emotional Themes
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {analysis.emotionalThemes.map((theme, idx) => (
                        <span 
                          key={idx}
                          className="inline-block px-2 py-1 bg-gradient-to-r from-secondary/10 to-accent/10 text-xs text-gray-700 rounded-full"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Psychological Metrics */}
                {analysis.psychologicalMetrics && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                      <ApperIcon name="Brain" size={14} className="mr-1.5 text-blue-500" />
                      Psychological Insights
                    </h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Growth Orientation:</span>
                        <span className="font-medium">
                          {Math.round(analysis.psychologicalMetrics.growthOrientation * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Self-Reflection:</span>
                        <span className="font-medium">
                          {Math.round(analysis.psychologicalMetrics.selfReflectionLevel * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Emotional Complexity:</span>
                        <span className="font-medium">
                          {Math.round(analysis.psychologicalMetrics.emotionalComplexity * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Mindfulness Present:</span>
                        <span className={`font-medium ${analysis.psychologicalMetrics.mindfulnessIndicator ? 'text-green-600' : 'text-gray-400'}`}>
                          {analysis.psychologicalMetrics.mindfulnessIndicator ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Growth Suggestions */}
                {analysis.suggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                      <ApperIcon name="Compass" size={14} className="mr-1.5 text-green-500" />
                      Personalized Recommendations
                    </h4>
                    <ul className="space-y-1">
                      {analysis.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-start">
                          <span className="text-green-500 mr-2">→</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Reading Stats */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <span className="text-xs text-gray-500 flex items-center">
                    <ApperIcon name="Clock" size={12} className="mr-1" />
                    {analysis.readingTime} min read
                  </span>
                  <span className="text-xs text-gray-500">
                    {analysis.wordCount} words
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No analysis available for this entry</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default JournalEntryCard;