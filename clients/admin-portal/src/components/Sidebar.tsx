import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  Package, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  ShieldCheck,
  Users
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar = () => {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Companies', href: '/companies', icon: Building2 },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Admins', href: '/admins', icon: ShieldCheck },
  ];

  return (
    <div className="flex h-full w-72 flex-col bg-slate-900 text-white">
      <div className="flex h-20 items-center justify-center border-b border-slate-800 px-6">
        <h1 className="text-2xl font-black italic tracking-tighter">OUTLET ADMIN</h1>
      </div>

      <nav className="flex-1 space-y-2 p-6">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-6">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-400 transition-all hover:bg-red-500/10 hover:text-red-500"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
