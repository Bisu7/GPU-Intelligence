import { useEffect, useState } from 'react';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  Activity,
  RefreshCw,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../api/config';
import LoadPredictionChart from '../components/LoadPredictionChart';

const AIInsights = () => {
  const token = useAuthStore((state: any) => state.token);
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState<any>([]);
  const [recommendations, setRecommendations] = useState<any>([]);
  const [schedulerRec, setSchedulerRec] = useState<any>(null);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch live metrics first to get GPU list
      const metricsRes = await axios.get(`${API_BASE_URL}/api/v1/metrics/live`, { headers });
      const gpus = metricsRes.data;

      // Fetch predictions for each GPU
      const predPromises = gpus.map((gpu: any) => 
        axios.get(`${API_BASE_URL}/api/v1/prediction/load/${gpu.gpu_index}`, { headers })
          .then(res => ({ ...res.data, current_load: gpu.utilization, name: gpu.name }))
      );

      // Fetch optimizer recommendations
      const recsRes = axios.get(`${API_BASE_URL}/api/v1/optimizer/recommendations`, { headers });
      
      // Fetch scheduler recommendation (default 4GB VRAM requirement)
      const schedRes = axios.post(`${API_BASE_URL}/api/v1/scheduler/recommend`, { min_vram_mb: 4096 }, { headers });

      const [predResults, recsResults, schedResults] = await Promise.all([
        Promise.all(predPromises),
        recsRes,
        schedRes
      ]);

      setPredictions(predResults);
      setRecommendations(recsResults.data);
      setSchedulerRec(schedResults.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch AI insights', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="relative">
          <Brain className="text-[#76b900] animate-pulse" size={64} />
          <div className="absolute inset-0 bg-[#76b900]/20 blur-xl rounded-full animate-pulse" />
        </div>
        <div className="text-xl font-bold font-outfit">AI Intelligence Engine Initializing...</div>
        <div className="text-sm text-gray-500">Processing real-time telemetry & training models</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-outfit mb-2 flex items-center gap-3">
            <Brain className="text-[#76b900]" />
            AI Intelligence Dashboard
          </h1>
          <p className="text-gray-400">Predictive analytics and smart infrastructure optimization.</p>
        </div>
        <button 
          onClick={fetchData}
          className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-gray-400 hover:text-white"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Predictions Section */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold font-outfit flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-500" />
            Load Forecasting
          </h2>
          
          <div className="grid grid-cols-1 gap-6">
            {predictions.map((pred: any) => (
              <div key={pred.gpu_id} className="bg-[#111114] border border-[#1e1e22] p-6 rounded-2xl hover:border-blue-500/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{pred.name}</h3>
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Prediction Confidence: {Math.round(pred.prediction.confidence * 100)}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">Forecasted Monthly Cost</div>
                    <div className="text-xl font-bold text-[#76b900] flex items-center gap-1 justify-end">
                      <DollarSign size={16} />
                      {pred.monthly_cost_forecast}
                    </div>
                  </div>
                </div>
                
                <LoadPredictionChart 
                  currentLoad={pred.current_load} 
                  predictions={pred.prediction} 
                />
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <PredictionMetric label="Next 5m" value={`${Math.round(pred.prediction['5m'])}%`} />
                  <PredictionMetric label="Next 15m" value={`${Math.round(pred.prediction['15m'])}%`} />
                  <PredictionMetric label="Next 1h" value={`${Math.round(pred.prediction['1h'])}%`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-8">
          {/* Smart Scheduler */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-outfit flex items-center gap-2">
              <Zap size={20} className="text-yellow-500" />
              Smart Scheduler
            </h2>
            <div className="bg-gradient-to-br from-[#111114] to-[#1a1a1e] border border-yellow-500/20 p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all">
                <Zap size={80} />
              </div>
              <div className="relative z-10">
                <div className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-4">Recommended for Next Job</div>
                {schedulerRec?.status === 'success' ? (
                  <>
                    <div className="text-2xl font-bold mb-2">{schedulerRec.recommended_gpu}</div>
                    <p className="text-sm text-gray-400 mb-6">{schedulerRec.reason}</p>
                    <button className="w-full py-3 bg-yellow-500 text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 transition-all">
                      Assign Workload
                      <ChevronRight size={18} />
                    </button>
                  </>
                ) : (
                  <div className="text-gray-500 italic">No recommendations available</div>
                )}
              </div>
            </div>
          </div>

          {/* Optimization Actions */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-outfit flex items-center gap-2">
              <ShieldCheck size={20} className="text-[#76b900]" />
              AI Recommendations
            </h2>
            <div className="space-y-3">
              <AnimatePresence>
                {recommendations.map((rec: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#111114] border border-[#1e1e22] p-4 rounded-xl hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg mt-1 ${
                        rec.severity === 'critical' ? 'bg-red-500/10 text-red-500' :
                        rec.severity === 'high' ? 'bg-orange-500/10 text-orange-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        {rec.type === 'THERMAL' ? <AlertTriangle size={18} /> : 
                         rec.type === 'POWER_SAVING' ? <Zap size={18} /> : 
                         <Activity size={18} />}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold mb-1">{rec.message}</div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">{rec.action}</span>
                          <button className="text-[10px] font-bold text-[#76b900] hover:underline opacity-0 group-hover:opacity-100 transition-all uppercase tracking-tighter">
                            Apply Fix
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PredictionMetric = ({ label, value }: { label: string, value: string }) => (
  <div className="bg-white/5 border border-white/5 p-3 rounded-xl text-center">
    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-lg font-bold font-outfit">{value}</div>
  </div>
);

export default AIInsights;
