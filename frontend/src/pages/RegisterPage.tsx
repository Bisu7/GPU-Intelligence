import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.post(`${API_BASE_URL}/api/v1/auth/register`, {
        email,
        full_name: fullName,
        password,
        role: 'user'
      });
      
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Start monitoring your GPU infrastructure today"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-xl">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400 ml-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#76b900]/50 transition-all placeholder:text-gray-700"
              placeholder="John Doe"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#76b900]/50 transition-all placeholder:text-gray-700"
              placeholder="name@company.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#76b900]/50 transition-all placeholder:text-gray-700"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#76b900] hover:bg-[#86d900] disabled:opacity-50 text-black font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(118,185,0,0.1)] uppercase tracking-widest text-sm"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
        </button>

        <div className="text-center text-xs text-gray-600 font-bold uppercase tracking-wider">
          Already have an account?{' '}
          <Link to="/login" className="text-[#76b900] hover:underline">
            Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
