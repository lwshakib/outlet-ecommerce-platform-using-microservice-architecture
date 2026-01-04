import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Lock, 
  ArrowRight, 
  ShoppingBag,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../api/apiClient';
import { useAuthStore } from '../store/useStore';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  
  const navigate = useNavigate();
  const { setUser, setToken, isAuthenticated } = useAuthStore();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        const response = await api.post('/auth/signin', { email: formData.email, password: formData.password });
        const { user, accessToken } = response.data;
        setUser(user);
        setToken(accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/dashboard');
      } else {
        await api.post('/auth/signup', { 
          email: formData.email, 
          password: formData.password, 
          name: formData.fullName 
        });
        setMessage('Registration signal sent. Please verify your email before authorization.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 bg-primary rounded-2xl items-center justify-center text-primary-foreground shadow-2xl shadow-primary/30 mb-6 group hover:rotate-12 transition-transform">
            <ShoppingBag size={32} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-2 italic">S-PORTAL</h1>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Enterprise Commerce Oversight</p>
        </div>

        <div className="bg-card border rounded-[40px] p-10 shadow-3xl">
          <div className="flex bg-muted p-1 rounded-2xl mb-8 border">
            <button 
              type="button"
              onClick={() => { setIsLogin(true); setError(null); setMessage(null); }}
              className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isLogin ? 'bg-card shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Sign In
            </button>
            <button 
              type="button"
              onClick={() => { setIsLogin(false); setError(null); setMessage(null); }}
              className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${!isLogin ? 'bg-card shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Register
            </button>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-destructive/10 text-destructive p-4 rounded-xl flex items-center gap-3 mb-6 text-xs font-black uppercase tracking-wider border border-destructive/20"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          {message && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-emerald-500/10 text-emerald-600 p-4 rounded-xl flex items-center gap-3 mb-6 text-xs font-black uppercase tracking-wider border border-emerald-500/20"
            >
              <ShieldCheck size={18} />
              {message}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
               <div className="space-y-2 px-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Operator Identity</label>
                <div className="relative group">
                  <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe" 
                    className="w-full pl-12 pr-6 py-4 bg-muted/30 border border-transparent rounded-2xl focus:bg-card focus:border-primary focus:ring-4 ring-primary/10 outline-none transition-all font-bold"
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2 px-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Registry Email</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@company.com" 
                  className="w-full pl-12 pr-6 py-4 bg-muted/30 border border-transparent rounded-2xl focus:bg-card focus:border-primary focus:ring-4 ring-primary/10 outline-none transition-all font-bold"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 px-2">
              <div className="flex justify-between items-center pr-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Security Key</label>
                {isLogin && <button type="button" onClick={() => navigate('/forgot-password')} className="text-[10px] text-primary font-black uppercase tracking-widest hover:translate-x-1 transition-transform">Forgot?</button>}
              </div>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-6 py-4 bg-muted/30 border border-transparent rounded-2xl focus:bg-card focus:border-primary focus:ring-4 ring-primary/10 outline-none transition-all font-bold"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/25 mt-4 disabled:opacity-50 disabled:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  PLEASE WAIT...
                </>
              ) : (
                <>
                  {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t flex flex-col gap-4 text-center">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our <span className="text-foreground font-bold hover:underline cursor-pointer">Terms of Service</span> and <span className="text-foreground font-bold hover:underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
