import moodData from '../mockData/moods.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let moods = [...moodData];

export const getAll = async () => {
  await delay(300);
  return [...moods];
};

export const getById = async (id) => {
  await delay(200);
  const mood = moods.find(m => m.id === id);
  return mood ? { ...mood } : null;
};

export const create = async (moodEntry) => {
  await delay(400);
  const newMood = {
    ...moodEntry,
    id: Date.now().toString(),
    timestamp: new Date().toISOString()
  };
  moods.unshift(newMood);
  return { ...newMood };
};

export const update = async (id, data) => {
  await delay(300);
  const index = moods.findIndex(m => m.id === id);
  if (index !== -1) {
    moods[index] = { ...moods[index], ...data };
    return { ...moods[index] };
  }
  throw new Error('Mood entry not found');
};

export const delete_ = async (id) => {
  await delay(250);
  const index = moods.findIndex(m => m.id === id);
  if (index !== -1) {
    const deleted = moods.splice(index, 1)[0];
    return { ...deleted };
  }
  throw new Error('Mood entry not found');
};