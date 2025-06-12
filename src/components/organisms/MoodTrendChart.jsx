import React from 'react';
import Chart from 'react-apexcharts';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const MoodTrendChart = ({ moodData, timeRange }) => {

  const getFilteredMoodData = () => {
    const now = new Date();
    const daysBack = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

    return moodData.filter(mood => new Date(mood.timestamp) >= startDate);
  };

  const getMoodChartData = () => {
    const filteredData = getFilteredMoodData();
    const sortedData = filteredData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return {
      series: [{
        name: 'Mood Score',
        data: sortedData.map(mood => ({
          x: new Date(mood.timestamp).getTime(),
          y: mood.moodScore
        }))
      }],
      options: {
        chart: {
          type: 'line',
          height: 300,
          toolbar: { show: false },
          zoom: { enabled: false }
        },
        stroke: {
          curve: 'smooth',
          width: 3,
          colors: ['#7C3AED']
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3,
            stops: [0, 100]
          }
        },
        grid: {
          borderColor: '#e2e8f0',
          strokeDashArray: 5
        },
        xaxis: {
          type: 'datetime',
          labels: {
            style: { colors: '#64748b', fontSize: '12px' }
          }
        },
        yaxis: {
          min: 1,
          max: 10,
          labels: {
            style: { colors: '#64748b', fontSize: '12px' }
          }
        },
        tooltip: {
          theme: 'light',
          x: { format: 'MMM dd, yyyy' }
        },
        colors: ['#7C3AED']
      }
    };
  };

  const chartData = getMoodChartData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Mood Trends</h2>
      {moodData.length > 0 ? (
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={300}
        />
      ) : (
        <div className="text-center py-12">
          <ApperIcon name="TrendingUp" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No mood data yet. Start tracking to see your trends!</p>
        </div>
      )}
    </motion.div>
  );
};

export default MoodTrendChart;