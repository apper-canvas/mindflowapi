import React from 'react';
import PageHeader from '@/components/molecules/PageHeader';
import ProgressDashboard from '@/components/organisms/ProgressDashboard';

const ProgressPage = () => {
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <div className="p-6">
        <PageHeader
          emoji="📊"
          title="Your Progress"
          subtitle="Track your wellness journey"
        />
        <ProgressDashboard />
      </div>
    </div>
  );
};

export default ProgressPage;