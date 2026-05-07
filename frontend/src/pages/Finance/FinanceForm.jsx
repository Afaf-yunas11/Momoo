import { useState } from 'react';
import { financeService } from '../../api/services/financeService';
import { Loader2, X } from 'lucide-react';

const FinanceForm = ({ type, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    category: type === 'revenue' ? 'MILK_SALES' : 'FEED',
    amountPkr: '',
    buyerName: '',
    vendor: '',
    recordDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (type === 'revenue') {
        await financeService.addRevenue(formData);
      } else {
        await financeService.addExpense(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-slideUp">
        <div className="modal-header">
          <h3>Add New {type === 'revenue' ? 'Revenue' : 'Expense'}</h3>
          <button onClick={onCancel} className="close-btn"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message mb-4">{error}</div>}
          
          <div className="form-grid">
            <div className="form-group">
              <label>Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                {type === 'revenue' ? (
                  <>
                    <option value="MILK_SALES">Milk Sales</option>
                    <option value="LIVESTOCK_SALES">Livestock Sales</option>
                    <option value="MANURE_SALES">Manure Sales</option>
                    <option value="OTHER">Other</option>
                  </>
                ) : (
                  <>
                    <option value="FEED">Feed & Silage</option>
                    <option value="MEDICAL">Medical & Vet</option>
                    <option value="SALARY">Staff Salaries</option>
                    <option value="UTILITIES">Utilities</option>
                    <option value="EQUIPMENT">Equipment Maintenance</option>
                    <option value="OTHER">Other</option>
                  </>
                )}
              </select>
            </div>

            <div className="form-group">
              <label>Amount (PKR)</label>
              <input 
                type="number" 
                required 
                value={formData.amountPkr}
                onChange={(e) => setFormData({...formData, amountPkr: e.target.value})}
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label>{type === 'revenue' ? 'Buyer Name' : 'Vendor Name'}</label>
              <input 
                type="text" 
                required 
                value={type === 'revenue' ? formData.buyerName : formData.vendor}
                onChange={(e) => setFormData({
                  ...formData, 
                  [type === 'revenue' ? 'buyerName' : 'vendor']: e.target.value
                })}
                placeholder="e.g. Nestle Pakistan"
              />
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
          </div>

          <div className="form-group mt-4">
            <label>Notes</label>
            <textarea 
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Optional details..."
            ></textarea>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="btn btn-outline" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Save Record'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        .modal-content {
          background: white;
          width: 100%;
          max-width: 600px;
          border-radius: 1.25rem;
          padding: 2rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .modal-header h3 { font-size: 1.25rem; font-weight: 800; color: var(--secondary); }
        .close-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; }
        
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-size: 0.875rem; font-weight: 700; color: var(--text); }
        .form-group input, .form-group select, .form-group textarea {
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
          font-size: 0.875rem;
          background: #f8fafc;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          border-color: var(--primary);
          outline: none;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }
        
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }
        
        .error-message {
          padding: 0.75rem 1rem;
          background: #fef2f2;
          border: 1px solid #fee2e2;
          color: #dc2626;
          border-radius: 0.75rem;
          font-size: 0.875rem;
        }
        
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default FinanceForm;
