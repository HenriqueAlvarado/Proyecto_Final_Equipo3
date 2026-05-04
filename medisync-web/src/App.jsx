import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AgendaPage from './pages/AgendaPage';
import PatientsPage from './pages/PatientsPage';
import DoctorsPage from './pages/DoctorsPage';
import NotFoundPage from './pages/NotFoundPage';
import './assets/styles/global.css';

// Wrapper para rutas protegidas
const ProtectedLayout = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="app-layout">
      <Navbar />
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/dashboard" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
    <Route path="/agenda" element={<ProtectedLayout><AgendaPage /></ProtectedLayout>} />
    <Route path="/pacientes" element={<ProtectedLayout><PatientsPage /></ProtectedLayout>} />
    <Route path="/medicos" element={<ProtectedLayout><DoctorsPage /></ProtectedLayout>} />
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
