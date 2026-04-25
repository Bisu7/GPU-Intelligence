import React from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Server, 
  Settings, 
  LogOut, 
  Cpu, 
  Bell, 
  Search,
  Brain
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../lib/utils';

const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#0a0a0b] text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#1e1e22] flex flex-col bg-[#0d0d0f]">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-[#76b900] rounded-lg flex items-center justify-center">
              <Cpu className="text-black" size={20} />
            </div>
            <span className="text-xl font-bold font-outfit tracking-tight">GPU Intel</span>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <SidebarItem to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <SidebarItem to="/fleet" icon={<Server size={18} />} label="GPU Fleet" />
          <SidebarItem to="/ai-insights" icon={<Brain size={18} />} label="AI Insights" />
          <SidebarItem to="/alerts" icon={<Bell size={18} />} label="Alert Center" />
          <SidebarItem to="/settings" icon={<Settings size={18} />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-[#1e1e22]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-[#1e1e22] flex items-center justify-between px-8 bg-[#0a0a0b]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-1.5 rounded-lg w-96">
            <Search size={16} className="text-gray-500" />
            <input 
              type="text" 
              placeholder="Search resources, nodes, or alerts..." 
              className="bg-transparent border-none text-sm focus:outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-gray-500 hover:text-white transition-all">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#76b900] rounded-full border-2 border-[#0a0a0b]" />
            </button>
            <div className="h-8 w-[1px] bg-[#1e1e22]" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-bold">{user?.full_name || 'Admin'}</div>
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{user?.role || 'Operator'}</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-[#76b900] to-[#a3e635] rounded-xl flex items-center justify-center font-bold text-black text-sm">
                {user?.full_name?.[0] || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
      isActive 
        ? "bg-[#76b900]/10 text-[#76b900] shadow-[inset_0_0_12px_rgba(118,185,0,0.05)]" 
        : "text-gray-500 hover:text-white hover:bg-white/5"
    )}
  >
    {icon}
    {label}
  </NavLink>
);

export default DashboardLayout;
