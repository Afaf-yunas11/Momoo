import { useState } from 'react';
import { feedService } from '../../api/services/feedService';
import { Loader2, X } from 'lucide-react';

const InventoryForm = ({ item, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    quantityKg: item.quantityKg,
    minimumThreshold: item.minimumThreshold || 500,
    lastRestockedDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await feedService.updateInventory(item.id, formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update inventory.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-slideUp">
        <div className="modal-header">
          <h3>Update Stock: {item.feedType?.name || 'Bulk Feed'}</h3>
          <button onClick={onCancel} className="close-btn"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message mb-4">{error}</div>}
          
          <div className="form-grid">
            <div className="form-group">
              <label>Current Quantity (kg)</label>
              <input 
                type="number" 
                required 
                value={formData.quantityKg}
                onChange={(e) => setFormData({...formData, quantityKg: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Min. Threshold (kg)</label>
              <input 
                type="number" 
                required 
                value={formData.minimumThreshold}
                onChange={(e) => setFormData({...formData, minimumThreshold: e.target.value})}
              />
            </div>

            <div className="form-group full-width">
              <label>Restock Date</label>
              <input 
                type="date" 
                required 
                value={formData.lastRestockedDate}
                onChange={(e) => setFormData({...formData, lastRestockedDate: e.target.value})}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="btn btn-outline" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Update Stock'}
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
          max-width: 450px;
          border-radius: 1.25rem;
          padding: 2rem;
        }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .modal-header h3 { font-size: 1.125rem; font-weight: 800; color: var(--secondary); }
        .close-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; }
        
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .full-width { grid-column: span 2; }
        .form-group label { font-size: 0.875rem; font-weight: 700; color: var(--text); }
        .form-group input {
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
          font-size: 0.875rem;
          background: #f8fafc;
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

export default InventoryForm;
