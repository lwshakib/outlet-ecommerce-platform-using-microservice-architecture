import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Package, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Building2,
  ChevronRight
} from 'lucide-react';
import { useCompanyStore } from '../store/useStore';
import api from '../api/apiClient';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, change, isPositive, icon: Icon, loading }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-card p-6 rounded-2xl border shadow-sm h-full"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-primary/10 rounded-xl text-primary">
        <Icon size={24} />
      </div>
      {change != null && (
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {change}%
        </div>
      )}
    </div>
    <p className="text-sm text-muted-foreground font-medium">{title}</p>
    {loading ? (
      <div className="h-9 w-24 bg-muted animate-pulse rounded-lg mt-1"></div>
    ) : (
      <h3 className="text-3xl font-bold mt-1">{value}</h3>
    )}
  </motion.div>
);

const DashboardOverview: React.FC = () => {
  const { selectedCompany } = useCompanyStore();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>({
    totalProducts: 0,
    activeProducts: 0,
    recentProducts: []
  });

  useEffect(() => {
    if (selectedCompany) {
      const fetchDashboardData = async () => {
        setLoading(true);
        try {
          // Fetch products for this company
          const productsRes = await api.get(`/catalog/products/company/${selectedCompany.id}`);
          const products = productsRes.data;
          
          setStats({
            totalProducts: products.length,
            activeProducts: products.length, // Logic for 'active' could be refined
            recentProducts: products.slice(0, 5)
          });
        } catch (error) {
          console.error('Failed to fetch dashboard data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchDashboardData();
    }
  }, [selectedCompany]);

  if (!selectedCompany) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-card border rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent"></div>
        <div className="relative z-10 max-w-md">
          <div className="h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6 mx-auto">
            <Building2 size={40} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">No Company Selected</h2>
          <p className="text-muted-foreground font-medium mb-8">
            Please select a company from "My Companies" to view its performance dashboard and manage its inventory.
          </p>
          <Link 
            to="/companies" 
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-black hover:opacity-90 transition-all hover:scale-105 shadow-xl shadow-primary/25"
          >
            Go to My Companies
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
               <Building2 size={16} />
            </div>
            <span className="text-sm font-bold text-primary uppercase tracking-widest">{selectedCompany.name}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        </div>
        <div className="flex gap-2">
          <div className="bg-card border px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            Real-time Live
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          loading={loading}
          icon={Package} 
        />
        <StatCard 
          title="Active Products" 
          value={stats.activeProducts} 
          loading={loading}
          icon={Activity} 
        />
        <StatCard 
          title="Demo Revenue" 
          value="$0.00" 
          change="0.0" 
          isPositive={true} 
          icon={DollarSign} 
        />
        <StatCard 
          title="Demo Orders" 
          value="0" 
          change="0.0" 
          isPositive={true} 
          icon={TrendingUp} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-card rounded-2xl border p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Products</h2>
            <Link to="/inventory" className="text-sm font-bold text-primary hover:underline">View all</Link>
          </div>
          
          <div className="space-y-4 flex-1">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-20 bg-muted/30 animate-pulse rounded-xl"></div>
              ))
            ) : stats.recentProducts.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <Package size={48} className="text-muted mb-4" />
                  <p className="text-muted-foreground font-medium">No products found for this company.</p>
               </div>
            ) : (
              stats.recentProducts.map((product: any) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-muted/10 rounded-xl border border-transparent hover:border-border transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <Package size={20} className="text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold group-hover:text-primary transition-colors">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{product.category?.name || 'Uncategorized'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black">${product.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Product ID: {product.id.slice(0, 8)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions / Summary */}
        <div className="bg-card rounded-2xl border p-6">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/inventory" className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-xl font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20">
              Manage Inventory
            </Link>
            <button className="w-full bg-secondary text-secondary-foreground py-4 rounded-xl font-bold hover:bg-muted transition-colors">
              Company Settings
            </button>
            <button className="w-full bg-card border border-border py-4 rounded-xl font-bold hover:bg-muted transition-colors">
              Sales Reports
            </button>
          </div>

          <div className="mt-8 pt-8 border-t">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Activity size={18} className="text-primary" />
              Inventory Status
            </h3>
            <div className="space-y-6">
               <div>
                 <div className="flex justify-between text-sm mb-2 font-bold">
                   <span className="text-muted-foreground">Catalog Utilization</span>
                   <span>65%</span>
                 </div>
                 <div className="h-3 bg-muted rounded-full overflow-hidden">
                   <div className="h-full bg-primary w-[65%] rounded-full shadow-[0_0_12px_rgba(var(--primary),0.5)]"></div>
                 </div>
               </div>
               
               <div className="p-4 bg-muted/30 rounded-2xl border">
                 <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Health Score</span>
                    <span className="text-green-500 font-black">9.8</span>
                 </div>
                 <p className="text-xs text-muted-foreground">Your store is performing above average this week.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
