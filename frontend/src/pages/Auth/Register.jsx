import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import { 
  User, 
  Mail, 
  Lock, 
  Building2, 
  ArrowRight,
  Loader2,
  CheckCircle2
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    farmName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await apiClient.post('/auth/register', formData);
      // Auto login after registration
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-slideUp">
        <div className="auth-header">
          <div className="auth-logo">🐄</div>
          <h1>Create your Farm</h1>
          <p>Join mOOMOO and start managing your herd with AI.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <User size={18} />
              <input
                type="text"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Farm Name</label>
            <div className="input-wrapper">
              <Building2 size={18} />
              <input
                type="text"
                placeholder="Farm Name (e.g. Green Valley Dairy)"
                required
                value={formData.farmName}
                onChange={(e) => setFormData({...formData, farmName: e.target.value})}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input
                type="password"
                placeholder="Password"
                required
                minLength={8}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <span>Start Free Trial</span>}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="auth-footer">
          Already have a farm? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
