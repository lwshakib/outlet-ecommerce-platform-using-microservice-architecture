import React from 'react';
import { 
  Building2, 
  Mail, 
  Lock, 
  ArrowRight, 
  ShoppingBag,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = React.useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, just navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 bg-primary rounded-2xl items-center justify-center text-primary-foreground shadow-2xl shadow-primary/30 mb-6">
            <ShoppingBag size={32} />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">S-PORTAL</h1>
          <p className="text-muted-foreground font-medium">Enterprise Outlet Commerce Platform</p>
        </div>

        <div className="bg-card border rounded-3xl p-8 shadow-xl shadow-black/5">
          <div className="flex bg-muted p-1 rounded-2xl mb-8">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${isLogin ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${!isLogin ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
               <div className="space-y-2">
                <label className="text-sm font-bold flex items-center gap-2">
                  <Building2 size={16} className="text-primary" /> Full Name
                </label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full px-4 py-3 bg-muted/50 border rounded-xl focus:ring-2 ring-primary outline-none transition-all"
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2">
                <Mail size={16} className="text-primary" /> Email Address
              </label>
              <input 
                type="email" 
                placeholder="name@company.com" 
                className="w-full px-4 py-3 bg-muted/50 border rounded-xl focus:ring-2 ring-primary outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold flex items-center gap-2">
                  <Lock size={16} className="text-primary" /> Password
                </label>
                {isLogin && <button type="button" className="text-xs text-primary font-bold hover:underline">Forgot?</button>}
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-4 py-3 bg-muted/50 border rounded-xl focus:ring-2 ring-primary outline-none transition-all"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/25 mt-4"
            >
              {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
              <ArrowRight size={20} />
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
