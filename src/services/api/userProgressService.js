import progressData from '../mockData/userProgress.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let progress = [...progressData];

export const getAll = async () => {
  await delay(300);
  return [...progress];
};

export const getById = async (id) => {
  await delay(200);
  const userProgress = progress.find(p => p.id === id);
  return userProgress ? { ...userProgress } : null;
};

export const create = async (progressData) => {
  await delay(400);
  const newProgress = {
    ...progressData,
    id: Date.now().toString()
  };
  progress.push(newProgress);
  return { ...newProgress };
};

export const update = async (id, data) => {
  await delay(300);
  const index = progress.findIndex(p => p.id === id);
  if (index !== -1) {
    progress[index] = { ...progress[index], ...data };
    return { ...progress[index] };
  }
  throw new Error('Progress data not found');
};

export const delete_ = async (id) => {
  await delay(250);
  const index = progress.findIndex(p => p.id === id);
  if (index !== -1) {
    const deleted = progress.splice(index, 1)[0];
    return { ...deleted };
  }
  throw new Error('Progress data not found');
};