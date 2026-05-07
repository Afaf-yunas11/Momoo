import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { animalService } from '../../api/services/animalService';
import { 
  ArrowLeft, 
  Sparkles, 
  LineChart, 
  Scale, 
  Calendar,
  Activity,
  Loader2,
  TrendingUp,
  AlertCircle,
  Plus
} from 'lucide-react';

const AnimalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [weights, setWeights] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchingInsights, setFetchingInsights] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const [animalData, weightsData] = await Promise.all([
        animalService.getAnimal(id),
        animalService.getWeightHistory(id)
      ]);
      setAnimal(animalData);
      setWeights(weightsData);
    } catch (error) {
      console.error('Failed to fetch animal details', error);
    } finally {
      setLoading(false);
    }
  };

  const getInsights = async () => {
    setFetchingInsights(true);
    try {
      const data = await animalService.getAnimalInsights(id);
      setInsights(data);
    } catch (error) {
      console.error('Failed to fetch AI insights', error);
    } finally {
      setFetchingInsights(false);
    }
  };

  if (loading) return <div className="loading-state"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="animal-details">
      <button className="btn-back" onClick={() => navigate('/animals')}>
        <ArrowLeft size={18} /> Back to Herd
      </button>

      <div className="details-header">
        <div className="header-main">
          <h1>{animal.name}</h1>
          <div className="tag-badges">
            <span className="tag-number">#{animal.tagNumber}</span>
            <span className={`badge ${animal.status === 'LACTATING' ? 'badge-success' : 'badge-info'}`}>
              {animal.status}
            </span>
          </div>
        </div>
        <button 
          className="btn btn-primary ai-insight-btn" 
          onClick={getInsights}
          disabled={fetchingInsights}
        >
          {fetchingInsights ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
          <span>{insights ? 'Refresh AI Insights' : 'Get AI Insights'}</span>
        </button>
      </div>

      <div className="details-grid">
        <div className="card basic-info">
          <h3>Basic Information</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="label">Breed</span>
              <span className="value">{animal.breed}</span>
            </div>
            <div className="info-item">
              <span className="label">Date of Birth</span>
              <span className="value">{animal.dateOfBirth}</span>
            </div>
            <div className="info-item">
              <span className="label">Purchase Date</span>
              <span className="value">{animal.purchaseDate || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="label">Notes</span>
              <span className="value">{animal.notes || 'No notes available.'}</span>
            </div>
          </div>
        </div>

        {insights && (
          <div className="card insight-card glass-card">
            <div className="insight-header">
              <Sparkles size={20} />
              <h3>AI Health & Productivity Analysis</h3>
            </div>
            <div className="insights-grid">
              <div className="insight-stat">
                <span className="label">Disease Risk</span>
                <div className="risk-meter">
                  <div className="meter-bar" style={{ width: `${insights.diseaseRiskScore}%` }}></div>
                </div>
                <span className="risk-value">{insights.diseaseRiskScore}% (Low Risk)</span>
              </div>
              <div className="insight-stat">
                <span className="label">Breeding Window</span>
                <span className="insight-value">{insights.breedingWindow}</span>
              </div>
              <div className="insight-stat">
                <span className="label">Recommendation</span>
                <span className="insight-badge keep">{insights.profitRecommendation}</span>
              </div>
            </div>
          </div>
        )}

        <div className="card weight-history">
          <div className="card-header">
            <h3>Weight History</h3>
            <button className="btn-text"><Plus size={14} /> Add Weight</button>
          </div>
          <div className="weight-list">
            {weights.length === 0 ? (
              <p className="text-muted">No weight records found.</p>
            ) : weights.map(w => (
              <div key={w.id} className="weight-item">
                <Scale size={16} />
                <span className="date">{w.recordedDate}</span>
                <span className="weight">{w.weightKg} kg</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalDetails;
