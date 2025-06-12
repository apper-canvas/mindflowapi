import journalData from '../mockData/journal.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let entries = [...journalData];

export const getAll = async () => {
  await delay(300);
  return [...entries];
};

export const getById = async (id) => {
  await delay(200);
  const entry = entries.find(e => e.id === id);
  return entry ? { ...entry } : null;
};

export const create = async (journalEntry) => {
  await delay(400);
  const newEntry = {
    ...journalEntry,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  entries.unshift(newEntry);
  return { ...newEntry };
};

export const update = async (id, data) => {
  await delay(300);
  const index = entries.findIndex(e => e.id === id);
  if (index !== -1) {
    entries[index] = { ...entries[index], ...data };
    return { ...entries[index] };
  }
  throw new Error('Journal entry not found');
};

export const delete_ = async (id) => {
  await delay(250);
  const index = entries.findIndex(e => e.id === id);
  if (index !== -1) {
    const deleted = entries.splice(index, 1)[0];
    return { ...deleted };
  }
  throw new Error('Journal entry not found');
};