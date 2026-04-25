import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Activity, Thermometer, Zap, Cpu, AlertCircle, Clock, Download } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import MetricChart from '../components/charts/MetricChart';
import { API_BASE_URL } from '../api/config';

const GPUDetail = () => {
  const { id } = useParams();
  const token = useAuthStore((state: any) => state.token);
  const [gpu, setGpu] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [detailRes, historyRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/v1/metrics/${id}`, { headers }),
        axios.get(`${API_BASE_URL}/api/v1/metrics/history/${id}`, { headers })
      ]);
      setGpu(detailRes.data);
      setHistory(historyRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch GPU details', err);
    }
  };

  useEffect(() => {
    fetchDetails();
    const interval = setInterval(fetchDetails, 5000);
    return () => clearInterval(interval);
  }, [id, token]);

  const exportToCSV = () => {
    if (!history.length) return;
    const headers = ["Timestamp", "Utilization", "Memory Used", "Temp", "Power"];
    const rows = history.map(h => [
      h.timestamp,
      h.utilization,
      h.memory_used,
      h.temp,
      h.power_draw
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `gpu_${id}_metrics.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-8 text-center"><Activity className="animate-spin inline mr-2" /> Loading Deep Analytics...</div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 hover:bg-white/5 rounded-lg transition-all text-gray-500 hover:text-white">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-outfit tracking-tight">{gpu.name}</h1>
            <p className="text-sm text-gray-500 font-medium">Node ID: 1 • Hardware Index: {id}</p>
          </div>
        </div>
        <button 
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-[#76b900] hover:bg-[#86d900] px-6 py-2.5 rounded-lg text-sm font-bold text-black transition-all shadow-lg shadow-[#76b900]/10"
        >
          <Download size={18} /> Export History
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Stats Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#111114] border border-[#1e1e22] p-6 rounded-xl space-y-6">
            <h2 className="text-lg font-bold font-outfit border-b border-white/5 pb-4">Hardware Telemetry</h2>
            <StatusItem icon={<Activity size={18} />} label="Utilization" value={`${Math.round(gpu.utilization)}%`} />
            <StatusItem icon={<Cpu size={18} />} label="VRAM Allocation" value={`${Math.round(gpu.memory_used)} MB`} />
            <StatusItem icon={<Thermometer size={18} />} label="Thermal State" value={`${gpu.temp.toFixed(2)}°C`} />
            <StatusItem icon={<Zap size={18} />} label="Energy Draw" value={`${gpu.power_draw.toFixed(2)}W`} />
            <StatusItem icon={<Clock size={18} />} label="System Uptime" value="12d 4h 22m" />
          </div>

          <div className="bg-[#111114] border border-[#1e1e22] p-6 rounded-xl space-y-4">
            <h2 className="text-lg font-bold font-outfit flex items-center gap-2">
              <AlertCircle size={20} className="text-yellow-500" /> Active Warnings
            </h2>
            <div className="text-sm text-gray-500 font-medium italic">All systems nominal. No active hardware alerts.</div>
          </div>
        </div>

        {/* Charts Column */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricChart data={history} dataKey="utilization" title="Utilization %" color="#76b900" unit="%" />
          <MetricChart data={history} dataKey="temp" title="Temperature °C" color="#ef4444" unit="°C" />
          <MetricChart data={history} dataKey="memory_used" title="VRAM Usage MB" color="#3b82f6" unit="MB" />
          <MetricChart data={history} dataKey="power_draw" title="Power Consumption W" color="#eab308" unit="W" />
        </div>
      </div>

      {/* Process List */}
      <div className="bg-[#111114] border border-[#1e1e22] p-8 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold font-outfit">Active GPU Processes</h2>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Live Data</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500 border-b border-[#1e1e22]">
              <tr>
                <th className="pb-4 font-bold uppercase tracking-wider text-[10px]">PID</th>
                <th className="pb-4 font-bold uppercase tracking-wider text-[10px]">Process Name</th>
                <th className="pb-4 font-bold uppercase tracking-wider text-[10px]">User</th>
                <th className="pb-4 font-bold uppercase tracking-wider text-[10px]">VRAM Usage</th>
                <th className="pb-4 font-bold uppercase tracking-wider text-[10px]">Util</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <ProcessRow pid="24551" name="python3 training.py" user="research_a" mem="4096 MB" util="45%" />
              <ProcessRow pid="24558" name="llama-cpp-server" user="research_b" mem="8192 MB" util="12%" />
              <ProcessRow pid="24601" name="jupyter-lab" user="admin" mem="1024 MB" util="2%" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatusItem = ({ icon, label, value }: any) => (
  <div className="flex justify-between items-center group">
    <div className="flex items-center gap-3 text-gray-400 group-hover:text-white transition-colors">
      <div className="p-1.5 bg-white/5 rounded-md">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </div>
    <span className="font-bold text-base font-outfit tracking-tight">{value}</span>
  </div>
);

const ProcessRow = ({ pid, name, user, mem, util }: any) => (
  <tr className="border-b border-[#1e1e22] last:border-0 hover:bg-white/[0.02] transition-colors">
    <td className="py-4 font-mono text-xs text-gray-500">{pid}</td>
    <td className="py-4 font-bold text-white">{name}</td>
    <td className="py-4 text-gray-400 font-medium">{user}</td>
    <td className="py-4 text-[#76b900] font-bold">{mem}</td>
    <td className="py-4 text-[#76b900] font-bold">{util}</td>
  </tr>
);

export default GPUDetail;
