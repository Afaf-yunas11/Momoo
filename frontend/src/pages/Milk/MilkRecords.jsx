import { useState, useEffect } from 'react';
import { milkService } from '../../api/services/milkService';
import { animalService } from '../../api/services/animalService';
import { 
  Milk, 
  Plus, 
  Calendar, 
  TrendingUp,
  Droplets,
  Loader2
} from 'lucide-react';

const MilkRecords = () => {
  const [records, setRecords] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [summary, setSummary] = useState(null);

  const [formData, setFormData] = useState({
    animalId: '',
    recordDate: new Date().toISOString().split('T')[0],
    session: 'BOTH',
    morningYield: 0,
    eveningYield: 0,
    fatPct: 3.5,
    proteinPct: 3.2
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recordsData, animalsData, summaryData] = await Promise.all([
        milkService.getRecords({ size: 10 }),
        animalService.getAnimals({ size: 100 }), // Get all for dropdown
        milkService.getSummary()
      ]);
      setRecords(recordsData.content);
      setAnimals(animalsData.content);
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to fetch milk data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await milkService.createRecord(formData);
      setFormData({ ...formData, animalId: '', morningYield: 0, eveningYield: 0 });
      fetchData();
    } catch (error) {
      console.error('Failed to save record', error);
      alert('Error saving record. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="milk-page">
      <div className="page-header">
        <h1>Milk Production</h1>
        <p>Track daily yields and quality metrics.</p>
      </div>

      <div className="milk-grid">
        <div className="entry-section">
          <div className="card">
            <div className="card-header">
              <Plus size={20} className="text-primary" />
              <h3>Add Daily Record</h3>
            </div>
            <form onSubmit={handleSubmit} className="entry-form">
              <div className="form-group">
                <label>Select Animal</label>
                <select 
                  required 
                  value={formData.animalId}
                  onChange={(e) => setFormData({...formData, animalId: e.target.value})}
                >
                  <option value="">Choose a cow...</option>
                  {animals.map(a => (
                    <option key={a.id} value={a.id}>{a.tagNumber} - {a.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  required 
                  value={formData.recordDate}
                  onChange={(e) => setFormData({...formData, recordDate: e.target.value})}
                />
              </div>

              <div className="yield-inputs">
                <div className="form-group">
                  <label>Morning (L)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    required 
                    value={formData.morningYield}
                    onChange={(e) => setFormData({...formData, morningYield: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Evening (L)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    required 
                    value={formData.eveningYield}
                    onChange={(e) => setFormData({...formData, eveningYield: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="quality-inputs">
                <div className="form-group">
                  <label>Fat %</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={formData.fatPct}
                    onChange={(e) => setFormData({...formData, fatPct: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Protein %</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={formData.proteinPct}
                    onChange={(e) => setFormData({...formData, proteinPct: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary full-width" disabled={submitting}>
                {submitting ? <Loader2 className="animate-spin" /> : 'Save Record'}
              </button>
            </form>
          </div>
        </div>

        <div className="history-section">
          <div className="summary-cards">
            <div className="card summary-card green">
              <TrendingUp size={24} />
              <div className="summary-info">
                <span>Total Yield (Today)</span>
                <strong>{summary?.dailyTotal || '0'} L</strong>
              </div>
            </div>
            <div className="card summary-card blue">
              <Droplets size={24} />
              <div className="summary-info">
                <span>Avg. Fat %</span>
                <strong>{summary?.avgFat || '3.5'}%</strong>
              </div>
            </div>
          </div>

          <div className="card table-card">
            <div className="card-header">
              <h3>Recent Records</h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Animal</th>
                  <th>Total (L)</th>
                  <th>Fat/Prot</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>
                ) : records.map(r => (
                  <tr key={r.id}>
                    <td>{r.recordDate}</td>
                    <td><span className="badge-info badge">{r.animalTag}</span></td>
                    <td className="font-bold">{r.totalYield} L</td>
                    <td className="text-muted">{r.fatPct}% / {r.proteinPct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .milk-page { display: flex; flex-direction: column; gap: 2rem; }
        .page-header h1 { font-size: 1.875rem; font-weight: 800; color: var(--secondary); }
        .page-header p { color: var(--text-muted); }

        .milk-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .milk-grid {
            grid-template-columns: 350px 1fr;
          }
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }
        .card-header h3 { font-size: 1.125rem; font-weight: 700; color: var(--secondary); }

        .entry-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-size: 0.875rem; font-weight: 600; color: var(--text); }
        .form-group input, .form-group select {
          padding: 0.625rem 0.875rem;
          border-radius: 0.5rem;
          border: 1px solid var(--border);
          font-size: 0.875rem;
        }
        
        .yield-inputs, .quality-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .summary-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .summary-card.green { color: #10b981; }
        .summary-card.blue { color: #3b82f6; }
        .summary-info { display: flex; flex-direction: column; }
        .summary-info span { font-size: 0.875rem; color: var(--text-muted); }
        .summary-info strong { font-size: 1.25rem; font-weight: 700; color: var(--secondary); }

        .data-table { width: 100%; border-collapse: collapse; text-align: left; }
        .data-table th { padding: 0.75rem 1rem; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; border-bottom: 1px solid var(--border); }
        .data-table td { padding: 1rem; border-bottom: 1px solid var(--border); font-size: 0.875rem; }
        .full-width { width: 100%; }
        .font-bold { font-weight: 700; color: var(--primary); }
        .text-center { text-align: center; }
        .py-4 { padding: 1rem 0; }
        
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default MilkRecords;
