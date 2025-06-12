import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import * as analysisService from '@/services/api/analysisService';

const JournalEntryCard = ({ entry, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  useEffect(() => {
    if (isExpanded && !analysis && entry.id) {
      loadAnalysis();
    }
  }, [isExpanded, entry.id]);

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

                {/* Growth Suggestions */}
                {analysis.suggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                      <ApperIcon name="TrendingUp" size={14} className="mr-1.5 text-green-500" />
                      Growth Suggestions
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