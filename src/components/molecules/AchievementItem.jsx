import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const AchievementItem = ({ iconName, iconColor, title, description }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className={`w-10 h-10 ${iconColor} rounded-full flex items-center justify-center`}>
        <ApperIcon name={iconName} className="text-white" size={20} />
      </div>
      <div>
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default AchievementItem;