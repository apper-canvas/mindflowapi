import sessionData from '../mockData/sessions.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let sessions = [...sessionData];

export const getAll = async () => {
  await delay(300);
  return [...sessions];
};

export const getById = async (id) => {
  await delay(200);
  const session = sessions.find(s => s.id === id);
  return session ? { ...session } : null;
};

export const create = async (sessionEntry) => {
  await delay(400);
  const newSession = {
    ...sessionEntry,
    id: Date.now().toString(),
    completedAt: new Date().toISOString()
  };
  sessions.unshift(newSession);
  return { ...newSession };
};

export const update = async (id, data) => {
  await delay(300);
  const index = sessions.findIndex(s => s.id === id);
  if (index !== -1) {
    sessions[index] = { ...sessions[index], ...data };
    return { ...sessions[index] };
  }
  throw new Error('Session not found');
};

export const delete_ = async (id) => {
  await delay(250);
  const index = sessions.findIndex(s => s.id === id);
  if (index !== -1) {
    const deleted = sessions.splice(index, 1)[0];
    return { ...deleted };
  }
  throw new Error('Session not found');
};