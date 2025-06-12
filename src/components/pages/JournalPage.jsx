import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import PageHeader from '@/components/molecules/PageHeader';
import JournalEditor from '@/components/organisms/JournalEditor';
import RecentJournalEntries from '@/components/organisms/RecentJournalEntries';
import * as journalService from '@/services/api/journalService';

const JournalPage = () => {
  const [isWriting, setIsWriting] = useState(false);

  const handleSaveEntry = async (entry) => {
    try {
      const newEntry = {
        id: Date.now().toString(),
        prompt: entry.prompt,
        content: entry.content,
        moodId: null, // Link to mood if available
        createdAt: new Date().toISOString()
      };
      await journalService.create(newEntry);
      setIsWriting(false);
      toast.success('Journal entry saved!');
      // Trigger reload of entries in RecentJournalEntries implicitly by state change
      // or by re-mounting the component. Here, since it's a separate component,
      // it should re-fetch its data on mount, or I need to pass a refetch callback.
      // For simplicity, relying on re-mount if it's rendered conditionally, or a refresh effect.
    } catch (error) {
      toast.error('Failed to save entry');
    }
  };

  const handleCancelWriting = () => {
    setIsWriting(false);
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <AnimatePresence mode="wait">
        {isWriting ? (
          <JournalEditor onSave={handleSaveEntry} onCancel={handleCancelWriting} />
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PageHeader
              emoji="📖"
              title="Mindful Journal"
              subtitle="Reflect on your thoughts and feelings"
            />
            <RecentJournalEntries onStartWriting={() => setIsWriting(true)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JournalPage;