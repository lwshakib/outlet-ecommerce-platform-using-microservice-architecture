import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';

const StatCard = ({ title, value, change, isPositive, icon: Icon }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-card p-6 rounded-2xl border shadow-sm"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-primary/10 rounded-xl text-primary">
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {change}%
      </div>
    </div>
    <p className="text-sm text-muted-foreground font-medium">{title}</p>
    <h3 className="text-3xl font-bold mt-1">{value}</h3>
  </motion.div>
);

const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's what's happening with your stores today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="$45,231.89" 
          change="20.1" 
          isPositive={true} 
          icon={DollarSign} 
        />
        <StatCard 
          title="Active Products" 
          value="2,350" 
          change="12.5" 
          isPositive={true} 
          icon={Package} 
        />
        <StatCard 
          title="Total Orders" 
          value="1,290" 
          change="4.3" 
          isPositive={false} 
          icon={TrendingUp} 
        />
        <StatCard 
          title="Conversion Rate" 
          value="3.2%" 
          change="18.1" 
          isPositive={true} 
          icon={Activity} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-card rounded-2xl border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Product Activity</h2>
            <button className="text-sm font-medium text-primary hover:underline">View all</button>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-transparent hover:border-border transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center font-bold text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                    P{i}
                  </div>
                  <div>
                    <h4 className="font-semibold">Premium Cotton T-Shirt {i}</h4>
                    <p className="text-sm text-muted-foreground">Updated stock in Summer Collection</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">+$29.99</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Summary */}
        <div className="bg-card rounded-2xl border p-6">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
              Add New Product
            </button>
            <button className="w-full bg-secondary text-secondary-foreground py-3 rounded-xl font-semibold hover:bg-muted transition-colors">
              Manage Inventory
            </button>
            <button className="w-full bg-card border border-border py-3 rounded-xl font-semibold hover:bg-muted transition-colors">
              Analytics Report
            </button>
          </div>

          <div className="mt-8 pt-8 border-t">
            <h3 className="font-bold mb-4">Inventory Status</h3>
            <div className="space-y-4">
               <div>
                 <div className="flex justify-between text-sm mb-1">
                   <span>Storage Used</span>
                   <span>75%</span>
                 </div>
                 <div className="h-2 bg-muted rounded-full overflow-hidden">
                   <div className="h-full bg-primary w-3/4"></div>
                 </div>
               </div>
               <div>
                 <div className="flex justify-between text-sm mb-1">
                   <span>Stock Alerts</span>
                   <span className="text-destructive font-bold">12 Products</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
