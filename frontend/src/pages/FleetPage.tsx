import { useEffect, useState } from 'react';
import { Search, Filter, Server, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../api/config';

const FleetPage = () => {
  const token = useAuthStore((state: any) => state.token);
  const [gpus, setGpus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchGpus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/metrics/live`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGpus(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch GPU fleet', err);
    }
  };

  useEffect(() => {
    fetchGpus();
    const interval = setInterval(fetchGpus, 5000);
    return () => clearInterval(interval);
  }, [token]);

  const filteredGpus = gpus.filter(gpu => 
    gpu.name.toLowerCase().includes(search.toLowerCase()) || 
    gpu.gpu_index.toString().includes(search)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-outfit">GPU Fleet</h1>
          <p className="text-gray-400">Total {gpus.length} GPUs across 1 compute node.</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or index..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <button className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse border border-white/5" />)
        ) : filteredGpus.map((gpu, idx) => (
          <FleetCard key={idx} gpu={gpu} />
        ))}
      </div>
    </div>
  );
};

const FleetCard = ({ gpu }: any) => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-[#111114] border border-[#1e1e22] p-6 rounded-xl hover:border-[#76b900]/30 transition-all group shadow-sm"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/5 rounded-xl text-[#76b900]">
          <Server size={24} />
        </div>
        <div className={cn(
          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest",
          gpu.utilization > 80 ? "bg-red-500/10 text-red-500" : "bg-[#76b900]/10 text-[#76b900]"
        )}>
          {gpu.utilization > 80 ? "Heavy Load" : "Healthy"}
        </div>
      </div>
      
      <h3 className="text-lg font-bold font-outfit mb-1">{gpu.name}</h3>
      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-6">Index {gpu.gpu_index} • Node 1</p>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-1">
          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Utilization</div>
          <div className="text-xl font-bold">{Math.round(gpu.utilization)}%</div>
        </div>
        <div className="space-y-1">
          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Temp</div>
          <div className="text-xl font-bold">{Math.round(gpu.temp)}°C</div>
        </div>
      </div>

      <Link 
        to={`/gpus/${gpu.gpu_index}`}
        className="w-full flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-[#76b900] rounded-lg text-sm font-bold transition-all group-hover:text-black"
      >
        Deep Analytics <ArrowRight size={16} />
      </Link>
    </motion.div>
  );
};

const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

export default FleetPage;
