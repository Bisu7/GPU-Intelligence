import { useEffect, useState } from 'react';
import { 
  Activity, 
  Cpu, 
  Thermometer, 
  Zap, 
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useMetricsStore } from '../store/useMetricsStore';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../api/config';

const Dashboard = () => {
  const token = useAuthStore((state: any) => state.token);
  const { liveMetrics, summary, setLiveMetrics, setSummary } = useMetricsStore();
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [metricsRes, summaryRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/v1/metrics/live`, { headers }),
        axios.get(`${API_BASE_URL}/api/v1/metrics/summary`, { headers })
      ]);
      
      setLiveMetrics(metricsRes.data);
      setSummary(summaryRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch metrics', err);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, [token]);

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center h-full">
        <Activity className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold font-outfit mb-2">System Overview</h1>
        <p className="text-gray-400">Real-time health monitoring for your GPU cluster.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          title="Total GPUs" 
          value={summary?.total_gpus || 0} 
          icon={<Cpu size={24} />} 
          color="blue"
        />
        <SummaryCard 
          title="Avg Utilization" 
          value={`${summary?.avg_utilization || 0}%`} 
          icon={<Activity size={24} />} 
          color="green"
          trend="+2.4%"
        />
        <SummaryCard 
          title="Avg Temperature" 
          value={`${summary?.avg_temp || 0}°C`} 
          icon={<Thermometer size={24} />} 
          color="red"
          trend="-1.2%"
          trendDown
        />
        <SummaryCard 
          title="Total Power" 
          value="450W" 
          icon={<Zap size={24} />} 
          color="yellow"
        />
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xl font-bold font-outfit">Active GPUs</h2>
            <p className="text-sm text-gray-500">Live performance metrics for each hardware unit.</p>
          </div>
          <Link to="/fleet" className="text-[#76b900] text-sm font-semibold hover:underline">View Fleet Details</Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {liveMetrics.map((gpu, idx) => (
            <GPUMetricCard key={idx} gpu={gpu} />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold font-outfit">Recent Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AlertSmall type="Critical" message="GPU 0: Temp > 80°C" time="2m ago" severity="red" />
          <AlertSmall type="Warning" message="GPU 1: Memory > 90%" time="15m ago" severity="yellow" />
          <AlertSmall type="Info" message="System: Driver updated" time="1h ago" severity="blue" />
        </div>
      </div>
    </div>
  );
};

const AlertSmall = ({ type, message, time, severity }: any) => {
  const colors: any = {
    red: "text-red-500 bg-red-500/10 border-red-500/20",
    yellow: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  };

  return (
    <div className="bg-[#111114] border border-[#1e1e22] p-4 rounded-xl flex items-center justify-between hover:border-white/10 transition-all">
      <div className="flex items-center gap-4">
        <div className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", colors[severity])}>
          {type}
        </div>
        <div className="text-sm font-medium">{message}</div>
      </div>
      <div className="text-[10px] text-gray-500">{time}</div>
    </div>
  );
};

const MetricSmall = ({ label, value, progress, color = "green" }: any) => {
  const colors: any = {
    green: "bg-[#76b900]",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
  };

  return (
    <div className="space-y-1">
      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</div>
      <div className="text-base font-bold">{value}</div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className={cn("h-full transition-all duration-700", colors[color] || colors.green)} 
        />
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon, color, trend, trendDown }: any) => {
  const colors: any = {
    blue: "text-blue-500",
    green: "text-[#76b900]",
    red: "text-red-500",
    yellow: "text-yellow-500",
  };

  return (
    <div className="bg-[#111114] border border-[#1e1e22] p-6 rounded-xl relative overflow-hidden group hover:border-[#76b900]/30 transition-all">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{title}</div>
          <div className="text-3xl font-bold font-outfit">{value}</div>
        </div>
        <div className={cn("p-2 bg-white/5 rounded-lg", colors[color])}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className={cn(
          "mt-4 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded",
          trendDown ? "bg-red-500/10 text-red-500" : "bg-[#76b900]/10 text-[#76b900]"
        )}>
          {trendDown ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
          {trend}
        </div>
      )}
    </div>
  );
};

const GPUMetricCard = ({ gpu }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[#111114] border border-[#1e1e22] p-4 rounded-xl flex flex-col md:flex-row items-center gap-6 hover:border-[#76b900]/20 transition-all"
    >
      <div className="flex items-center gap-4 min-w-[280px]">
        <div className="p-3 bg-white/5 rounded-xl text-[#76b900]">
          <Cpu size={24} />
        </div>
        <div>
          <div className="font-bold text-sm">{gpu.name}</div>
          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#76b900]" />
            GPU {gpu.gpu_index} • Online
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1 w-full">
        <MetricSmall label="Utilization" value={`${Math.round(gpu.utilization)}%`} progress={gpu.utilization} />
        <MetricSmall label="VRAM" value={`${Math.round(gpu.memory_used)} MB`} progress={(gpu.memory_used / gpu.memory_total) * 100} />
        <MetricSmall label="Temp" value={`${gpu.temp.toFixed(2)}°C`} progress={(gpu.temp / 100) * 100} color="red" />
        <MetricSmall label="Power" value={`${gpu.power_draw.toFixed(2)}W`} progress={(gpu.power_draw / 450) * 100} color="yellow" />
      </div>
      
      <Link 
        to={`/gpus/${gpu.gpu_index}`}
        className="p-2 hover:bg-white/5 rounded-lg transition-all text-gray-500 hover:text-white"
      >
        <ArrowUpRight size={20} />
      </Link>
    </motion.div>
  );
};


const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

export default Dashboard;
