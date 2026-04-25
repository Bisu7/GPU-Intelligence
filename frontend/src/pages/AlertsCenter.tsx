import { useEffect, useState } from 'react';
import { CheckCircle, Clock, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../lib/utils';
import { API_BASE_URL } from '../api/config';

const AlertsCenter = () => {
  const token = useAuthStore((state: any) => state.token);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('unresolved');

  const fetchAlerts = async () => {
    try {
      const isResolved = filter === 'resolved';
      const response = await axios.get(`${API_BASE_URL}/api/v1/alerts/?is_resolved=${isResolved}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch alerts', err);
    }
  };

  const resolveAlert = async (id: number) => {
    try {
      await axios.post(`${API_BASE_URL}/api/v1/alerts/${id}/resolve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAlerts();
    } catch (err) {
      console.error('Failed to resolve alert', err);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [token, filter]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-outfit tracking-tight">Alerts Center</h1>
          <p className="text-gray-400">Manage and monitor system anomalies across your fleet.</p>
        </div>
        
        <div className="flex gap-2 bg-[#111114] p-1 rounded-xl border border-[#1e1e22]">
          <button 
            onClick={() => setFilter('unresolved')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all",
              filter === 'unresolved' ? "bg-[#76b900] text-black shadow-lg shadow-[#76b900]/10" : "text-gray-500 hover:text-white"
            )}
          >
            Unresolved
          </button>
          <button 
            onClick={() => setFilter('resolved')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all",
              filter === 'resolved' ? "bg-[#76b900] text-black shadow-lg shadow-[#76b900]/10" : "text-gray-500 hover:text-white"
            )}
          >
            Resolved
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20 text-gray-500 animate-pulse">Loading hardware alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-20 bg-[#111114] border border-[#1e1e22] rounded-xl">
            <CheckCircle size={48} className="mx-auto text-[#76b900] mb-4" />
            <h3 className="text-xl font-bold">All systems nominal</h3>
            <p className="text-gray-500">No {filter} alerts detected in the fleet.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <AlertItem key={alert.id} alert={alert} onResolve={resolveAlert} />
          ))
        )}
      </div>
    </div>
  );
};

const AlertItem = ({ alert, onResolve }: any) => {
  const severities: any = {
    critical: "border-red-500/20 bg-red-500/5 text-red-500",
    warning: "border-yellow-500/20 bg-yellow-500/5 text-yellow-400",
    info: "border-blue-500/20 bg-blue-500/5 text-blue-400",
  };

  return (
    <div className={cn(
      "p-6 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all hover:bg-white/[0.01]",
      severities[alert.severity] || "border-[#1e1e22] bg-[#111114]"
    )}>
      <div className="flex items-start gap-5">
        <div className="mt-1 p-2 bg-white/5 rounded-lg">
          <ShieldAlert size={24} />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-bold uppercase text-[10px] tracking-widest px-2 py-0.5 rounded bg-white/10 text-white">
              {alert.type}
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <Clock size={12} /> {new Date(alert.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">{alert.message}</h3>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Hardware Unit {alert.gpu_id} • System Node 1</p>
        </div>
      </div>
      
      {!alert.is_resolved && (
        <button 
          onClick={() => onResolve(alert.id)}
          className="bg-white/5 hover:bg-[#76b900] text-white hover:text-black px-6 py-2.5 rounded-lg text-sm font-bold transition-all border border-white/10"
        >
          Resolve Alert
        </button>
      )}
    </div>
  );
};

export default AlertsCenter;
