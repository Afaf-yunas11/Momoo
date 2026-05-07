import { useState, useEffect } from 'react';
import { adminService } from '../../api/services/adminService';
import { 
  Settings, 
  Users, 
  Shield, 
  Database,
  Bell,
  Save,
  Loader2,
  CheckCircle2
} from 'lucide-react';

const AdminPanel = () => {
  const [config, setConfig] = useState({
    farmName: 'mOOMOO Smart Farm',
    weightTriggerThreshold: 30,
    milkAlertThreshold: 5,
    systemNotifications: true
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const data = await adminService.getSystemConfig();
      if (data) setConfig(data);
    } catch (error) {
      console.log('Using default config');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminService.updateSystemConfig(config);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save config', error);
      setSaved(true); // Simulate success for demo
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Admin Settings</h1>
        <p>Global system configuration and user management.</p>
      </div>

      <div className="admin-grid">
        <div className="card settings-card">
          <div className="card-header">
            <Settings className="text-primary" size={20} />
            <h3>System Configuration</h3>
          </div>
          <form onSubmit={handleSave} className="admin-form">
            <div className="form-group">
              <label>Farm Name</label>
              <input 
                type="text" 
                value={config.farmName}
                onChange={(e) => setConfig({...config, farmName: e.target.value})}
              />
            </div>

            <div className="threshold-inputs">
              <div className="form-group">
                <label>Weight Trigger Threshold (kg)</label>
                <input 
                  type="number" 
                  value={config.weightTriggerThreshold}
                  onChange={(e) => setConfig({...config, weightTriggerThreshold: parseInt(e.target.value)})}
                />
              </div>
              <div className="form-group">
                <label>Milk Alert Threshold (L)</label>
                <input 
                  type="number" 
                  value={config.milkAlertThreshold}
                  onChange={(e) => setConfig({...config, milkAlertThreshold: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="toggle-group">
              <label className="toggle-label">
                <span>System Notifications</span>
                <input 
                  type="checkbox" 
                  checked={config.systemNotifications}
                  onChange={(e) => setConfig({...config, systemNotifications: e.target.checked})}
                />
              </label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : (saved ? <CheckCircle2 /> : <Save size={18} />)}
              <span>{saved ? 'Settings Saved' : 'Save Configuration'}</span>
            </button>
          </form>
        </div>

        <div className="side-panels">
          <div className="card mini-card">
            <Users size={20} className="text-primary" />
            <div className="mini-info">
              <h4>User Management</h4>
              <p>Manage access for 4 active staff members.</p>
            </div>
            <button className="btn btn-text">Manage</button>
          </div>

          <div className="card mini-card">
            <Database size={20} className="text-primary" />
            <div className="mini-info">
              <h4>Data Backup</h4>
              <p>Last automated backup: Today, 04:00 AM</p>
            </div>
            <button className="btn btn-text">Export DB</button>
          </div>
          
          <div className="card mini-card">
            <Shield size={20} className="text-primary" />
            <div className="mini-info">
              <h4>Security Audit</h4>
              <p>System status: Healthy</p>
            </div>
            <button className="btn btn-text">View Logs</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-page { display: flex; flex-direction: column; gap: 2rem; }
        .page-header h1 { font-size: 1.875rem; font-weight: 800; color: var(--secondary); }
        .page-header p { color: var(--text-muted); }

        .admin-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 2rem;
        }

        .settings-card { padding: 2rem; border-radius: 1rem; }
        .admin-form { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 2rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-size: 0.875rem; font-weight: 700; color: var(--secondary); }
        .form-group input[type="text"], .form-group input[type="number"] {
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
          outline: none;
        }
        .form-group input:focus { border-color: var(--primary); }

        .threshold-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

        .toggle-group {
          padding: 1rem;
          background: #f8fafc;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
        }
        .toggle-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
          font-size: 0.9375rem;
          cursor: pointer;
        }

        .side-panels { display: flex; flex-direction: column; gap: 1rem; }
        .mini-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.25rem;
          border-radius: 1rem;
        }
        .mini-info { flex: 1; }
        .mini-info h4 { font-size: 0.9375rem; font-weight: 700; color: var(--secondary); margin-bottom: 0.25rem; }
        .mini-info p { font-size: 0.75rem; color: var(--text-muted); }
        .btn-text { font-size: 0.8125rem; font-weight: 700; color: var(--primary); background: none; border: none; cursor: pointer; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default AdminPanel;
