import React, { useState, useEffect } from 'react';
import { CreditCard, TrendingUp, Download, PieChart, Clock, Zap, Loader2 } from 'lucide-react';
import { enterpriseApi } from '../api/enterprise';

const BillingPage = () => {
  const [usageData, setUsageData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>({ total_cost: 0, total_hours: 0, next_bill_estimate: 0 });

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const data = await enterpriseApi.getBillingUsage();
        setUsageData(data.projects);
        setSummary({
          total_cost: data.total_cost,
          total_hours: data.total_hours,
          next_bill_estimate: data.total_cost * 1.2 // Mocking pace estimation
        });
      } catch (error) {
        console.error('Error fetching billing data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBilling();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-outfit tracking-tight">Billing & Usage</h1>
          <p className="text-gray-500 mt-1">Track GPU consumption and manage enterprise billing.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 px-6 py-2.5 rounded-xl font-bold transition-all">
            <Download size={18} />
            Invoices
          </button>
          <button className="flex items-center gap-2 bg-[#76b900] hover:bg-[#86d200] text-black px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[#76b900]/20">
            <CreditCard size={18} />
            Payment Methods
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Current Month Cost" value={`$${summary.total_cost.toFixed(2)}`} icon={<TrendingUp size={20} />} trend="+12% from last month" color="#76b900" />
        <StatCard label="Compute Hours" value={`${summary.total_hours}h`} icon={<Clock size={20} />} trend="82% utilization" color="#3b82f6" />
        <StatCard label="Estimated Next Bill" value={`$${summary.next_bill_estimate.toFixed(2)}`} icon={<Zap size={20} />} trend="Based on current pace" color="#f59e0b" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#0d0d0f] border border-[#1e1e22] rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <PieChart className="text-gray-500" size={20} />
              Usage by Project
            </h3>
          </div>
          <div className="space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p>Loading usage data...</p>
              </div>
            ) : usageData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No usage recorded yet.</div>
            ) : (
              usageData.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-300">{item.project}</span>
                    <span className="font-bold">${item.cost.toFixed(2)}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#76b900] rounded-full transition-all duration-1000" 
                      style={{ width: `${(item.cost / (summary.total_cost || 1)) * 100}%` }} 
                    />
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest">{item.hours} hours consumed</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-[#0d0d0f] border border-[#1e1e22] rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-6">Payment Method</h3>
          <div className="bg-gradient-to-br from-[#1e1e22] to-[#0a0a0b] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#76b900]/10 rounded-full blur-3xl group-hover:bg-[#76b900]/20 transition-all duration-700" />
            <div className="flex justify-between items-start mb-12">
              <div className="w-12 h-8 bg-white/10 rounded-md" />
              <span className="text-sm font-medium text-gray-400">Primary Card</span>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-mono tracking-[0.2em]">**** **** **** 4242</div>
              <div className="flex justify-between items-end">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Expires 12/28</div>
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50" />
              </div>
            </div>
          </div>
          <button className="w-full mt-6 py-3 border border-[#1e1e22] rounded-xl text-sm font-bold hover:bg-white/5 transition-all">
            Update Billing Details
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, trend, color }: { label: string, value: string, icon: React.ReactElement, trend: string, color: string }) => (
  <div className="bg-[#0d0d0f] border border-[#1e1e22] rounded-2xl p-6 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 text-gray-800 opacity-10 group-hover:opacity-20 transition-all">
      {React.cloneElement(icon as React.ReactElement<any>, { size: 64 })}
    </div>
    <div className="flex items-center gap-3 text-gray-500 mb-4">
      <div className="p-2 bg-white/5 rounded-lg" style={{ color }}>
        {icon}
      </div>
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
    </div>
    <div className="text-3xl font-bold mb-2 font-outfit">{value}</div>
    <div className="text-[10px] font-bold text-[#76b900] uppercase tracking-tighter">{trend}</div>
  </div>
);

export default BillingPage;
