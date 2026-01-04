import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Package, 
  ShoppingCart, 
  Settings, 
  ArrowLeft,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  Search,
  Filter,
  Truck,
  DollarSign,
  X,
  MapPin,
  Clock,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/apiClient';
import { useCompanyStore } from '../store/useStore';

type Tab = 'overview' | 'products' | 'inventory' | 'orders';

const CompanyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [company, setCompany] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  
  const { setSelectedCompany } = useCompanyStore();

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: 0,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Fetch Company details
      const compRes = await api.get(`/products/companies/${id}`);
      setCompany(compRes.data);
      setSelectedCompany(compRes.data);

      // 2. Fetch Company products
      const prodRes = await api.get(`/catalog/products/company/${id}`);
      const productsData = prodRes.data;

      // 3. Fetch Categories
      const catRes = await api.get('/catalog/categories');
      setCategories(catRes.data);
      if (catRes.data.length > 0 && !newProduct.category) {
        setNewProduct(prev => ({ ...prev, category: catRes.data[0].id }));
      }

      // 4. Fetch stock levels
      if (productsData.length > 0) {
        const productIds = productsData.map((p: any) => p.id);
        const stockRes = await api.post('/inventory/stock/batch', { productIds });
        const stockMap = Array.isArray(stockRes.data) ? stockRes.data.reduce((acc: any, curr: any) => {
          acc[curr.productId] = curr.stock;
          return acc;
        }, {}) : {};

        const merged = productsData.map((p: any) => ({
          ...p,
          stock: stockMap[p.id] ?? 0,
          status: (stockMap[p.id] ?? 0) > 50 ? 'In Stock' : (stockMap[p.id] ?? 0) > 0 ? 'Low Stock' : 'Out of Stock'
        }));
        setProducts(merged);
      } else {
        setProducts([]);
      }

      // 4. Fetch orders
      const orderRes = await api.get(`/orders/company/${id}`);
      setOrders(orderRes.data);

    } catch (err) {
      console.error('Failed to fetch company details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      // Update local state
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    setCreateLoading(true);
    try {
      const prodRes = await api.post('/catalog/products', {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        categoryId: newProduct.category,
        companyId: company.id,
        companyName: company.name,
        images: [newProduct.imageUrl]
      });
      await api.post('/inventory/stock', {
        productId: prodRes.data.id,
        stock: newProduct.stock
      });
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
    } catch (err) {
      console.error('Failed to add product:', err);
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 size={48} className="text-primary animate-spin" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-20">
        <AlertCircle size={64} className="mx-auto text-destructive mb-4" />
        <h2 className="text-2xl font-bold">Company Not Found</h2>
        <Link to="/companies" className="text-primary mt-4 inline-block">Back to My Companies</Link>
      </div>
    );
  }

  const revenue = orders.reduce((acc, curr) => acc + (curr.status === 'DELIVERED' || curr.status === 'PAID' ? curr.totalAmount : 0), 0);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/companies')} className="h-12 w-12 border rounded-xl flex items-center justify-center hover:bg-muted transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{company.name}</h1>
              <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                {company.industry || 'Retail'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground mt-2 text-sm">
              <div className="flex items-center gap-1.5"><MapPin size={14} />{company.location || 'NYC, US'}</div>
              <div className="flex items-center gap-1.5"><Package size={14} />{products.length} Products</div>
              <div className="flex items-center gap-1.5"><ShoppingCart size={14} />{orders.length} Orders</div>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-5 py-2.5 border rounded-xl font-bold hover:bg-muted transition-all">
            <Settings size={20} />
            Manage Settings
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b gap-8 scrollbar-hide overflow-x-auto">
        {[
          { id: 'overview', icon: Building2, label: 'Overview' },
          { id: 'products', icon: Package, label: 'Products' },
          { id: 'inventory', icon: CheckCircle2, label: 'Inventory' },
          { id: 'orders', icon: ShoppingCart, label: 'Orders' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative ${
              activeTab === tab.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard label="Total Revenue" value={`$${revenue.toFixed(2)}`} icon={DollarSign} color="text-green-500" />
            <StatsCard label="Active Orders" value={orders.filter(o => o.status !== 'DELIVERED').length.toString()} icon={ShoppingCart} color="text-blue-500" />
            <StatsCard label="Low Stock Items" value={products.filter(p => p.status === 'Low Stock').length.toString()} icon={AlertCircle} color="text-amber-500" />
            <StatsCard label="Delivered" value={orders.filter(o => o.status === 'DELIVERED').length.toString()} icon={Truck} color="text-purple-500" />

            <div className="col-span-full grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
                  Recent Orders
                  <button onClick={() => setActiveTab('orders')} className="text-primary text-sm hover:underline">View All</button>
                </h3>
                <div className="space-y-4">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-colors border border-transparent hover:border-border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center font-bold text-xs uppercase">
                          {order.status[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black">${order.totalAmount.toFixed(2)}</p>
                        <p className={`text-[10px] font-black uppercase ${
                          order.status === 'DELIVERED' ? 'text-green-500' : 
                          order.status === 'PENDING' ? 'text-amber-500' : 'text-blue-500'
                        }`}>{order.status}</p>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && <p className="text-center py-10 text-muted-foreground">No orders yet.</p>}
                </div>
              </div>

              <div className="bg-card border rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
                  Inventory Status
                  <button onClick={() => setActiveTab('inventory')} className="text-primary text-sm hover:underline">Manage</button>
                </h3>
                <div className="space-y-4">
                  {products.slice(0, 5).map(product => (
                    <div key={product.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                          {product.images?.[0] ? <img src={product.images[0]} alt="" className="h-full w-full object-cover" /> : <Package size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.category?.name || 'Retail'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black">{product.stock} units</p>
                        <div className="h-1 w-16 bg-muted rounded-full overflow-hidden mt-1">
                          <div 
                            className={`h-full ${product.stock > 50 ? 'bg-green-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(product.stock, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && <p className="text-center py-10 text-muted-foreground">No products yet.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
           <div className="bg-card border rounded-2xl overflow-hidden">
             <div className="p-4 border-b flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input type="text" placeholder="Search products..." className="w-full pl-10 pr-4 py-2 bg-muted/50 border rounded-xl focus:ring-2 ring-primary border-none outline-none" />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border rounded-xl font-bold hover:bg-muted"><Filter size={18}/>Filter</button>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-muted/30 border-b">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black uppercase text-muted-foreground">Product</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-muted-foreground">Category</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-muted-foreground">Price</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-muted-foreground">Stock</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-muted-foreground">Date Added</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {products.map(product => (
                      <tr key={product.id} className="hover:bg-muted/10">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                             <div className="h-12 w-12 bg-muted rounded-xl flex items-center justify-center overflow-hidden shrink-0 border">
                               {product.images?.[0] ? <img src={product.images[0]} alt="" className="h-full w-full object-cover" /> : <Package size={20} />}
                             </div>
                             <div>
                               <p className="font-bold">{product.name}</p>
                               <p className="text-xs text-muted-foreground line-clamp-1">{product.description || 'No description'}</p>
                             </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">{product.category?.name || 'Retail'}</td>
                        <td className="px-6 py-4 font-black">${product.price.toFixed(2)}</td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                             product.status === 'In Stock' ? 'bg-green-500/10 text-green-500' :
                             product.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                           }`}>{product.stock} in stock</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(product.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 hover:bg-muted rounded-lg transition-colors"><MoreHorizontal size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>
           </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-card border rounded-2xl p-1 shadow-sm overflow-hidden">
             <div className="p-6 border-b">
                <h3 className="text-lg font-bold">Inventory Management</h3>
                <p className="text-sm text-muted-foreground">Update stock levels and manage warehouse status.</p>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black uppercase text-muted-foreground">Item</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-muted-foreground">Status</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-muted-foreground">Current Stock</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-muted-foreground">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {products.map(product => (
                      <tr key={product.id} className="hover:bg-muted/5">
                        <td className="px-6 py-4 font-bold">{product.name}</td>
                        <td className="px-6 py-4">
                           <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              product.status === 'In Stock' ? 'bg-green-500/10 text-green-500' :
                              product.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                           }`}>
                              <div className={`h-1.5 w-1.5 rounded-full ${
                                product.status === 'In Stock' ? 'bg-green-500' :
                                product.status === 'Low Stock' ? 'bg-amber-500' : 'bg-red-500'
                              }`} />
                              {product.status}
                           </div>
                        </td>
                        <td className="px-6 py-4 font-black">{product.stock}</td>
                        <td className="px-6 py-4">
                           <div className="flex gap-2">
                             <input type="number" className="w-20 px-3 py-1 bg-muted rounded-lg border-none text-sm font-bold" defaultValue={10} />
                             <button className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-xs font-black hover:opacity-90">RESTOCK</button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-card border rounded-2xl overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-muted/30 border-b">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black uppercase text-muted-foreground">Order ID</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-muted-foreground">Items</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-muted-foreground">Status</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-muted-foreground">Amount</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-muted/10">
                        <td className="px-6 py-4">
                           <p className="font-bold">ORD-{order.id.slice(0, 8).toUpperCase()}</p>
                           <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={10}/>{new Date(order.createdAt).toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex -space-x-3 overflow-hidden">
                              {order.items.slice(0, 3).map((item: any, i: number) => (
                                <div key={i} className="h-8 w-8 rounded-full border-2 border-background overflow-hidden bg-muted">
                                   <img src={item.image} alt="" className="h-full w-full object-cover" />
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <div className="h-8 w-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold">
                                   +{order.items.length - 3}
                                </div>
                              )}
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <select 
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className={`px-3 py-1.5 rounded-xl border-none text-xs font-black transition-all appearance-none cursor-pointer ${
                              order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500' : 
                              order.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : 
                              order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                            }`}
                           >
                             <option value="PENDING">PENDING</option>
                             <option value="PAID">PAID</option>
                             <option value="SHIPPED">SHIPPED</option>
                             <option value="DELIVERED">DELIVERED</option>
                             <option value="CANCELLED">CANCELLED</option>
                           </select>
                        </td>
                        <td className="px-6 py-4 font-black">${order.totalAmount.toFixed(2)}</td>
                        <td className="px-6 py-4">
                           <button className="flex items-center gap-2 text-primary font-bold text-sm hover:underline">
                             Details<ChevronRight size={16}/>
                           </button>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                       <tr>
                         <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground font-medium">No orders found for this company.</td>
                       </tr>
                    )}
                  </tbody>
               </table>
             </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black italic tracking-tighter">ADD NEW PRODUCT</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-xl transition-colors"><X size={20} /></button>
                </div>
                
                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Product Name</label>
                      <input 
                        type="text" 
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="e.g. UltraBoost 22" 
                        className="w-full px-5 py-4 bg-muted/50 border-none rounded-2xl focus:ring-2 ring-primary outline-none font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Description</label>
                       <textarea 
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Premium running shoes..." 
                        className="w-full px-5 py-4 bg-muted/50 border-none rounded-2xl focus:ring-2 ring-primary outline-none font-bold h-32 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Category</label>
                       <select 
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full px-5 py-4 bg-muted/50 border-none rounded-2xl focus:ring-2 ring-primary outline-none font-bold appearance-none cursor-pointer"
                        required
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Price ($)</label>
                         <input 
                           type="number" 
                           value={newProduct.price}
                           onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                           placeholder="199.99"
                           className="w-full px-5 py-4 bg-muted/50 border-none rounded-2xl focus:ring-2 ring-primary outline-none font-bold text-center"
                           required
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Init Stock</label>
                         <input 
                           type="number" 
                           value={newProduct.stock}
                           onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                           placeholder="50"
                           className="w-full px-5 py-4 bg-muted/50 border-none rounded-2xl focus:ring-2 ring-primary outline-none font-bold text-center"
                           required
                         />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Image URL</label>
                      <input 
                        type="text" 
                        value={newProduct.imageUrl}
                        onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash..." 
                        className="w-full px-5 py-4 bg-muted/50 border-none rounded-2xl focus:ring-2 ring-primary outline-none font-bold"
                      />
                    </div>
                    <div className="aspect-square w-full rounded-2xl bg-muted overflow-hidden border-2 border-dashed flex items-center justify-center p-2">
                      {newProduct.imageUrl ? (
                        <img src={newProduct.imageUrl} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                      ) : (
                        <div className="text-center">
                           <Plus size={48} className="text-muted-foreground mx-auto mb-2 opacity-20" />
                           <p className="text-xs font-bold text-muted-foreground uppercase opacity-50">Image Preview</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-span-full pt-4 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-8 py-4 bg-secondary text-secondary-foreground rounded-2xl font-black hover:bg-muted transition-all"
                    >
                      CANCEL
                    </button>
                    <button 
                      type="submit"
                      disabled={createLoading}
                      className="flex-[2] px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-primary/20"
                    >
                      {createLoading ? <Loader2 size={24} className="animate-spin" /> : 'CREATE PRODUCT'}
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

const StatsCard: React.FC<{ label: string; value: string; icon: any; color: string }> = ({ label, value, icon: Icon, color }) => (
  <div className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2.5 rounded-xl bg-muted ${color}`}>
        <Icon size={24} />
      </div>
      <MoreHorizontal size={18} className="text-muted-foreground opacity-30" />
    </div>
    <p className="text-sm font-black text-muted-foreground uppercase tracking-wider">{label}</p>
    <h3 className="text-2xl font-black mt-1">{value}</h3>
  </div>
);

export default CompanyDetail;
