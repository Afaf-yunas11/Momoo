import { useState } from 'react';
import { animalService } from '../../api/services/animalService';
import { Loader2 } from 'lucide-react';

const AnimalForm = ({ animal, onSuccess, onCancel }) => {
  const isEdit = !!animal;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState(animal || {
    tagNumber: '',
    name: '',
    breed: '',
    dateOfBirth: '',
    status: 'HEALTHY',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isEdit) {
        await animalService.updateAnimal(animal.id, formData);
      } else {
        await animalService.createAnimal(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save animal. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animal-form">
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-grid">
        <div className="form-group">
          <label>Tag Number</label>
          <input 
            type="text" 
            required 
            value={formData.tagNumber}
            onChange={(e) => setFormData({...formData, tagNumber: e.target.value})}
            placeholder="e.g. COW-001"
          />
        </div>

        <div className="form-group">
          <label>Name</label>
          <input 
            type="text" 
            required 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="e.g. Bessie"
          />
        </div>

        <div className="form-group">
          <label>Breed</label>
          <input 
            type="text" 
            required 
            value={formData.breed}
            onChange={(e) => setFormData({...formData, breed: e.target.value})}
            placeholder="e.g. Holstein"
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select 
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
          >
            <option value="LACTATING">Lactating</option>
            <option value="DRY">Dry</option>
            <option value="PREGNANT">Pregnant</option>
            <option value="SICK">Sick</option>
            <option value="CULLED">Culled</option>
          </select>
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input 
            type="date" 
            required 
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
          />
        </div>
      </div>

      <div className="form-group full-width">
        <label>Notes</label>
        <textarea 
          rows="3"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Additional details..."
        ></textarea>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-outline">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : (isEdit ? 'Update Animal' : 'Register Animal')}
        </button>
      </div>

      <style jsx>{`
        .animal-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-size: 0.875rem; font-weight: 600; color: var(--text); }
        .form-group input, .form-group select, .form-group textarea {
          padding: 0.625rem 0.875rem;
          border-radius: 0.5rem;
          border: 1px solid var(--border);
          font-size: 0.875rem;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
        .full-width { grid-column: span 2; }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }
        .error-message {
          padding: 0.75rem;
          background: #fee2e2;
          color: #991b1b;
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </form>
  );
};

export default AnimalForm;
