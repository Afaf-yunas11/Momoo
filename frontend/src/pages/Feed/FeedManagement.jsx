import { useState, useEffect } from 'react';
import { feedService } from '../../api/services/feedService';
import { animalService } from '../../api/services/animalService';
import { 
  Beef, 
  Sparkles, 
  Package, 
  Plus, 
  History,
  Scale,
  Loader2,
  CheckCircle2
} from 'lucide-react';

const FeedManagement = () => {
  const [animals, setAnimals] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState('');

  useEffect(() => {
    fetchFeedData();
  }, []);

  const fetchFeedData = async () => {
    setLoading(true);
    try {
      const [animalsData, inventoryData] = await Promise.all([
        animalService.getAnimals({ size: 100 }),
        feedService.getInventory()
      ]);
      setAnimals(animalsData.content);
      setInventory(inventoryData);
    } catch (error) {
      console.error('Failed to fetch feed data', error);
    } finally {
      setLoading(false);
    }
  };

  const getAiRecommendation = async () => {
    if (!selectedAnimal) return;
    setLoadingAi(true);
    try {
      const data = await feedService.getAiRecommendation(selectedAnimal);
      setRecommendation(data);
    } catch (error) {
      console.error('Failed to get AI recommendation', error);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="feed-page">
      <div className="page-header">
        <h1>Feed & Nutrition</h1>
        <p>Optimize herd nutrition with AI-calculated feed plans.</p>
      </div>

      <div className="feed-grid">
        <div className="card ai-recommendation-card">
          <div className="card-header">
            <Sparkles className="text-primary" size={20} />
            <h3>Smart Recommendations</h3>
          </div>
          <div className="recommendation-content">
            <div className="form-group">
              <label>Select Animal to Optimize</label>
              <select 
                value={selectedAnimal}
                onChange={(e) => setSelectedAnimal(e.target.value)}
              >
                <option value="">Choose a cow...</option>
                {animals.map(a => (
                  <option key={a.id} value={a.id}>{a.tagNumber} - {a.name}</option>
                ))}
              </select>
            </div>
            <button 
              className="btn btn-primary full-width"
              disabled={!selectedAnimal || loadingAi}
              onClick={getAiRecommendation}
            >
              {loadingAi ? <Loader2 className="animate-spin" /> : 'Calculate Optimal Feed Plan'}
            </button>

            {recommendation && (
              <div className="result-box animate-fadeIn">
                <div className="result-header">
                  <CheckCircle2 size={16} className="text-primary" />
                  <span>AI Plan Generated</span>
                </div>
                <div className="result-stats">
                  <div className="res-stat">
                    <span className="label">Recommended Feed</span>
                    <span className="value">{recommendation.recommendedKg || recommendation.feedRecommendationKg} kg/day</span>
                  </div>
                  <div className="res-stat">
                    <span className="label">Nutrient Focus</span>
                    <span className="value">High Protein</span>
                  </div>
                </div>
                <button className="btn btn-outline btn-sm full-width mt-4">
                  Apply to Daily Record
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="inventory-section">
          <div className="card inventory-card">
            <div className="card-header">
              <Package className="text-primary" size={20} />
              <h3>Stock Inventory</h3>
            </div>
            <div className="inventory-list">
              {loading ? (
                <div className="text-center py-4"><Loader2 className="animate-spin" /></div>
              ) : inventory.length === 0 ? (
                <p className="text-muted">No inventory data available.</p>
              ) : inventory.map(item => (
                <div key={item.id} className="inventory-item">
                  <div className="item-info">
                    <strong>{item.feedType?.name || 'Bulk Feed'}</strong>
                    <span>Last Refill: {item.lastRestockedDate || 'N/A'}</span>
                  </div>
                  <div className="item-stock">
                    <span className={`stock-badge ${item.quantityKg < 500 ? 'low' : ''}`}>
                      {item.quantityKg} kg
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .feed-page { display: flex; flex-direction: column; gap: 2rem; }
        .page-header h1 { font-size: 1.875rem; font-weight: 800; color: var(--secondary); }
        .page-header p { color: var(--text-muted); }

        .feed-grid {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 2rem;
        }

        .ai-recommendation-card { border: 1px solid #b9f6ca; background: #f0fdf4; }
        .card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }
        .card-header h3 { font-size: 1.125rem; font-weight: 700; color: var(--secondary); }

        .recommendation-content { display: flex; flex-direction: column; gap: 1.5rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-size: 0.875rem; font-weight: 600; color: var(--text); }
        .form-group select {
          padding: 0.625rem 0.875rem;
          border-radius: 0.5rem;
          border: 1px solid var(--border);
          font-size: 0.875rem;
          background: white;
        }

        .result-box {
          margin-top: 1rem;
          background: white;
          padding: 1.25rem;
          border-radius: 1rem;
          border: 1px solid #b9f6ca;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .result-header { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: 700; color: #059669; text-transform: uppercase; margin-bottom: 1rem; }
        .result-stats { display: flex; flex-direction: column; gap: 1rem; }
        .res-stat { display: flex; justify-content: space-between; align-items: center; }
        .res-stat .label { font-size: 0.875rem; color: var(--text-muted); }
        .res-stat .value { font-weight: 700; color: var(--secondary); }

        .inventory-list { display: flex; flex-direction: column; gap: 1rem; }
        .inventory-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
        }
        .item-info { display: flex; flex-direction: column; }
        .item-info strong { font-size: 0.9375rem; color: var(--secondary); }
        .item-info span { font-size: 0.75rem; color: var(--text-muted); }
        
        .stock-badge {
          padding: 0.375rem 0.75rem;
          background: #dcfce7;
          color: #059669;
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 700;
        }
        .stock-badge.low { background: #fee2e2; color: #dc2626; }

        .full-width { width: 100%; }
        .mt-4 { margin-top: 1rem; }
        .text-center { text-align: center; }
        .py-4 { padding: 1rem 0; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default FeedManagement;
