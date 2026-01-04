import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../api/apiClient';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();
  const { setAuth, logout } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isLogin) {
        const response = await api.post('/auth/signin', { email, password });
        const { user, accessToken } = response.data;
        
        if (user.role !== 'ADMIN') {
          logout(); 
          setError('CRITICAL: ACCESS DENIED. ACCOUNT LACKS ADMINISTRATIVE PRIVILEGES.');
          return;
        }

        setAuth(user, accessToken);
        navigate('/dashboard');
      } else {
        const name = (e.target as any).userName.value;
        await api.post('/auth/signup', { email, password, name });
        setMessage('Registration signal sent. Please verify your email before authorizing access.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-2xl shadow-blue-500/40 mb-6 border border-white/10">
            <ShieldCheck size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">Admin Core</h1>
          <p className="text-slate-500 font-bold tracking-widest text-xs uppercase mt-2">Platform Security & Oversight</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[40px] p-10 shadow-3xl">
          <div className="flex bg-slate-950/50 p-1 rounded-2xl mb-8 border border-white/5">
            <button 
              type="button"
              onClick={() => { setIsLogin(true); setError(''); setMessage(''); }}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isLogin ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
            >
              Sign In
            </button>
            <button 
              type="button"
              onClick={() => { setIsLogin(false); setError(''); setMessage(''); }}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!isLogin ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-4">Operator Name</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    name="userName"
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white font-bold placeholder:text-slate-700 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    required={!isLogin}
                  />
                </div>
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-4">Registry Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@outlet.com"
                  className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white font-bold placeholder:text-slate-700 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Security Key</label>
                <Link to="/forgot-password" className="text-[10px] font-bold text-blue-500 uppercase tracking-wider hover:text-blue-400 transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white font-bold placeholder:text-slate-700 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center gap-3"
              >
                <ShieldCheck size={18} />
                {error}
              </motion.div>
            )}

            {message && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center gap-3"
              >
                <ShieldCheck size={18} />
                {message}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-black py-6 rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 transition-all active:scale-95 group overflow-hidden relative"
            >
              <span className="relative z-10">{loading ? <Loader2 className="animate-spin" /> : isLogin ? 'AUTHORIZE ACCESS' : 'INITIALIZE NODE'}</span>
              {!loading && <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform" />}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>
          </form>
        </div>
        
        <p className="text-center mt-8 text-slate-600 text-xs font-bold uppercase tracking-widest">
          Proprietary System — Unauthorized Access is Prohibited
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
