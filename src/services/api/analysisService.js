const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock analysis data storage
let analyses = [];

// Enhanced AI-powered analysis generation with advanced psychological insights
const generateAnalysis = async (journalEntry) => {
  await delay(800); // Simulate AI processing time
  
  const content = journalEntry.content.toLowerCase();
  const wordCount = journalEntry.content.split(' ').length;
  const sentences = journalEntry.content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Enhanced keyword categorization with psychological frameworks
  const positiveKeywords = ['happy', 'grateful', 'joy', 'love', 'peace', 'calm', 'excited', 'hopeful', 'content', 'blessed', 'fulfilled', 'confident', 'optimistic', 'serene'];
  const negativeKeywords = ['sad', 'angry', 'frustrated', 'anxious', 'worried', 'stressed', 'overwhelmed', 'lonely', 'tired', 'difficult', 'disappointed', 'fearful', 'helpless', 'confused'];
  const growthKeywords = ['learn', 'grow', 'challenge', 'overcome', 'improve', 'progress', 'achieve', 'goal', 'change', 'better', 'develop', 'transform', 'breakthrough', 'journey'];
  const reflectionKeywords = ['realize', 'understand', 'reflection', 'insight', 'awareness', 'notice', 'discover', 'recognize', 'acknowledge', 'perspective'];
  const relationshipKeywords = ['friend', 'family', 'connect', 'support', 'together', 'share', 'listen', 'relationship', 'community', 'bond'];
  const mindfulnessKeywords = ['present', 'moment', 'breathe', 'meditation', 'awareness', 'mindful', 'center', 'focus', 'ground', 'stillness'];
  
  // Calculate keyword frequencies
  const positiveCount = positiveKeywords.filter(word => content.includes(word)).length;
  const negativeCount = negativeKeywords.filter(word => content.includes(word)).length;
  const growthCount = growthKeywords.filter(word => content.includes(word)).length;
  const reflectionCount = reflectionKeywords.filter(word => content.includes(word)).length;
  const relationshipCount = relationshipKeywords.filter(word => content.includes(word)).length;
  const mindfulnessCount = mindfulnessKeywords.filter(word => content.includes(word)).length;
  
  // Advanced sentiment analysis
  let sentiment = 'neutral';
  const sentimentScore = (positiveCount - negativeCount) / Math.max(1, positiveCount + negativeCount);
  if (sentimentScore > 0.2) sentiment = 'positive';
  else if (sentimentScore < -0.2) sentiment = 'negative';
  
  // Enhanced confidence scoring with multiple factors
  const sentimentConfidence = Math.min(0.95, 0.6 + (Math.abs(positiveCount - negativeCount) * 0.08));
  const lengthConfidence = Math.min(1.0, wordCount / 50); // More confidence with longer entries
  const diversityConfidence = Math.min(1.0, (growthCount + reflectionCount + mindfulnessCount) * 0.1);
  const overallConfidence = (sentimentConfidence + lengthConfidence + diversityConfidence) / 3;
  
  // Generate core insights
  const insights = [];
  
  if (sentiment === 'positive') {
    insights.push("Your writing reflects a positive mindset and emotional well-being.");
    if (positiveCount >= 3) insights.push("You're experiencing multiple sources of joy and contentment.");
  } else if (sentiment === 'negative') {
    insights.push("You're processing challenging emotions - this shows emotional intelligence and self-awareness.");
    if (negativeCount >= 3) insights.push("Consider practicing self-compassion as you navigate these complex feelings.");
  } else {
    insights.push("Your writing shows emotional balance and thoughtful reflection.");
  }
  
  if (growthCount > 0) {
    insights.push("You demonstrate a growth mindset and commitment to personal development.");
  }
  
  if (reflectionCount >= 2) {
    insights.push("Your self-reflection shows deep introspective abilities and emotional maturity.");
  }
  
  if (wordCount > 100) {
    insights.push("The depth of your writing suggests strong self-awareness and introspection.");
  }
  
  // Advanced emotional themes detection
  const emotionalThemes = [];
  if (content.includes('grateful') || content.includes('thankful') || content.includes('appreciate')) emotionalThemes.push('Gratitude');
  if (content.includes('anxious') || content.includes('worried') || content.includes('nervous')) emotionalThemes.push('Anxiety');
  if (content.includes('love') || content.includes('connection') || relationshipCount > 0) emotionalThemes.push('Connection');
  if (content.includes('goal') || content.includes('future') || content.includes('plan')) emotionalThemes.push('Purpose');
  if (content.includes('calm') || content.includes('peace') || mindfulnessCount > 0) emotionalThemes.push('Tranquility');
  if (content.includes('create') || content.includes('art') || content.includes('express')) emotionalThemes.push('Creativity');
  if (growthCount >= 2) emotionalThemes.push('Growth');
  if (reflectionCount >= 2) emotionalThemes.push('Self-Reflection');
  
  // Enhanced growth suggestions based on patterns
  const suggestions = [];
  
  if (sentiment === 'negative') {
    suggestions.push("Try a 5-minute breathing exercise to center yourself");
    suggestions.push("Consider reaching out to someone you trust for support");
    if (mindfulnessCount === 0) suggestions.push("Practice mindful awareness of your emotions without judgment");
  } else if (sentiment === 'positive') {
    suggestions.push("Reflect on what contributed to these positive feelings");
    suggestions.push("Consider how you can recreate these moments in the future");
    suggestions.push("Share your positive energy with someone who might need it");
  }
  
  if (growthCount === 0) {
    suggestions.push("Identify one small step you could take toward personal growth");
  }
  
  if (relationshipCount === 0 && wordCount > 50) {
    suggestions.push("Consider how your relationships contribute to your well-being");
  }
  
  if (mindfulnessCount === 0) {
    suggestions.push("Try incorporating a moment of mindfulness into your day");
  }
  
  // Writing pattern analysis
  const writingPatterns = {
    complexity: sentences.length > 3 ? 'complex' : sentences.length > 1 ? 'moderate' : 'simple',
    emotionalRange: (positiveCount + negativeCount) >= 3 ? 'wide' : 'narrow',
    introspectionLevel: reflectionCount >= 2 ? 'high' : reflectionCount >= 1 ? 'moderate' : 'low',
    futureOrientation: content.includes('will') || content.includes('plan') || content.includes('hope') ? 'high' : 'low'
  };
  
  // Emotional progression insights
  const emotionalProgression = [];
  
  if (positiveCount > negativeCount * 2) {
    emotionalProgression.push("Strong positive emotional trajectory detected");
  } else if (negativeCount > positiveCount * 2) {
    emotionalProgression.push("Processing challenging emotions - important for growth");
  } else if (positiveCount > 0 && negativeCount > 0) {
    emotionalProgression.push("Balanced emotional processing with awareness of complexity");
  }
  
  if (growthCount >= 2) {
    emotionalProgression.push("Active engagement with personal development");
  }
  
  // Goal and achievement tracking
  const goalIndicators = [];
  if (content.includes('achieve') || content.includes('accomplish')) goalIndicators.push('Achievement Focused');
  if (content.includes('learn') || content.includes('skill')) goalIndicators.push('Learning Oriented');
  if (content.includes('health') || content.includes('exercise') || content.includes('body')) goalIndicators.push('Health Conscious');
  if (relationshipCount > 0) goalIndicators.push('Relationship Focused');
  if (content.includes('create') || content.includes('build')) goalIndicators.push('Creative Expression');
  
  return {
    sentiment,
    confidence: overallConfidence,
    insights,
    emotionalThemes,
    suggestions,
    wordCount,
    readingTime: Math.ceil(wordCount / 200),
    writingPatterns,
    emotionalProgression,
    goalIndicators,
    psychologicalMetrics: {
      sentimentScore: Math.round(sentimentScore * 100) / 100,
      growthOrientation: growthCount / Math.max(1, sentences.length),
      selfReflectionLevel: reflectionCount / Math.max(1, sentences.length),
      emotionalComplexity: (positiveCount + negativeCount) / Math.max(1, wordCount / 10),
      mindfulnessIndicator: mindfulnessCount > 0
    },
    createdAt: new Date().toISOString()
  };
};

export const getAll = async () => {
  await delay(200);
  return [...analyses];
};

export const getById = async (id) => {
  await delay(150);
  const analysis = analyses.find(a => a.id === id);
  return analysis ? { ...analysis } : null;
};

export const getByJournalId = async (journalId) => {
  await delay(200);
  const analysis = analyses.find(a => a.journalId === journalId);
  return analysis ? { ...analysis } : null;
};

export const create = async (journalEntry) => {
  const analysisData = await generateAnalysis(journalEntry);
  
  const newAnalysis = {
    id: Date.now().toString(),
    journalId: journalEntry.id,
    ...analysisData
  };
  
  analyses.unshift(newAnalysis);
  return { ...newAnalysis };
};

export const update = async (id, data) => {
  await delay(250);
  const index = analyses.findIndex(a => a.id === id);
  if (index !== -1) {
    analyses[index] = { ...analyses[index], ...data };
    return { ...analyses[index] };
  }
  throw new Error('Analysis not found');
};

export const delete_ = async (id) => {
  await delay(200);
  const index = analyses.findIndex(a => a.id === id);
  if (index !== -1) {
    const deleted = analyses.splice(index, 1)[0];
    return { ...deleted };
  }
  throw new Error('Analysis not found');
};