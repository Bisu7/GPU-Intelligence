import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state: any) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, formData);
      const { access_token } = response.data;
      
      // Fetch user profile
      const userResponse = await axios.get(`${API_BASE_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      
      setAuth(userResponse.data, access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to your GPU Intelligence account"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-xl">
            {error}
          </div>
        )}
        
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
          <div className="flex justify-between items-center px-1">
            <label className="text-sm font-medium text-gray-400">Password</label>
            <a href="#" className="text-xs text-[#76b900] hover:underline font-bold uppercase tracking-wider">Forgot?</a>
          </div>
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
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
        </button>

        <div className="text-center text-xs text-gray-600 font-bold uppercase tracking-wider">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#76b900] hover:underline">
            Register for free
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
