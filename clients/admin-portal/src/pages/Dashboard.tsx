import { useState, useEffect } from 'react';
import { 
  Building2, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  ArrowUpRight,
  MoreVertical
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/apiClient';

const Dashboard = () => {
  const [stats, setStats] = useState({
    companies: 0,
    products: 0,
    orders: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [compRes, prodRes] = await Promise.all([
          api.get('/products/companies'),
          api.get('/catalog/products')
        ]);
        
        setStats({
          companies: compRes.data.length,
          products: prodRes.data.length,
          orders: 124, // Mock
          revenue: 45200 // Mock
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { name: 'Active Companies', value: stats.companies, change: '+12%', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Total Products', value: stats.products, change: '+5.4%', icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'System Orders', value: stats.orders, change: '-2.1%', icon: ShoppingCart, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Net Revenue', value: `$${stats.revenue.toLocaleString()}`, change: '+18%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter">NETWORK OVERVIEW</h1>
          <p className="text-slate-500 font-medium">Real-time synchronization across all clusters</p>
        </div>
        <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-3">
          <Activity size={18} className="text-blue-600" />
          System Health: OK
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, i) => (
          <motion.div 
            key={card.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className={`h-14 w-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center`}>
                <card.icon size={28} />
              </div>
              <button className="text-slate-300 hover:text-slate-600 transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{card.name}</p>
              <div className="flex items-end gap-3">
                <h3 className="text-3xl font-black leading-none">{card.value}</h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${card.change.startsWith('+') ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                  {card.change}
                </span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between text-slate-400">
               <span className="text-xs font-bold">VS LAST MONTH</span>
               <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm">
           <h3 className="text-xl font-black mb-8 italic">DISTRIBUTED TRAFFIC</h3>
           <div className="h-80 bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400 font-bold">
              [Visual Analytics Cluster Placeholder]
           </div>
        </div>
        <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm">
           <h3 className="text-xl font-black mb-8 italic">SYSTEM LOGS</h3>
           <div className="space-y-6">
              {[
                { event: 'New Company Registered', time: '2m ago', color: 'bg-blue-500' },
                { event: 'Auth Token Rotated', time: '14m ago', color: 'bg-slate-400' },
                { event: 'Bulk Load Complete', time: '1h ago', color: 'bg-emerald-500' },
                { event: 'High Latency Detected', time: '3h ago', color: 'bg-amber-500' },
                { event: 'Security Audit Pass', time: '5h ago', color: 'bg-purple-500' },
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`mt-1.5 h-2 w-2 rounded-full ${log.color}`} />
                  <div>
                    <p className="text-sm font-bold leading-none mb-1">{log.event}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.time}</p>
                  </div>
                </div>
              ))}
           </div>
           <button className="w-full mt-10 py-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors">
              View All Logs
           </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
