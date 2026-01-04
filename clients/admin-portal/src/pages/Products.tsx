import { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Tag, 
  DollarSign, 
  Loader2, 
  MoreHorizontal,
  Eye,
  Trash2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/apiClient';
import { Product } from '../types';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/catalog/products');
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">Catalog Oversight</h1>
          <p className="text-slate-500 font-medium">Monitoring {products.length} distributed stock items</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-6 text-sm font-bold w-full md:w-80 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[40px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory Asset</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Owner Node</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Valuation</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Node Link</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((product, i) => (
                <motion.tr 
                  key={product.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner group-hover:scale-110 transition-transform flex items-center justify-center shrink-0">
                        {product.images?.[0] ? (
                           <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                        ) : (
                           <Package size={24} className="text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-black italic">{product.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter line-clamp-1">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-2">
                        <Tag size={14} className="text-purple-500" />
                        <span className="font-bold text-slate-600">{product.companyName || 'Universal'}</span>
                     </div>
                  </td>
                  <td className="px-8 py-6 font-black text-slate-900 text-lg">
                    ${product.price.toLocaleString()}
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black uppercase rounded-full tracking-wider">
                       <CheckCircle2 size={10} />
                       Verified
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-white border border-transparent hover:border-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-all">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 hover:bg-white border border-transparent hover:border-slate-100 rounded-lg text-slate-400 hover:text-red-500 transition-all">
                        <Trash2 size={18} />
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
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Syncing Catalog...</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
