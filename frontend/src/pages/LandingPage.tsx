import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, BarChart3, Shield, ArrowRight, Activity, Database, Cloud } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white selection:bg-[#76b900]/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0b]/80 backdrop-blur-md border-b border-[#1e1e22] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#76b900] p-1.5 rounded-lg shadow-[0_0_20px_rgba(118,185,0,0.2)]">
              <Cpu size={22} className="text-black" />
            </div>
            <span className="text-xl font-bold font-outfit tracking-tight">GPU Intel</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-500">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-white transition-colors">Enterprise</a>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="bg-[#76b900] hover:bg-[#86d900] text-black px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-[#76b900]/10">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full bg-[#76b900]/5 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-8 text-[10px] font-bold tracking-[0.2em] text-[#76b900] uppercase bg-[#76b900]/10 rounded-full border border-[#76b900]/20">
              Next-Gen GPU Orchestration
            </span>
            <h1 className="text-6xl md:text-8xl font-black font-outfit mb-8 leading-[0.9] tracking-tighter">
              MAXIMIZE YOUR <br /> 
              <span className="text-gray-500">AI COMPUTE</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-12 leading-relaxed font-medium">
              Enterprise-grade monitoring, predictive optimization, and intelligent load balancing for high-performance GPU clusters.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto bg-white text-black px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:bg-gray-200 group">
                Deploy Platform <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto bg-[#111114] border border-[#1e1e22] text-white px-10 py-4 rounded-xl font-bold transition-all hover:bg-white/5">
                Book Enterprise Demo
              </button>
            </div>
          </motion.div>

          {/* Hero Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-24 relative mx-auto max-w-5xl group"
          >
            <div className="rounded-2xl border border-[#1e1e22] bg-[#0d0d0f] shadow-2xl overflow-hidden p-1 shadow-[#000000]/50">
              <div className="bg-[#111114] rounded-xl p-4">
                <div className="flex items-center justify-between mb-6 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1e1e22]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1e1e22]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1e1e22]" />
                  </div>
                  <div className="h-4 w-40 bg-white/5 rounded-full" />
                  <div className="w-8 h-8 rounded-full bg-white/5" />
                </div>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-28 bg-white/5 rounded-xl border border-white/[0.02]" />
                  ))}
                </div>
                <div className="h-72 bg-white/5 rounded-xl border border-white/[0.02]" />
              </div>
            </div>
            {/* Accents */}
            <div className="absolute -top-12 -right-12 bg-[#76b900]/10 backdrop-blur-xl border border-[#76b900]/20 p-6 rounded-2xl hidden lg:block rotate-3 shadow-2xl">
              <Activity size={24} className="text-[#76b900] mb-3" />
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Efficiency</div>
              <div className="text-2xl font-black font-outfit text-white">99.8%</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 border-t border-[#1e1e22]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black font-outfit mb-6 tracking-tighter">BUILT FOR <br />HARDWARE SCALE.</h2>
              <p className="text-gray-500 text-lg font-medium">
                Unified orchestration for thousands of GPU units across hybrid, cloud, and edge infrastructure.
              </p>
            </div>
            <div className="text-[#76b900] font-bold text-sm uppercase tracking-[0.3em]">Core Technologies</div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Zap className="text-[#76b900]" />}
              title="Real-time Telemetry"
              description="Sub-second collection of thermal, power, and VRAM fragmentation data."
            />
            <FeatureCard 
              icon={<Shield className="text-red-500" />}
              title="Fault Isolation"
              description="Automated job migration and fault containment for hardware failures."
            />
            <FeatureCard 
              icon={<BarChart3 className="text-blue-500" />}
              title="Compute Economics"
              description="Granular TCO analysis and automated idle resource recovery."
            />
            <FeatureCard 
              icon={<Activity className="text-purple-500" />}
              title="Smart Scheduling"
              description="Topology-aware workload distribution for multi-GPU training jobs."
            />
            <FeatureCard 
              icon={<Database className="text-white" />}
              title="Data Lake Storage"
              description="Long-term persistence for hardware health and utilization trends."
            />
            <FeatureCard 
              icon={<Cloud className="text-cyan-500" />}
              title="Global Orchestrator"
              description="Unified control plane for AWS, GCP, Azure, and bare-metal."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#76b900] p-16 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-[80px] group-hover:bg-white/30 transition-all duration-700" />
          
          <h2 className="text-4xl md:text-6xl font-black font-outfit mb-8 relative z-10 text-black tracking-tighter">UNLEASH THE POWER.</h2>
          <p className="text-black/70 mb-12 max-w-xl mx-auto relative z-10 text-xl font-bold">
            Join the enterprise teams redefining AI infrastructure with GPU Intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <button className="bg-black text-white px-12 py-4 rounded-xl font-bold hover:bg-gray-900 transition-all shadow-2xl">
              Start Building Now
            </button>
            <button className="bg-transparent border-2 border-black text-black px-12 py-4 rounded-xl font-bold hover:bg-black hover:text-white transition-all">
              Talk to Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e1e22] py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-[#76b900] p-1.5 rounded-lg">
                <Cpu size={20} className="text-black" />
              </div>
              <span className="text-xl font-bold font-outfit tracking-tight">GPU Intel</span>
            </div>
            <p className="text-gray-500 text-sm max-w-xs font-medium">
              The world's most advanced GPU orchestration and monitoring platform for AI workloads.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white">Product</h4>
              <ul className="text-gray-500 text-sm space-y-2 font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Infrastructure</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Monitoring</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white">Company</h4>
              <ul className="text-gray-500 text-sm space-y-2 font-medium">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-[#1e1e22] flex justify-between items-center">
          <div className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
            © 2026 GPU Intelligence Inc. All hardware metrics simulated for demo.
          </div>
          <div className="flex gap-6">
            <div className="w-2 h-2 rounded-full bg-[#76b900]" />
            <div className="w-2 h-2 rounded-full bg-gray-800" />
            <div className="w-2 h-2 rounded-full bg-gray-800" />
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-10 rounded-2xl bg-[#111114] border border-[#1e1e22] hover:border-[#76b900]/30 transition-all duration-500 group">
    <div className="bg-white/5 w-14 h-14 rounded-xl flex items-center justify-center mb-8 group-hover:bg-[#76b900]/10 transition-all duration-500">
      {icon}
    </div>
    <h3 className="text-2xl font-bold font-outfit mb-4 tracking-tighter">{title}</h3>
    <p className="text-gray-500 leading-relaxed text-base font-medium">
      {description}
    </p>
  </div>
);


export default LandingPage;
