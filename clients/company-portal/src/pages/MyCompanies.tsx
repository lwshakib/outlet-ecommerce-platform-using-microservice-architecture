import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Plus, 
  MapPin, 
  Store, 
  ChevronRight,
  MoreVertical,
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCompanyStore, useAuthStore } from '../store/useStore';
import api from '../api/apiClient';

const MyCompanies: React.FC = () => {
  const navigate = useNavigate();
  const { companies, setCompanies } = useCompanyStore();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [newCompany, setNewCompany] = useState({
    name: '',
    description: '',
    industry: 'Retail'
  });

  const fetchCompanies = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await api.get(`/products/companies/owner/${user.id}`);
      setCompanies(response.data);
    } catch (err) {
      console.error('Failed to fetch companies:', err);
      setError('Could not load companies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [user]);

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setCreateLoading(true);
    try {
      const response = await api.post('/products/companies', {
        ...newCompany,
        ownerId: user.id
      });
      setCompanies([...companies, response.data]);
      setIsModalOpen(false);
      setNewCompany({ name: '', description: '', industry: 'Retail' });
    } catch (err) {
      console.error('Failed to create company:', err);
      alert('Failed to create company. Please try again.');
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={48} className="text-primary animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading your business empire...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Companies</h1>
          <p className="text-muted-foreground mt-2">Manage your different business entities and outlets from one place.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all"
        >
          <Plus size={20} />
          Create Company
        </button>
      </header>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl flex items-center gap-3 text-sm font-semibold border border-destructive/20">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.length === 0 ? (
          <div className="col-span-full border-2 border-dashed border-muted rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Building2 size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold">No companies found</h3>
            <p className="text-muted-foreground max-w-xs mt-2">
              You haven't created any companies yet. Start by creating your first business entity.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-6 text-primary font-bold hover:underline"
            >
              Get started now
            </button>
          </div>
        ) : (
          companies.map((company) => (
            <motion.div
              key={company.id}
              whileHover={{ y: -5 }}
              className="bg-card border rounded-2xl overflow-hidden group"
            >
              <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/5 group-hover:from-primary/30 transition-colors"></div>
              <div className="px-6 pb-6 -mt-8">
                <div className="h-16 w-16 bg-card border-4 border-background rounded-2xl flex items-center justify-center shadow-lg text-primary mb-4">
                  <Store size={32} />
                </div>
                
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{company.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <MapPin size={14} />
                      <span>{company.location || 'NYC, US'}</span>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-muted rounded-lg">
                    <MoreVertical size={20} />
                  </button>
                </div>

                <p className="text-sm text-muted-foreground mt-4 line-clamp-2 min-h-[40px]">
                  {company.description || 'No description provided for this company entity.'}
                </p>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-3 bg-muted/50 rounded-xl text-center">
                    <p className="text-lg font-bold">--</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Products</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-xl text-center">
                    <p className="text-lg font-bold">--</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Revenue</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button 
                    onClick={() => navigate(`/companies/${company.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-2.5 rounded-xl font-semibold hover:bg-muted transition-colors transition-all"
                  >
                    Manage
                    <ChevronRight size={16} />
                  </button>
                  <button className="p-2.5 bg-card border rounded-xl hover:bg-muted transition-colors">
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden"
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold">Create New Company</h2>
              <p className="text-muted-foreground text-sm mt-1">Set up your business profile to start selling.</p>
              
              <form onSubmit={handleCreateCompany} className="mt-8 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Company Name</label>
                  <input 
                    type="text" 
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    placeholder="e.g. Acme Corp" 
                    className="w-full px-4 py-3 bg-muted/50 border rounded-xl focus:ring-2 ring-primary outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Description</label>
                  <textarea 
                    value={newCompany.description}
                    onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                    placeholder="What does your company do?" 
                    className="w-full px-4 py-3 bg-muted/50 border rounded-xl focus:ring-2 ring-primary outline-none transition-all h-24 resize-none"
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Industry</label>
                  <select 
                    value={newCompany.industry}
                    onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border rounded-xl focus:ring-2 ring-primary outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option>Retail</option>
                    <option>Technology</option>
                    <option>Fashion</option>
                    <option>Food & Beverage</option>
                  </select>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-bold hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={createLoading}
                    className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    {createLoading ? <Loader2 size={18} className="animate-spin" /> : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyCompanies;
