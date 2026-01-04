import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import MyCompanies from './pages/MyCompanies';
import Inventory from './pages/Inventory';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CompanyDetail from './pages/CompanyDetail';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/companies" element={<MyCompanies />} />
            <Route path="/companies/:id" element={<CompanyDetail />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/settings" element={
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h2 className="text-2xl font-bold">Settings</h2>
                <p className="text-muted-foreground mt-2">Configuration options coming soon.</p>
              </div>
            } />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
