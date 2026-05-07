import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';

import AnimalList from './pages/Animals/AnimalList';
import AnimalDetails from './pages/Animals/AnimalDetails';
import MilkRecords from './pages/Milk/MilkRecords';
import HealthCenter from './pages/Health/HealthCenter';
import FeedManagement from './pages/Feed/FeedManagement';
import Financials from './pages/Finance/Financials';
import ReportCenter from './pages/Reports/ReportCenter';
import AdminPanel from './pages/Admin/AdminPanel';

// Placeholder components for other pages
const Placeholder = ({ title }) => (
  <div className="card">
    <h1>{title}</h1>
    <p>This module is currently under development.</p>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="animals" element={<AnimalList />} />
            <Route path="animals/:id" element={<AnimalDetails />} />
            <Route path="milk" element={<MilkRecords />} />
            <Route path="health" element={<HealthCenter />} />
            <Route path="feed" element={<FeedManagement />} />
            <Route path="finance" element={<Financials />} />
            <Route path="reports" element={<ReportCenter />} />
            <Route path="admin" element={<AdminPanel />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
