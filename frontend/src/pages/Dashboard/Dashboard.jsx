import { useState, useEffect } from 'react';
import { animalService } from '../../api/services/animalService';
import { milkService } from '../../api/services/milkService';
import { healthService } from '../../api/services/healthService';
import { 
  TrendingUp, 
  Users, 
  Activity, 
  AlertTriangle,
  Loader2,
  ChevronRight
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [animals, summary, alertsData] = await Promise.all([
        animalService.getAnimals({ size: 1 }),
        milkService.getSummary(),
        healthService.getAlerts({ size: 3, reviewed: false })
      ]);

      setStats([
        { label: 'Total Herd', value: animals.totalElements || '0', icon: <Users />, color: 'blue' },
        { label: 'Daily Milk', value: `${summary?.dailyTotal || '0'}L`, icon: <TrendingUp />, color: 'green' },
        { label: 'Health Status', value: alertsData.totalElements > 0 ? 'Action Needed' : 'Excellent', icon: <Activity />, color: 'emerald' },
        { label: 'AI Alerts', value: alertsData.totalElements || '0', icon: <AlertTriangle />, color: 'amber' },
      ]);
      setAlerts(alertsData.content);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="animate-spin" size={48} />
        <p>Syncing with your farm...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h1>Dashboard Overview</h1>
        <p>Real-time analytics and AI health insights for your herd.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="card stat-card">
            <div className={`icon-box ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card main-card">
          <div className="card-header">
            <h3>Production Performance</h3>
            <span className="text-muted text-sm">Last 7 Days</span>
          </div>
          <div className="placeholder-chart">
            <Activity size={48} className="text-muted opacity-20" />
            <p>Production trends visualization will appear here as you log more data.</p>
          </div>
        </div>
        
        <div className="card side-card">
          <div className="card-header">
            <h3>Recent AI Alerts</h3>
            <button className="btn-text">View All <ChevronRight size={14} /></button>
          </div>
          <div className="alerts-list">
            {alerts.length === 0 ? (
              <div className="empty-alerts">
                <p>No critical alerts detected by AI.</p>
              </div>
            ) : alerts.map((alert) => (
              <div key={alert.id} className="alert-item">
                <div className={`alert-indicator ${alert.severity.toLowerCase()}`}></div>
                <div className="alert-body">
                  <span className="alert-title">{alert.message}</span>
                  <span className="alert-time">{alert.animalTag} • {alert.alertType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60vh;
          color: var(--text-muted);
          gap: 1rem;
        }
        .welcome-section { margin-bottom: 2rem; }
        .welcome-section h1 { font-size: 1.875rem; font-weight: 800; color: var(--secondary); }
        .welcome-section p { color: var(--text-muted); }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          transition: transform 0.2s;
        }
        .stat-card:hover { transform: translateY(-2px); }
        .icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-box.blue { background: #eff6ff; color: #3b82f6; }
        .icon-box.green { background: #ecfdf5; color: #10b981; }
        .icon-box.emerald { background: #f0fdf4; color: #059669; }
        .icon-box.amber { background: #fffbeb; color: #f59e0b; }
        
        .stat-content { display: flex; flex-direction: column; }
        .stat-label { font-size: 0.875rem; color: var(--text-muted); font-weight: 500; }
        .stat-value { font-size: 1.5rem; font-weight: 700; color: var(--secondary); }
        
        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .placeholder-chart {
          height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          border-radius: 0.75rem;
          border: 2px dashed var(--border);
          color: var(--text-muted);
          padding: 2rem;
          text-align: center;
          gap: 1rem;
        }
        .opacity-20 { opacity: 0.2; }
        
        .alerts-list { display: flex; flex-direction: column; gap: 1rem; }
        .alert-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem; border-radius: 0.75rem; background: #f8fafc; border: 1px solid transparent; transition: all 0.2s; }
        .alert-item:hover { border-color: var(--border); background: white; }
        .alert-indicator { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .alert-indicator.high { background: #ef4444; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1); }
        .alert-indicator.medium { background: #f59e0b; }
        .alert-indicator.low { background: #3b82f6; }
        .alert-body { display: flex; flex-direction: column; overflow: hidden; }
        .alert-title { font-size: 0.875rem; font-weight: 600; color: var(--secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .alert-time { font-size: 0.75rem; color: var(--text-muted); }
        
        .empty-alerts { padding: 2rem; text-align: center; color: var(--text-muted); font-size: 0.875rem; }
        .btn-text { background: none; border: none; color: var(--primary); font-size: 0.875rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.25rem; }
        .text-sm { font-size: 0.75rem; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default Dashboard;
