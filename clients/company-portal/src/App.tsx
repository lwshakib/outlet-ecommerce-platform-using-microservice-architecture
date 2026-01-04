import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import MyCompanies from './pages/MyCompanies';
import Inventory from './pages/Inventory';
import Auth from './pages/Auth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/companies" element={<MyCompanies />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/settings" element={
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <h2 className="text-2xl font-bold">Settings</h2>
              <p className="text-muted-foreground mt-2">Configuration options coming soon.</p>
            </div>
          } />
        </Route>

        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
