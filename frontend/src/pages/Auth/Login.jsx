import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('admin@moomoo.local');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-card">
        <div className="login-header">
          <div className="logo-icon">🐄</div>
          <h1>mOOMOO</h1>
          <p>Smart Dairy Management</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@moomoo.local"
                required 
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Don't have a farm? <Link to="/register" style={{color: 'var(--primary)', fontWeight: 'bold'}}>Create one now</Link></p>
          <p style={{marginTop: '0.5rem'}}>Forgot password? Contact your administrator.</p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          padding: 1rem;
        }
        .login-card {
          width: 100%;
          max-width: 400px;
          padding: 2.5rem;
          background: rgba(255, 255, 255, 0.95);
        }
        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .logo-icon {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }
        .login-header h1 {
          font-size: 2rem;
          font-weight: 800;
          color: var(--secondary);
          letter-spacing: -0.025em;
        }
        .login-header p {
          color: var(--text-muted);
          font-size: 0.875rem;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .input-group label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text);
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-wrapper svg {
          position: absolute;
          left: 1rem;
          color: var(--text-muted);
        }
        .input-wrapper input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
          background: white;
          font-size: 1rem;
          transition: all 0.2s ease;
        }
        .input-wrapper input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
        .login-btn {
          margin-top: 0.5rem;
          padding: 0.75rem;
          font-size: 1rem;
        }
        .error-message {
          padding: 0.75rem;
          background: #fee2e2;
          color: #991b1b;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          text-align: center;
        }
        .login-footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;
