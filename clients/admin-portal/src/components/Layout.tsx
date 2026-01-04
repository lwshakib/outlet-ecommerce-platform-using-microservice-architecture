import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-4">
             <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black italic">A</div>
             <div>
               <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Control Panel</h2>
               <p className="text-lg font-bold leading-none">System Administration</p>
             </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end">
               <span className="text-sm font-black">Admin User</span>
               <span className="text-xs text-slate-400">Global Moderator</span>
             </div>
             <div className="h-12 w-12 bg-slate-100 rounded-full border-2 border-white shadow-sm overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="avatar" />
             </div>
          </div>
        </header>
        <section className="flex-1 overflow-y-auto p-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Layout;
