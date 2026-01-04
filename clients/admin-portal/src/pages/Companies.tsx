import { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  MapPin,
  Loader2,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/apiClient';
import { Company } from '../types';

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    location: '',
    industry: ''
  });

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products/companies');
      setCompanies(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setEditForm({
      name: company.name,
      description: company.description || '',
      location: company.location || '',
      industry: company.industry || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;
    setUpdateLoading(true);
    try {
      await api.patch(`/products/companies/${selectedCompany.id}`, editForm);
      await fetchCompanies();
      setIsEditModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Update failed');
    } finally {
      setUpdateLoading(false);
    }
  };

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.industry?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">Entity Management</h1>
          <p className="text-slate-500 font-medium">Monitoring {companies.length} business registration nodes</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search registries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-6 text-sm font-bold w-full md:w-80 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>
          <button className="h-12 w-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm text-slate-400">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[40px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Company Node</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Sector</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Geo. Location</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCompanies.map((company, i) => (
                <motion.tr 
                  key={company.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200 shadow-inner group-hover:scale-110 transition-transform">
                        <Building2 size={24} />
                      </div>
                      <div>
                        <p className="font-black italic">{company.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: {company.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 capitalize font-bold text-slate-600">{company.industry || 'General'}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                      <MapPin size={14} className="text-blue-500" />
                      {company.location || 'Remote/Cloud'}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase rounded-full tracking-wider">
                       <CheckCircle2 size={10} />
                       Active Node
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(company)}
                        className="p-2 hover:bg-white border border-transparent hover:border-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-all"
                      >
                        <Edit size={18} />
                      </button>
                      <button className="p-2 hover:bg-white border border-transparent hover:border-slate-100 rounded-lg text-slate-400 hover:text-red-500 transition-all">
                        <Trash2 size={18} />
                      </button>
                      <button className="p-2 hover:bg-white border border-transparent hover:border-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-all">
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {loading && (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="animate-spin text-blue-600" size={32} />
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Syncing Data...</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[48px] shadow-3xl relative z-10 overflow-hidden border border-white"
            >
              <div className="p-12">
                 <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">Modify Entity</h3>
                    <button onClick={() => setIsEditModalOpen(false)} className="h-12 w-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                      <X size={24} />
                    </button>
                 </div>

                 <form onSubmit={handleUpdate} className="space-y-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">Entity Identity</label>
                         <input 
                            type="text" 
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-300 transition-all"
                            placeholder="Company Name"
                            required
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">Entity Sector</label>
                         <input 
                            type="text" 
                            value={editForm.industry}
                            onChange={(e) => setEditForm({...editForm, industry: e.target.value})}
                            className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-300 transition-all"
                            placeholder="e.g. Retail, FinTech"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">Node Origin (Location)</label>
                         <input 
                            type="text" 
                            value={editForm.location}
                            onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                            className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-300 transition-all"
                            placeholder="e.g. New York, London"
                         />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                       <button 
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black py-5 rounded-3xl transition-all uppercase tracking-widest text-xs"
                       >
                         Abort
                       </button>
                       <button 
                        type="submit"
                        disabled={updateLoading}
                        className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-3xl shadow-xl shadow-blue-600/20 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                       >
                         {updateLoading ? <Loader2 className="animate-spin" /> : 'Apply Protocols'}
                       </button>
                    </div>
                 </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Companies;
