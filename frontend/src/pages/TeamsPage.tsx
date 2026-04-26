import { useState, useEffect } from 'react';
import { Users, UserPlus, MoreVertical, Search, Filter, Loader2 } from 'lucide-react';
import { enterpriseApi } from '../api/enterprise';

const TeamsPage = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await enterpriseApi.getTeams();
        setTeams(data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-outfit tracking-tight">Team Management</h1>
          <p className="text-gray-500 mt-1">Organize users and allocate GPU resources across your organization.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#76b900] hover:bg-[#86d200] text-black px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[#76b900]/20">
          <UserPlus size={18} />
          Create New Team
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search teams or members..." 
            className="w-full bg-[#0d0d0f] border border-[#1e1e22] rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#76b900]/50 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 bg-[#0d0d0f] border border-[#1e1e22] px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-all">
          <Filter size={18} />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 text-gray-500">
            <Loader2 className="animate-spin mb-4" size={48} />
            <p>Loading teams...</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 bg-[#0d0d0f] border border-[#1e1e22] rounded-3xl text-gray-500">
            <Users className="mb-4 opacity-20" size={64} />
            <p className="text-lg font-medium">No teams found</p>
            <p className="text-sm">Create your first team to start allocating resources.</p>
          </div>
        ) : (
          teams.map((team) => (
          <div key={team.id} className="bg-[#0d0d0f] border border-[#1e1e22] rounded-2xl p-6 hover:border-[#76b900]/30 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-[#76b900]/10 rounded-xl flex items-center justify-center text-[#76b900]">
                <Users size={24} />
              </div>
              <button className="text-gray-500 hover:text-white transition-all">
                <MoreVertical size={20} />
              </button>
            </div>
            
            <h3 className="text-lg font-bold mb-1">{team.name}</h3>
            <p className="text-sm text-gray-500 mb-6">Owner: {team.owner}</p>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#1e1e22]">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Members</div>
                <div className="text-lg font-bold">{team.members}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">GPU Nodes</div>
                <div className="text-lg font-bold text-[#76b900]">{team.gpus}</div>
              </div>
            </div>

            <button className="w-full mt-6 py-2.5 bg-white/5 hover:bg-[#76b900] hover:text-black rounded-xl text-sm font-bold transition-all">
              Manage Team
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamsPage;
