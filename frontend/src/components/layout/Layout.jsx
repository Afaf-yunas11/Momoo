import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ChatSidebar from './ChatSidebar';
import { 
  LayoutDashboard, 
  Dog, 
  Milk, 
  HeartPulse, 
  Wallet, 
  FileText, 
  Settings, 
  LogOut,
  Bell,
  Sparkles,
  Beef
} from 'lucide-react';

const Layout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Dog size={20} />, label: 'Animals', path: '/animals' },
    { icon: <Milk size={20} />, label: 'Milk Production', path: '/milk' },
    { icon: <HeartPulse size={20} />, label: 'Health & AI', path: '/health' },
    { icon: <Beef size={20} />, label: 'Feed & Nutrition', path: '/feed' },
    { icon: <Wallet size={20} />, label: 'Financials', path: '/finance' },
    { icon: <FileText size={20} />, label: 'Reports', path: '/reports' },
    { icon: <Settings size={20} />, label: 'Admin', path: '/admin' },
  ];

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="logo-icon">🐄</span>
          <span className="logo-text">mOOMOO</span>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={logout} className="logout-btn">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="search-placeholder">
            {/* Search bar could go here */}
          </div>
          <div className="user-profile">
            <button className={`ai-toggle-btn ${isChatOpen ? 'active' : ''}`} onClick={() => setIsChatOpen(!isChatOpen)}>
              <Sparkles size={20} />
              <span>AI Advisor</span>
            </button>
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            <div className="user-info">
              <span className="user-name">{user?.email?.split('@')[0]}</span>
              <span className="user-role">{user?.role}</span>
            </div>
            <div className="avatar">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        
        <div className="page-container">
          <Outlet />
        </div>
        <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </main>

      <style jsx>{`
        .layout-container {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }
        .sidebar {
          width: 260px;
          background: var(--secondary);
          color: white;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
        }
        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
          padding-left: 0.5rem;
        }
        .logo-icon { font-size: 1.5rem; }
        .logo-text {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.025em;
        }
        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .nav-item:hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
        }
        .nav-item.active {
          color: white;
          background: var(--primary);
        }
        .sidebar-footer {
          margin-top: auto;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          color: #fca5a5;
          background: transparent;
          border: none;
          cursor: pointer;
          border-radius: 0.75rem;
          transition: background 0.2s;
        }
        .logout-btn:hover { background: rgba(239, 68, 68, 0.1); }
        
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background-color: var(--background);
        }
        .top-bar {
          height: 70px;
          background: white;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .notification-btn {
          position: relative;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }
        .ai-toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f0fdf4;
          border: 1px solid #b9f6ca;
          color: #059669;
          padding: 0.5rem 0.875rem;
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ai-toggle-btn:hover { background: #dcfce7; }
        .ai-toggle-btn.active { background: var(--primary); color: white; border-color: var(--primary); }

        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ef4444;
          color: white;
          font-size: 0.6rem;
          padding: 2px 5px;
          border-radius: 10px;
          border: 2px solid white;
        }
        .user-info {
          display: flex;
          flex-direction: column;
          text-align: right;
        }
        .user-name {
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--text);
        }
        .user-role {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: capitalize;
        }
        .avatar {
          width: 40px;
          height: 40px;
          background: #e2e8f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: var(--text);
        }
        .page-container {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

export default Layout;
