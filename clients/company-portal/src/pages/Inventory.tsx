import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Package, 
  ArrowUpDown,
  MoreHorizontal,
  Download,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/apiClient';
import { useCompanyStore } from '../store/useStore';

const Inventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedCompany } = useCompanyStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCompany) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        // 1. Fetch products for company
        const catalogRes = await api.get(`/catalog/products/company/${selectedCompany.id}`);
        const productsData = catalogRes.data;
        
        if (productsData.length > 0) {
          // 2. Fetch stock levels for these products
          const productIds = productsData.map((p: any) => p.id);
          const inventoryRes = await api.post('/inventory/stock/batch', { productIds });
          const stockMap = inventoryRes.data.reduce((acc: any, curr: any) => {
            acc[curr.productId] = curr.stock;
            return acc;
          }, {});
          
          // 3. Merge data
          const merged = productsData.map((p: any) => ({
            ...p,
            stock: stockMap[p.id] || 0,
            status: stockMap[p.id] > 50 ? 'In Stock' : stockMap[p.id] > 0 ? 'Low Stock' : 'Out of Stock'
          }));
          setProducts(merged);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedCompany]);

  if (!selectedCompany) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Package size={64} className="text-muted-foreground/20 mb-4" />
        <h2 className="text-2xl font-bold">No Company Selected</h2>
        <p className="text-muted-foreground mt-2">Please select a company from the dashboard to manage inventory.</p>
        <Link to="/companies" className="mt-6 bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold">
           My Companies
        </Link>
      </div>
    );
  }

  if (loading) {
     return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
     );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground mt-2">Track product stocks, prices, and categories across your stores.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 border rounded-xl font-semibold hover:bg-muted transition-colors">
            <Download size={18} />
            Export
          </button>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all">
            <Plus size={20} />
            Add Product
          </button>
        </div>
      </header>

      {/* Filters & Tabs */}
      <div className="bg-card border rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex bg-muted p-1 rounded-xl w-full md:w-auto">
          {['all', 'in-stock', 'low-stock', 'out-of-stock'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                activeTab === tab ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 bg-muted/50 border rounded-xl focus:ring-2 ring-primary outline-none text-sm transition-all"
            />
          </div>
          <button className="p-2 border rounded-xl hover:bg-muted transition-colors">
             <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-6 py-4 text-sm font-bold text-muted-foreground">Product</th>
                <th className="px-6 py-4 text-sm font-bold text-muted-foreground">Category</th>
                <th className="px-6 py-4 text-sm font-bold text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors uppercase tracking-wider text-[10px]">
                    Status <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="px-6 py-4 text-sm font-bold text-muted-foreground">Price</th>
                <th className="px-6 py-4 text-sm font-bold text-muted-foreground">Stock</th>
                <th className="px-6 py-4 text-sm font-bold text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <motion.tr 
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center text-primary/60 group-hover:text-primary transition-colors">
                        <Package size={20} />
                      </div>
                      <span className="font-semibold">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{product.category?.name || 'Uncategorized'}</td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      product.status === 'In Stock' ? 'bg-green-500/10 text-green-500' :
                      product.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {product.status === 'In Stock' && <CheckCircle2 size={12} />}
                      {product.status === 'Low Stock' && <AlertCircle size={12} />}
                      {product.status === 'Out of Stock' && <AlertCircle size={12} />}
                      {product.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className="font-medium">{product.stock}</span>
                       <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden hidden md:block">
                         <div 
                           className={`h-full rounded-full ${
                             product.stock > 50 ? 'bg-green-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'
                           }`}
                           style={{ width: `${Math.min(product.stock, 100)}%` }}
                         ></div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-bold text-foreground">5</span> of <span className="font-bold text-foreground">124</span> products
          </p>
          <div className="flex items-center gap-2">
             <button className="px-4 py-2 border rounded-xl text-sm font-semibold hover:bg-muted disabled:opacity-50" disabled>Previous</button>
             <button className="px-4 py-2 border rounded-xl text-sm font-semibold hover:bg-muted">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
