const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock analysis data storage
let analyses = [];

// AI-powered analysis generation
const generateAnalysis = async (journalEntry) => {
  await delay(800); // Simulate AI processing time
  
  const content = journalEntry.content.toLowerCase();
  const wordCount = journalEntry.content.split(' ').length;
  
  // Sentiment analysis based on keywords
  const positiveKeywords = ['happy', 'grateful', 'joy', 'love', 'peace', 'calm', 'excited', 'hopeful', 'content', 'blessed'];
  const negativeKeywords = ['sad', 'angry', 'frustrated', 'anxious', 'worried', 'stressed', 'overwhelmed', 'lonely', 'tired', 'difficult'];
  const growthKeywords = ['learn', 'grow', 'challenge', 'overcome', 'improve', 'progress', 'achieve', 'goal', 'change', 'better'];
  
  const positiveCount = positiveKeywords.filter(word => content.includes(word)).length;
  const negativeCount = negativeKeywords.filter(word => content.includes(word)).length;
  const growthCount = growthKeywords.filter(word => content.includes(word)).length;
  
  // Determine primary sentiment
  let sentiment = 'neutral';
  if (positiveCount > negativeCount) sentiment = 'positive';
  else if (negativeCount > positiveCount) sentiment = 'negative';
  
  // Generate insights based on analysis
  const insights = [];
  
  if (sentiment === 'positive') {
    insights.push("Your writing reflects a positive mindset and emotional well-being.");
    insights.push("You're experiencing meaningful moments that contribute to your happiness.");
  } else if (sentiment === 'negative') {
    insights.push("You're processing some challenging emotions - this is a healthy part of self-reflection.");
    insights.push("Consider practicing self-compassion as you navigate these feelings.");
  } else {
    insights.push("Your writing shows emotional balance and thoughtful reflection.");
  }
  
  if (growthCount > 0) {
    insights.push("You demonstrate a growth mindset and commitment to personal development.");
  }
  
  if (wordCount > 100) {
    insights.push("The depth of your writing suggests strong self-awareness and introspection.");
  }
  
  // Emotional themes detection
  const emotionalThemes = [];
  if (content.includes('grateful') || content.includes('thankful')) emotionalThemes.push('Gratitude');
  if (content.includes('anxious') || content.includes('worried')) emotionalThemes.push('Anxiety');
  if (content.includes('love') || content.includes('connection')) emotionalThemes.push('Connection');
  if (content.includes('goal') || content.includes('future')) emotionalThemes.push('Purpose');
  if (content.includes('calm') || content.includes('peace')) emotionalThemes.push('Tranquility');
  
  // Growth suggestions
  const suggestions = [];
  if (sentiment === 'negative') {
    suggestions.push("Try a 5-minute breathing exercise to center yourself");
    suggestions.push("Consider reaching out to someone you trust for support");
  } else if (sentiment === 'positive') {
    suggestions.push("Reflect on what contributed to these positive feelings");
    suggestions.push("Consider how you can recreate these moments in the future");
  }
  
  if (growthCount === 0) {
    suggestions.push("Identify one small step you could take toward personal growth");
  }
  
  return {
    sentiment,
    confidence: Math.min(0.95, 0.6 + (Math.abs(positiveCount - negativeCount) * 0.1)),
    insights,
    emotionalThemes,
    suggestions,
    wordCount,
    readingTime: Math.ceil(wordCount / 200), // Estimated reading time in minutes
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