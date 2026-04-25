import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface LoadPredictionChartProps {
  currentLoad: number;
  predictions: {
    '5m': number;
    '15m': number;
    '1h': number;
  };
}

const LoadPredictionChart: React.FC<LoadPredictionChartProps> = ({ currentLoad, predictions }) => {
  // Construct data for the chart
  const data = [
    { time: '-5m', load: currentLoad - 2, type: 'actual' },
    { time: 'Now', load: currentLoad, type: 'actual' },
    { time: '+5m', load: predictions['5m'], type: 'predicted' },
    { time: '+15m', load: predictions['15m'], type: 'predicted' },
    { time: '+1h', load: predictions['1h'], type: 'predicted' },
  ];

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#76b900" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#76b900" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e22" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#4b5563" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="#4b5563" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            domain={[0, 100]}
            unit="%"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#111114', 
              border: '1px solid #1e1e22',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            itemStyle={{ color: '#fff' }}
          />
          <ReferenceLine x="Now" stroke="#fff" strokeDasharray="3 3" label={{ value: 'NOW', fill: '#9ca3af', fontSize: 10, position: 'top' }} />
          
          <Area
            type="monotone"
            dataKey="load"
            stroke="#76b900"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorActual)"
            data={data.filter(d => d.type === 'actual' || d.time === 'Now')}
            isAnimationActive={true}
          />
          <Area
            type="monotone"
            dataKey="load"
            stroke="#3b82f6"
            strokeWidth={3}
            strokeDasharray="5 5"
            fillOpacity={1}
            fill="url(#colorPredicted)"
            data={data.filter(d => d.type === 'predicted' || d.time === 'Now')}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LoadPredictionChart;
