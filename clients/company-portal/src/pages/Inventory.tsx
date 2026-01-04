import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Package, 
  MoreHorizontal,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/apiClient';
import { useCompanyStore } from '../store/useStore';

const Inventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const { selectedCompany } = useCompanyStore();

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '', 
    stock: 0,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'
  });

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

      // 2. Fetch categories
      const catRes = await api.get('/catalog/categories');
      setCategories(catRes.data);
      if (catRes.data.length > 0 && !newProduct.category) {
        setNewProduct(prev => ({ ...prev, category: catRes.data[0].id }));
      }
      
      if (productsData.length > 0) {
        // 3. Fetch stock levels for these products
        const productIds = productsData.map((p: any) => p.id);
        const inventoryRes = await api.post('/inventory/stock/batch', { productIds });
        const stockMap = Array.isArray(inventoryRes.data) ? inventoryRes.data.reduce((acc: any, curr: any) => {
          acc[curr.productId] = curr.stock;
          return acc;
        }, {}) : {};
        
        // 4. Merge data
        const merged = productsData.map((p: any) => {
          const stock = stockMap[p.id] ?? 0;
          return {
            ...p,
            stock,
            status: stock > 50 ? 'In Stock' : stock > 0 ? 'Low Stock' : 'Out of Stock'
          };
        });
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

  useEffect(() => {
    fetchData();
  }, [selectedCompany]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;

    setCreateLoading(true);
    try {
      // 1. Create product in catalog
      const productRes = await api.post('/catalog/products', {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        categoryId: newProduct.category,
        companyId: selectedCompany.id,
        companyName: selectedCompany.name,
        images: [newProduct.imageUrl]
      });

      const createdProduct = productRes.data;

      // 2. Initialize stock in inventory
      await api.post('/inventory/stock', {
        productId: createdProduct.id,
        stock: newProduct.stock
      });

      // 3. Update local state
      await fetchData();
      setIsModalOpen(false);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: categories.length > 0 ? categories[0].id : '',
        stock: 0,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'
      });
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Failed to add product. Please check the console.');
    } finally {
      setCreateLoading(false);
    }
  };

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

  const filteredProducts = products.filter(p => {
    if (activeTab === 'all') return true;
    if (activeTab === 'in-stock') return p.status === 'In Stock';
    if (activeTab === 'low-stock') return p.status === 'Low Stock';
    if (activeTab === 'out-of-stock') return p.status === 'Out of Stock';
    return true;
  });

  if (loading) {
     return (
        <div className="flex justify-center items-center h-64">
           <Loader2 size={48} className="text-primary animate-spin" />
        </div>
     );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground mt-2">Track product stocks, prices, and categories for {selectedCompany.name}.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 border rounded-xl font-semibold hover:bg-muted transition-colors">
            <Download size={18} />
            Export
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
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
                <th className="px-6 py-4 text-sm font-bold text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-sm font-bold text-muted-foreground">Price</th>
                <th className="px-6 py-4 text-sm font-bold text-muted-foreground">Stock</th>
                <th className="px-6 py-4 text-sm font-bold text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No products found in this category.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <motion.tr 
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <Package size={20} className="text-muted-foreground" />
                          )}
                        </div>
                        <span className="font-semibold">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{product.category?.name || 'Luxury'}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-bold text-foreground">{filteredProducts.length}</span> products
          </p>
          <div className="flex items-center gap-2">
             <button className="px-4 py-2 border rounded-xl text-sm font-semibold hover:bg-muted disabled:opacity-50" disabled>Previous</button>
             <button className="px-4 py-2 border rounded-xl text-sm font-semibold hover:bg-muted disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add New Product</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-lg"><X size={20} /></button>
              </div>
              
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Product Name</label>
                    <input 
                      type="text" 
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="e.g. Premium Watch" 
                      className="w-full px-4 py-3 bg-muted/50 border rounded-xl focus:ring-2 ring-primary outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Description</label>
                    <textarea 
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      placeholder="Product details..." 
                      className="w-full px-4 py-3 bg-muted/50 border rounded-xl focus:ring-2 ring-primary outline-none h-24 resize-none"
                    ></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Category</label>
                    <select 
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-4 py-3 bg-muted/50 border rounded-xl focus:ring-2 ring-primary outline-none appearance-none cursor-pointer"
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Price ($)</label>
                      <input 
                        type="number" 
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        placeholder="99.99"
                        className="w-full px-4 py-3 bg-muted/50 border rounded-xl focus:ring-2 ring-primary outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Initial Stock</label>
                      <input 
                        type="number" 
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                        placeholder="100"
                        className="w-full px-4 py-3 bg-muted/50 border rounded-xl focus:ring-2 ring-primary outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Image URL</label>
                    <input 
                      type="text" 
                      value={newProduct.imageUrl}
                      onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                      placeholder="https://..." 
                      className="w-full px-4 py-3 bg-muted/50 border rounded-xl focus:ring-2 ring-primary outline-none"
                    />
                  </div>
                  <div className="aspect-video w-full rounded-2xl bg-muted overflow-hidden border border-dashed border-primary/20 flex items-center justify-center">
                    {newProduct.imageUrl ? (
                      <img src={newProduct.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-center p-4">
                         <Plus size={32} className="text-muted-foreground mx-auto mb-2" />
                         <p className="text-xs text-muted-foreground">Image Preview</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="col-span-full flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-4 bg-secondary text-secondary-foreground rounded-2xl font-bold hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={createLoading}
                    className="flex-1 px-6 py-4 bg-primary text-primary-foreground rounded-2xl font-black flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    {createLoading ? <Loader2 size={24} className="animate-spin" /> : 'Create Product'}
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

export default Inventory;
