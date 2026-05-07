import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { animalService } from '../../api/services/animalService';
import Modal from '../../components/common/Modal';
import AnimalForm from './AnimalForm';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Edit2,
  Trash2
} from 'lucide-react';

const AnimalList = () => {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    fetchAnimals();
  }, [page, search]);

  const fetchAnimals = async () => {
    setLoading(true);
    try {
      const data = await animalService.getAnimals({ 
        page, 
        size: 10,
        search: search || undefined
      });
      setAnimals(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch animals', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      'LACTATING': 'badge-success',
      'DRY': 'badge-info',
      'PREGNANT': 'badge-warning',
      'SICK': 'badge-danger',
      'CULLED': 'badge-danger'
    };
    return <span className={`badge ${classes[status] || 'badge-info'}`}>{status}</span>;
  };

  const handleEdit = (animal) => {
    setEditingAnimal(animal);
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this animal?')) {
      try {
        await animalService.deleteAnimal(id);
        fetchAnimals();
      } catch (error) {
        console.error('Failed to delete animal', error);
      }
    }
    setActiveDropdown(null);
  };

  return (
    <div className="animal-list-page">
      <div className="page-header">
        <div>
          <h1>Herd Management</h1>
          <p>Manage your livestock inventory and health records.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingAnimal(null); setIsModalOpen(true); }}>
          <Plus size={18} />
          <span>Register Animal</span>
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingAnimal ? 'Edit Animal' : 'Register New Animal'}
      >
        <AnimalForm 
          animal={editingAnimal}
          onSuccess={() => { setIsModalOpen(false); fetchAnimals(); }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <div className="card table-container">
        <div className="table-actions">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search by tag or name..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            />
          </div>
          <button className="btn btn-outline">
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Tag Number</th>
              <th>Name</th>
              <th>Breed</th>
              <th>Status</th>
              <th>Birth Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="loading-state">
                  <Loader2 className="animate-spin" />
                  <span>Loading herd data...</span>
                </td>
              </tr>
            ) : animals.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  No animals found. Start by registering your first cow!
                </td>
              </tr>
            ) : (
              animals.map((animal) => (
                <tr key={animal.id} onClick={() => navigate(`/animals/${animal.id}`)} className="clickable-row">
                  <td className="font-bold">{animal.tagNumber}</td>
                  <td>{animal.name}</td>
                  <td>{animal.breed}</td>
                  <td>{getStatusBadge(animal.status)}</td>
                  <td>{animal.dateOfBirth}</td>
                  <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="action-btn"
                      onClick={() => setActiveDropdown(activeDropdown === animal.id ? null : animal.id)}
                    >
                      <MoreVertical size={18} />
                    </button>
                    {activeDropdown === animal.id && (
                      <div className="dropdown-menu card">
                        <button onClick={() => handleEdit(animal)}>
                          <Edit2 size={14} /> Edit
                        </button>
                        <button onClick={() => handleDelete(animal.id)} className="text-danger">
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="pagination">
          <span className="pagination-info">
            Showing {animals.length} animals
          </span>
          <div className="pagination-controls">
            <button 
              className="btn btn-outline p-2" 
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="page-number">Page {page + 1} of {totalPages || 1}</span>
            <button 
              className="btn btn-outline p-2" 
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .page-header h1 { font-size: 1.875rem; font-weight: 800; color: var(--secondary); }
        .page-header p { color: var(--text-muted); }
        
        .table-container { padding: 0; overflow: hidden; }
        .table-actions {
          padding: 1.25rem 1.5rem;
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          border-bottom: 1px solid var(--border);
        }
        .search-box {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-box svg {
          position: absolute;
          left: 1rem;
          color: var(--text-muted);
        }
        .search-box input {
          width: 100%;
          max-width: 400px;
          padding: 0.625rem 1rem 0.625rem 2.75rem;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
          font-size: 0.875rem;
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .data-table th {
          background: #f8fafc;
          padding: 1rem 1.5rem;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }
        .data-table td {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border);
          font-size: 0.875rem;
          color: var(--text);
        }
        .data-table tr:hover { background: #fcfdfe; }
        .clickable-row { cursor: pointer; }
        .font-bold { font-weight: 700; color: var(--secondary); }
        
        .action-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.375rem;
        }
        .action-btn:hover { background: var(--background); color: var(--text); }
        
        .loading-state, .empty-state {
          padding: 4rem !important;
          text-align: center;
          color: var(--text-muted);
        }
        .loading-state { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        
        .pagination {
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8fafc;
        }
        .pagination-info { font-size: 0.875rem; color: var(--text-muted); }
        .pagination-controls { display: flex; align-items: center; gap: 1rem; }
        .page-number { font-size: 0.875rem; font-weight: 600; color: var(--text); }
        .p-2 { padding: 0.5rem; }
        
        .actions-cell { position: relative; }
        .dropdown-menu {
          position: absolute;
          right: 1.5rem;
          top: 3rem;
          z-index: 10;
          padding: 0.5rem;
          min-width: 120px;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .dropdown-menu button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          cursor: pointer;
          color: var(--text);
        }
        .dropdown-menu button:hover { background: var(--background); }
        .dropdown-menu button.text-danger { color: #ef4444; }
        .dropdown-menu button.text-danger:hover { background: #fee2e2; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default AnimalList;
