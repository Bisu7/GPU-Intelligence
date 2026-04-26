import React from 'react';
import { ClipboardList, Search, Download, Clock, User, Activity } from 'lucide-react';

const AuditLogsPage = () => {
  const logs = [
    { id: 1, action: 'login', user: 'biswa@example.com', details: 'Successful login from 192.168.1.1', timestamp: '2026-04-26 15:10:22' },
    { id: 2, action: 'config_change', user: 'admin@gpuintel.ai', details: 'Updated rate limiting threshold to 500', timestamp: '2026-04-26 14:45:10' },
    { id: 3, action: 'role_change', user: 'admin@gpuintel.ai', details: 'Changed Sarah Chen role to Team Lead', timestamp: '2026-04-26 12:30:05' },
    { id: 4, action: 'scheduler_action', user: 'system', details: 'Auto-scaled Cluster-East (+2 nodes)', timestamp: '2026-04-26 10:15:44' },
    { id: 5, action: 'apikey_create', user: 'james@dev.ai', details: 'Created new API key: CI-CD-Inference', timestamp: '2026-04-26 09:00:12' },
  ];

  const getActionStyle = (action) => {
    switch(action) {
      case 'login': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'config_change': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'role_change': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'scheduler_action': return 'text-[#76b900] bg-[#76b900]/10 border-[#76b900]/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-outfit tracking-tight">Audit Logs</h1>
          <p className="text-gray-500 mt-1">Full traceability of all system actions and configuration changes.</p>
        </div>
        <button className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 px-6 py-2.5 rounded-xl font-bold transition-all">
          <Download size={18} />
          Export Logs
        </button>
      </div>

      <div className="bg-[#0d0d0f] border border-[#1e1e22] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-[#1e1e22] flex items-center justify-between bg-[#161618]/30">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search logs by user, action or details..." 
              className="w-full bg-transparent border-none pl-12 pr-4 py-2 text-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#1e1e22] text-gray-500 font-medium">
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e22]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getActionStyle(log.action)}`}>
                      {log.action.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-gray-500" />
                      {log.user}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {log.details}
                  </td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      {log.timestamp}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-[#1e1e22] flex items-center justify-between text-xs text-gray-500">
          <div>Showing 5 of 1,240 events</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-[#1e1e22] rounded hover:bg-white/5 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 border border-[#1e1e22] rounded hover:bg-white/5">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogsPage;
