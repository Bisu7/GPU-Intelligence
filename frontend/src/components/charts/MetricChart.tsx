import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface MetricChartProps {
  data: any[];
  dataKey: string;
  color: string;
  title: string;
  unit?: string;
}

const MetricChart = ({ data, dataKey, color, title, unit = "" }: MetricChartProps) => {
  return (
    <div className="bg-[#111114] border border-[#1e1e22] p-6 rounded-xl w-full h-[300px] flex flex-col group hover:border-white/10 transition-all">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">{title}</h3>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
            <XAxis 
              dataKey="timestamp" 
              hide 
            />
            <YAxis 
              stroke="#4b5563" 
              fontSize={10} 
              tickFormatter={(val) => `${val}${unit}`}
              axisLine={false}
              tickLine={false}
              width={35}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0d0d0f', border: '1px solid #1e1e22', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: color, fontWeight: 'bold' }}
              labelStyle={{ display: 'none' }}
              cursor={{ stroke: '#ffffff10', strokeWidth: 1 }}
            />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              fillOpacity={1} 
              fill={`url(#color${dataKey})`} 
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricChart;
