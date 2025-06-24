import React, { useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../../types';
import { ThemeContext } from '../../contexts/ThemeContext';

interface SimpleBarChartProps {
  data: ChartDataPoint[];
  title?: string;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data, title }) => {
  const { selectedTheme: theme } = useContext(ThemeContext);
  
  const tickColor = theme === 'dark' || theme === 'high-contrast' ? '#CBD5E1' : '#6B7280'; // gray-400 or gray-500
  const gridStrokeColor = theme === 'dark' || theme === 'high-contrast' ? '#4B5563' : '#E5E7EB'; // gray-600 or gray-200
  const legendColor = theme === 'dark' || theme === 'high-contrast' ? '#F3F4F6' : '#374151'; // gray-100 or gray-700
  const titleColor = theme === 'dark' || theme === 'high-contrast' ? 'text-gray-100 hc-text-primary' : 'text-gray-700 hc-text-primary';

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow h-80 hc-bg-secondary hc-border-primary border">
      {title && <h3 className={`text-lg font-semibold ${titleColor} mb-4`}>{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: -20, 
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
          <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 12 }} />
          <YAxis tick={{ fill: tickColor, fontSize: 12 }} />
          <Tooltip 
            cursor={{fill: theme === 'dark' || theme === 'high-contrast' ? 'rgba(107, 114, 128, 0.3)' : 'rgba(209, 213, 219, 0.3)'}}
            contentStyle={{ 
                backgroundColor: theme === 'dark' || theme === 'high-contrast' ? '#1F2937' : '#FFFFFF', // gray-800 or white
                borderColor: theme === 'dark' || theme === 'high-contrast' ? '#4B5563' : '#E5E7EB', // gray-600 or gray-200
                borderRadius: '0.375rem',
                color: legendColor
            }}
            labelStyle={{color: legendColor, fontWeight: 'bold'}}
          />
          <Legend wrapperStyle={{ color: legendColor, fontSize: '12px' }}/>
          <Bar dataKey="value" fill={ theme === 'high-contrast' ? 'var(--hc-accent-primary)' : '#2563EB' } /> 
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleBarChart;