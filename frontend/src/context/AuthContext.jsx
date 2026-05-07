import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // For now, we'll just decode the token or assume valid if exists
      // In a real app, you might call /api/auth/me
      const email = localStorage.getItem('userEmail');
      const role = localStorage.getItem('userRole');
      if (email && role) {
        setUser({ email, role });
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { accessToken, role } = response.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', role);
    localStorage.setItem('farmId', response.data.farmId || '');
    
    setUser({ email, role, farmId: response.data.farmId });
    return response.data;
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
