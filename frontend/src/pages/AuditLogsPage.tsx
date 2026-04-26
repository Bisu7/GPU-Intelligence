import { useState, useEffect } from 'react';
import { Search, Download, Clock, User, Loader2 } from 'lucide-react';
import { enterpriseApi } from '../api/enterprise';

const AuditLogsPage = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await enterpriseApi.getAuditLogs();
        setLogs(data);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getActionStyle = (action: string) => {
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
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-24 text-center text-gray-500">
                    <Loader2 className="animate-spin mx-auto mb-4" size={32} />
                    Loading audit logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-24 text-center text-gray-500">
                    No logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getActionStyle(log.action)}`}>
                        {log.action.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-gray-500" />
                        {log.user_id || 'system'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {log.details}
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
