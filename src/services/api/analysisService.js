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
    insights.push("I can sense the positive energy flowing through your words - you're in a really good place right now!");
    if (positiveCount >= 3) insights.push("Wow, you're experiencing so many wonderful moments - it's beautiful to see such abundance in your life.");
  } else if (sentiment === 'negative') {
    insights.push("I notice you're working through some tough emotions. That takes real courage, and writing about it shows incredible self-awareness.");
    if (negativeCount >= 3) insights.push("You're dealing with a lot right now. Remember to be extra gentle with yourself - you're doing the best you can.");
  } else {
    insights.push("Your writing shows such thoughtful balance - you're really in tune with the full spectrum of your experiences.");
  }
  
  if (growthCount > 0) {
    insights.push("I love seeing your commitment to growing and evolving - that mindset will take you amazing places!");
  }
  
  if (reflectionCount >= 2) {
    insights.push("The depth of your self-reflection is really impressive - you have such wisdom and emotional intelligence.");
  }
  
  if (wordCount > 100) {
    insights.push("You took the time to really dive deep here - that kind of thorough self-exploration is so valuable.");
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
    suggestions.push("How about trying some deep breathing? Even 5 minutes can help you feel more centered");
    suggestions.push("Consider reaching out to someone who cares about you - you don't have to carry this alone");
    if (mindfulnessCount === 0) suggestions.push("Try noticing your emotions with curiosity instead of judgment - like watching clouds pass by");
  } else if (sentiment === 'positive') {
    suggestions.push("Take a moment to really savor what's making you feel good - you deserve this happiness!");
    suggestions.push("Think about how you can create more moments like these in your future");
    suggestions.push("Your positive energy could really brighten someone else's day - consider sharing it!");
  }
  
  if (growthCount === 0) {
    suggestions.push("What's one tiny step you could take today that your future self would thank you for?");
  }
  
  if (relationshipCount === 0 && wordCount > 50) {
    suggestions.push("Think about the people who matter to you - how are those connections nurturing your soul?");
  }
  
  if (mindfulnessCount === 0) {
    suggestions.push("Try pausing for just one mindful breath today - present moment awareness is a superpower!");
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
    emotionalProgression.push("You're riding a beautiful wave of positivity - I can feel your joy through your words!");
  } else if (negativeCount > positiveCount * 2) {
    emotionalProgression.push("You're being so brave by facing difficult emotions head-on - this is how real healing happens");
  } else if (positiveCount > 0 && negativeCount > 0) {
    emotionalProgression.push("You're embracing the full human experience with such grace - life's complexity and you're handling it beautifully");
  }
  
  if (growthCount >= 2) {
    emotionalProgression.push("Your passion for personal growth is contagious - you're really committed to becoming your best self!");
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