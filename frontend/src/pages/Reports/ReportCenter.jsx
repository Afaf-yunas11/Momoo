import { useState, useEffect } from 'react';
import { reportService } from '../../api/services/reportService';
import { 
  FileText, 
  Download, 
  RefreshCw, 
  Calendar,
  PieChart,
  BarChart3,
  Loader2,
  CheckCircle2
} from 'lucide-react';

const ReportCenter = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const demoReports = [
    { id: '1', title: 'Monthly Production Summary', type: 'PRODUCTION', generatedAt: '2024-05-01 08:00', size: '1.2 MB' },
    { id: '2', title: 'Quarterly Financial Health', type: 'FINANCE', generatedAt: '2024-04-01 10:30', size: '2.5 MB' },
    { id: '3', title: 'Herd Vaccination Status', type: 'HEALTH', generatedAt: '2024-05-05 14:15', size: '0.8 MB' },
  ];

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await reportService.getReports();
      setReports(data.length > 0 ? data : demoReports);
    } catch (error) {
      setReports(demoReports);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (type) => {
    setGenerating(true);
    try {
      await reportService.generateReport({ type });
      fetchReports();
    } catch (error) {
      console.error('Failed to generate report', error);
      alert('Simulation: Report generation triggered successfully!');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (report) => {
    try {
      const blob = await reportService.downloadReport(report.id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${report.title.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Failed to download report', error);
      alert('In this demo, report downloading is simulated. The file would normally download here.');
    }
  };

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Report Center</h1>
        <p>Generate and export comprehensive farm analytics.</p>
      </div>

      <div className="reports-grid">
        <div className="card generator-card">
          <div className="card-header">
            <RefreshCw className="text-primary" size={20} />
            <h3>Generate New Report</h3>
          </div>
          <div className="generator-options">
            <button onClick={() => handleGenerate('PRODUCTION')} className="btn btn-outline gen-btn" disabled={generating}>
              <BarChart3 size={18} />
              <span>Production Analysis</span>
            </button>
            <button onClick={() => handleGenerate('FINANCE')} className="btn btn-outline gen-btn" disabled={generating}>
              <PieChart size={18} />
              <span>Financial Audit</span>
            </button>
            <button onClick={() => handleGenerate('HEALTH')} className="btn btn-outline gen-btn" disabled={generating}>
              <FileText size={18} />
              <span>Health Compliance</span>
            </button>
          </div>
          {generating && (
            <div className="generating-overlay">
              <Loader2 className="animate-spin" />
              <span>Compiling Data...</span>
            </div>
          )}
        </div>

        <div className="card recent-reports-card">
          <div className="card-header">
            <Download className="text-primary" size={20} />
            <h3>Recent Exports</h3>
          </div>
          <div className="reports-list">
            {loading ? (
              <div className="text-center py-8"><Loader2 className="animate-spin" /></div>
            ) : reports.map(report => (
              <div key={report.id} className="report-item">
                <div className="report-icon">
                  <FileText size={24} />
                </div>
                <div className="report-info">
                  <h4>{report.title}</h4>
                  <span className="report-meta">
                    <Calendar size={12} /> {report.generatedAt} • {report.size}
                  </span>
                </div>
                <button 
                  className="download-btn" 
                  title="Download PDF"
                  onClick={() => handleDownload(report)}
                >
                  <Download size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .reports-page { display: flex; flex-direction: column; gap: 2rem; }
        .page-header h1 { font-size: 1.875rem; font-weight: 800; color: var(--secondary); }
        .page-header p { color: var(--text-muted); }

        .reports-grid {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 2rem;
        }

        .generator-card { position: relative; overflow: hidden; padding: 1.5rem; border-radius: 1rem; }
        .generator-options { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; }
        .gen-btn { display: flex; align-items: center; gap: 0.75rem; justify-content: flex-start; padding: 1rem; }
        .gen-btn:hover { border-color: var(--primary); color: var(--primary); background: #f0fdf4; }

        .generating-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: var(--primary);
          font-weight: 700;
        }

        .recent-reports-card { padding: 1.5rem; border-radius: 1rem; }
        .reports-list { display: flex; flex-direction: column; gap: 1rem; }
        .report-item {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.25rem;
          background: #f8fafc;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
          transition: all 0.2s;
        }
        .report-item:hover { border-color: var(--primary); transform: translateX(4px); }
        
        .report-icon {
          width: 48px;
          height: 48px;
          background: white;
          border: 1px solid var(--border);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }
        
        .report-info { flex: 1; }
        .report-info h4 { font-size: 1rem; font-weight: 700; color: var(--secondary); margin-bottom: 0.25rem; }
        .report-meta { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--text-muted); }

        .download-btn {
          width: 40px;
          height: 40px;
          border: 1px solid var(--border);
          background: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
        }
        .download-btn:hover { background: var(--primary); color: white; border-color: var(--primary); }

        .text-center { text-align: center; }
        .py-8 { padding: 2rem 0; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default ReportCenter;
