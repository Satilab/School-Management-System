import React, { useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../../types';
import { ThemeContext } from '../../contexts/ThemeContext';

interface SimpleLineChartProps {
  data: ChartDataPoint[]; 
  title?: string;
  xAxisKey?: string; 
  dataKey: string; 
  lineColor?: string;
  height?: number;
}

const SimpleLineChart: React.FC<SimpleLineChartProps> = ({ 
    data, 
    title, 
    xAxisKey = "name", 
    dataKey, 
    lineColor: initialLineColor = "#2563EB", 
    height = 250 
}) => {
  const { selectedTheme: theme } = useContext(ThemeContext);

  const tickColor = theme === 'dark' || theme === 'high-contrast' ? '#CBD5E1' : '#6B7280'; // gray-400 or gray-500
  const gridStrokeColor = theme === 'dark' || theme === 'high-contrast' ? '#4B5563' : '#E5E7EB'; // gray-600 or gray-200
  const legendColor = theme === 'dark' || theme === 'high-contrast' ? '#F3F4F6' : '#374151'; // gray-100 or gray-700
  const titleColor = theme === 'dark' || theme === 'high-contrast' ? 'text-gray-100 hc-text-primary' : 'text-gray-700 hc-text-primary';
  const lineColor = theme === 'high-contrast' ? 'var(--hc-accent-primary)' : initialLineColor;


  if (!data || data.length === 0) {
    return (
        <div style={{ height: `${height}px` }} className="flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-md p-4 hc-bg-secondary">
            <p className={`text-sm text-gray-500 dark:text-gray-400 hc-text-secondary`}>{title ? `${title}: ` : ''}No data available for chart.</p>
        </div>
    );
  }
  return (
    <div style={{ height: `${height}px` }} className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm hc-bg-secondary hc-border-primary border">
      {title && <h3 className={`text-md font-semibold ${titleColor} mb-2 ml-2`}>{title}</h3>}
      <ResponsiveContainer width="100%" height={title ? "calc(100% - 30px)" : "100%"}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -20, 
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
          <XAxis dataKey={xAxisKey} tick={{ fontSize: 10, fill: tickColor }} />
          <YAxis tick={{ fontSize: 10, fill: tickColor }} domain={['dataMin - 10', 'dataMax + 10']} allowDataOverflow={true} />
          <Tooltip 
            contentStyle={{ 
                backgroundColor: theme === 'dark' || theme === 'high-contrast' ? '#1F2937' : '#FFFFFF', 
                borderColor: theme === 'dark' || theme === 'high-contrast' ? '#4B5563' : '#E5E7EB', 
                borderRadius: '0.5rem', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
            itemStyle={{ color: lineColor }} // Tooltip text for the line item
            labelStyle={{ color: legendColor, fontWeight: 'bold' }} // Tooltip X-axis label
          />
          <Legend wrapperStyle={{fontSize: "12px", color: legendColor}} />
          <Line type="monotone" dataKey={dataKey} stroke={lineColor} strokeWidth={2} activeDot={{ r: 6, fill: lineColor }} dot={{r: 3, fill: lineColor}}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleLineChart;