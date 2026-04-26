import { useState } from 'react';
import { Key, Plus, Trash2, Copy, Check, ShieldCheck, Clock } from 'lucide-react';

const APIKeysPage = () => {
  const [keys] = useState([
    { id: 1, name: 'Production Inference', prefix: 'gk_abc123', created: '2026-04-20', lastUsed: '2 minutes ago' },
    { id: 2, name: 'CI-CD-Bot', prefix: 'gk_xyz789', created: '2026-04-15', lastUsed: '1 hour ago' },
  ]);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (id: number) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-outfit tracking-tight">API Keys</h1>
          <p className="text-gray-500 mt-1">Manage secure keys for external integrations and CLI tools.</p>
        </div>
        <button 
          onClick={() => setShowNewKeyModal(true)}
          className="flex items-center gap-2 bg-[#76b900] hover:bg-[#86d200] text-black px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[#76b900]/20"
        >
          <Plus size={18} />
          Generate New Key
        </button>
      </div>

      <div className="bg-[#76b900]/5 border border-[#76b900]/20 rounded-2xl p-6 flex gap-4">
        <div className="w-12 h-12 bg-[#76b900]/20 rounded-xl flex items-center justify-center text-[#76b900]">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h4 className="font-bold text-[#76b900]">Security Note</h4>
          <p className="text-sm text-[#76b900]/70 max-w-2xl">
            API keys grant full programmatic access to your resources. Never share them or commit them to public repositories. 
            Rotate your keys regularly for better security.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {keys.map((key) => (
          <div key={key.id} className="bg-[#0d0d0f] border border-[#1e1e22] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/10 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-gray-400">
                <Key size={20} />
              </div>
              <div>
                <h3 className="font-bold">{key.name}</h3>
                <div className="text-xs font-mono text-gray-500 mt-1">{key.prefix}********************</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-8">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Created</div>
                <div className="text-sm flex items-center gap-2">
                  <Clock size={14} className="text-gray-600" />
                  {key.created}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Last Used</div>
                <div className="text-sm text-[#76b900]">{key.lastUsed}</div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleCopy(key.id)}
                  className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
                  title="Copy Key"
                >
                  {copiedId === key.id ? <Check size={18} className="text-[#76b900]" /> : <Copy size={18} />}
                </button>
                <button className="p-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-500 transition-all" title="Delete Key">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showNewKeyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d0d0f] border border-[#1e1e22] rounded-3xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold mb-2">Create API Key</h2>
            <p className="text-gray-500 text-sm mb-6">Give your key a descriptive name to track its usage.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Key Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. CI/CD Pipeline"
                  className="w-full bg-[#161618] border border-[#2a2a2e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#76b900]/50"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowNewKeyModal(false)}
                  className="flex-1 px-6 py-3 border border-[#1e1e22] rounded-xl font-bold hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowNewKeyModal(false)}
                  className="flex-1 px-6 py-3 bg-[#76b900] text-black rounded-xl font-bold hover:bg-[#86d200] transition-all"
                >
                  Create Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default APIKeysPage;
