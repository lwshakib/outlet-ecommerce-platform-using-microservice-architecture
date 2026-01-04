import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import Products from './pages/Products';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/products" element={<Products />} />
          <Route path="/admins" element={
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="h-20 w-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mb-6 border border-amber-200 shadow-xl">
                 <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Level 4 Access Required</h2>
              <p className="text-slate-500 font-bold max-w-md mt-4">This section monitors administrative keys. Your current clearance does not allow for cross-node moderator modification.</p>
            </div>
          } />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
