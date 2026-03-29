// src/App.jsx — Main Router
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MenuPage from './pages/MenuPage';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import ProductsPage from './pages/admin/ProductsPage';
import AllergensPage from './pages/admin/AllergensPage';
import SettingsPage from './pages/admin/SettingsPage';
import BulkPage from './pages/admin/BulkPage';


function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<MenuPage />} />

      {/* Admin */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/admin/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
      <Route path="/admin/products"   element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
      <Route path="/admin/allergens"  element={<ProtectedRoute><AllergensPage /></ProtectedRoute>} />
      <Route path="/admin/settings"   element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/admin/bulk"       element={<ProtectedRoute><BulkPage     /></ProtectedRoute>} />


      {/* Fallback */}
      <Route path="*" element={
        <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
          <div className="text-8xl animate-bounce-gentle">🌿</div>
          <h1 className="text-2xl font-bold text-forest">Sayfa bulunamadı</h1>
          <a href="/" className="btn-primary">Ana Sayfaya Dön</a>
        </div>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
