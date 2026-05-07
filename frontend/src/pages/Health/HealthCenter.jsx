import { useState, useEffect } from 'react';
import { healthService } from '../../api/services/healthService';
import { 
  HeartPulse, 
  AlertCircle, 
  CheckCircle2, 
  Stethoscope,
  ShieldCheck,
  ChevronRight,
  Loader2
} from 'lucide-react';

const HealthCenter = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('alerts');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const data = await healthService.getAlerts({ reviewed: false });
      setAlerts(data.content);
    } catch (error) {
      console.error('Failed to fetch health alerts', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id) => {
    try {
      await healthService.reviewAlert(id);
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Failed to review alert', error);
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'HIGH': return 'severity-high';
      case 'MEDIUM': return 'severity-medium';
      case 'LOW': return 'severity-low';
      default: return '';
    }
  };

  return (
    <div className="health-page">
      <div className="page-header">
        <div>
          <h1>Health & AI Center</h1>
          <p>Monitor herd health and review AI-generated alerts.</p>
        </div>
        <div className="tab-controls card">
          <button 
            className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            <AlertCircle size={18} />
            <span>AI Alerts</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'vaccines' ? 'active' : ''}`}
            onClick={() => setActiveTab('vaccines')}
          >
            <ShieldCheck size={18} />
            <span>Vaccinations</span>
          </button>
        </div>
      </div>

      <div className="content-area">
        {activeTab === 'alerts' ? (
          <div className="alerts-container">
            {loading ? (
              <div className="loading-state">
                <Loader2 className="animate-spin" />
                <p>Analyzing health data...</p>
              </div>
            ) : alerts.length === 0 ? (
              <div className="card empty-health-state">
                <CheckCircle2 size={48} className="text-primary" />
                <h3>All Clear!</h3>
                <p>No unreviewed health alerts at this time.</p>
              </div>
            ) : (
              <div className="alerts-list">
                {alerts.map(alert => (
                  <div key={alert.id} className={`card alert-card ${getSeverityClass(alert.severity)}`}>
                    <div className="alert-header">
                      <div className="animal-info">
                        <span className="tag">{alert.animalTag}</span>
                        <span className="type">{alert.alertType}</span>
                      </div>
                      <span className={`severity-badge ${alert.severity.toLowerCase()}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="alert-message">{alert.message}</p>
                    <div className="action-box">
                      <div className="recommendation">
                        <Stethoscope size={16} />
                        <span><strong>Action:</strong> {alert.recommendedAction}</span>
                      </div>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleReview(alert.id)}
                      >
                        Mark as Reviewed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="card placeholder-section">
            <HeartPulse size={48} className="text-muted" />
            <h3>Vaccination Records</h3>
            <p>This module is coming soon to help you track schedules.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .health-page { display: flex; flex-direction: column; gap: 2rem; }
        .page-header { display: flex; justify-content: space-between; align-items: center; }
        .page-header h1 { font-size: 1.875rem; font-weight: 800; color: var(--secondary); }
        .page-header p { color: var(--text-muted); }

        .tab-controls {
          display: flex;
          padding: 0.25rem;
          gap: 0.25rem;
          border-radius: 0.75rem;
        }
        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          background: none;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          color: var(--text-muted);
          transition: all 0.2s;
        }
        .tab-btn.active { background: var(--primary); color: white; }
        .tab-btn:not(.active):hover { background: var(--background); }

        .alerts-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 1.5rem; }
        .alert-card {
          border-left: 4px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: transform 0.2s;
        }
        .alert-card:hover { transform: translateY(-4px); }
        .alert-card.severity-high { border-left-color: #ef4444; }
        .alert-card.severity-medium { border-left-color: #f59e0b; }
        .alert-card.severity-low { border-left-color: #3b82f6; }

        .alert-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .animal-info { display: flex; flex-direction: column; }
        .animal-info .tag { font-weight: 800; color: var(--secondary); font-size: 1.125rem; }
        .animal-info .type { font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; }
        
        .severity-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 800;
        }
        .severity-badge.high { background: #fee2e2; color: #b91c1c; }
        .severity-badge.medium { background: #fef3c7; color: #92400e; }
        .severity-badge.low { background: #e0f2fe; color: #0369a1; }

        .alert-message { font-size: 0.9375rem; color: var(--text); line-height: 1.6; }
        
        .action-box {
          margin-top: auto;
          background: #f8fafc;
          padding: 1rem;
          border-radius: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .recommendation { display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.875rem; color: var(--text-muted); }
        .recommendation strong { color: var(--secondary); }
        .btn-sm { padding: 0.4rem 0.75rem; font-size: 0.8125rem; }

        .empty-health-state, .placeholder-section {
          padding: 4rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .empty-health-state h3, .placeholder-section h3 { font-size: 1.5rem; font-weight: 700; color: var(--secondary); }
        .empty-health-state p, .placeholder-section p { color: var(--text-muted); }

        .loading-state { text-align: center; padding: 4rem; color: var(--text-muted); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default HealthCenter;
