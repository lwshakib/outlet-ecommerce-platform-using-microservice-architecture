import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  Building2, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  User as UserIcon,
  ChevronDown,
  Plus
} from 'lucide-react';
import { useAuthStore, useCompanyStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarLink = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`
    }
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </NavLink>
);

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const { selectedCompany, companies } = useCompanyStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="fixed inset-y-0 left-0 bg-card border-r w-72 z-50 flex flex-col"
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
                  <Building2 size={24} />
                </div>
                <span className="text-xl font-bold tracking-tight">S-Portal</span>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-muted rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
              <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Overview" />
              <SidebarLink to="/inventory" icon={Package} label="Inventory" />
              <SidebarLink to="/companies" icon={Building2} label="My Companies" />
              <SidebarLink to="/settings" icon={Settings} label="Settings" />
            </nav>

            <div className="p-4 border-t">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {/* Header */}
        <header className="h-16 border-b bg-card/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Menu size={20} />
              </button>
            )}
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
              <Search size={16} className="text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-48"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Company Selector */}
            <div className="hidden md:flex items-center gap-3 pr-4 border-r">
              <div className="text-right">
                <p className="text-sm font-semibold">{selectedCompany?.name || 'All Companies'}</p>
                <p className="text-xs text-muted-foreground">Manager View</p>
              </div>
              <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                <ChevronDown size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-muted rounded-lg transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
              </button>
              
              <div className="h-10 w-10 bg-muted rounded-full overflow-hidden flex items-center justify-center cursor-pointer hover:ring-2 ring-primary transition-all">
                {user?.name?.[0] || <UserIcon size={20} />}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
