import React from 'react';
import { Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6 selection:bg-[#76b900]/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#76b900]/5 blur-[150px] rounded-full" />
      </div>
      
      <div className="w-full max-w-md relative">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
            <div className="bg-[#76b900] p-2 rounded-lg shadow-[0_0_20px_rgba(118,185,0,0.2)] group-hover:scale-105 transition-all">
              <Cpu size={24} className="text-black" />
            </div>
            <span className="text-2xl font-black font-outfit text-white tracking-tighter uppercase">GPU Intel</span>
          </Link>
          <h1 className="text-3xl font-black font-outfit text-white mb-2 tracking-tight uppercase">
            {title}
          </h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">{subtitle}</p>
        </div>
        
        <div className="bg-[#111114] p-8 rounded-xl border border-[#1e1e22] shadow-2xl shadow-black/50">
          {children}
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">
            Enterprise Cloud Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
