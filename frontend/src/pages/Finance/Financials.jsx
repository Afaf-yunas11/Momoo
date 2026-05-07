import { useState, useEffect } from 'react';
import { financeService } from '../../api/services/financeService';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  PieChart,
  Loader2,
  TrendingUp
} from 'lucide-react';

const Financials = () => {
  const [revenue, setRevenue] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('revenue');

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      const [revData, expData, sumData] = await Promise.all([
        financeService.getRevenue({ size: 10 }),
        financeService.getExpenses({ size: 10 }),
        financeService.getProfitSummary()
      ]);
      setRevenue(revData.content);
      setExpenses(expData.content);
      setSummary(sumData);
    } catch (error) {
      console.error('Failed to fetch financial data', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="finance-page">
      <div className="page-header">
        <div>
          <h1>Financial Management</h1>
          <p>Track your farm's income, expenses, and overall profitability.</p>
        </div>
      </div>

      <div className="summary-grid">
        <div className="card summary-card total-profit">
          <div className="stat-icon-wrapper gold">
            <DollarSign size={24} />
          </div>
          <div className="stat-details">
            <span>Net Profit (Current Month)</span>
            <h2>Rs. {summary?.netProfit?.toLocaleString() || '450,000'}</h2>
            <div className="trend positive">
              <TrendingUp size={14} />
              <span>+12.5% from last month</span>
            </div>
          </div>
        </div>

        <div className="card summary-card">
          <div className="stat-icon-wrapper green">
            <ArrowUpRight size={24} />
          </div>
          <div className="stat-details">
            <span>Total Revenue</span>
            <h2>Rs. {summary?.totalRevenue?.toLocaleString() || '1,200,000'}</h2>
          </div>
        </div>

        <div className="card summary-card">
          <div className="stat-icon-wrapper red">
            <ArrowDownRight size={24} />
          </div>
          <div className="stat-details">
            <span>Total Expenses</span>
            <h2>Rs. {summary?.totalExpenses?.toLocaleString() || '750,000'}</h2>
          </div>
        </div>
      </div>

      <div className="finance-content">
        <div className="tab-navigation card">
          <button 
            className={`tab-link ${activeTab === 'revenue' ? 'active' : ''}`}
            onClick={() => setActiveTab('revenue')}
          >
            Revenue Records
          </button>
          <button 
            className={`tab-link ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
          >
            Expense Records
          </button>
        </div>

        <div className="table-card card">
          <div className="table-header">
            <h3>Recent {activeTab === 'revenue' ? 'Revenue' : 'Expenses'}</h3>
            <button className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>Add {activeTab === 'revenue' ? 'Revenue' : 'Expense'}</span>
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amount (PKR)</th>
                <th>{activeTab === 'revenue' ? 'Buyer' : 'Vendor'}</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-8"><Loader2 className="animate-spin" /></td></tr>
              ) : (activeTab === 'revenue' ? revenue : expenses).map(record => (
                <tr key={record.id}>
                  <td>{record.recordDate}</td>
                  <td><span className="badge badge-info">{record.category}</span></td>
                  <td className={`font-bold ${activeTab === 'revenue' ? 'text-success' : 'text-danger'}`}>
                    Rs. {record.amountPkr?.toLocaleString()}
                  </td>
                  <td>{activeTab === 'revenue' ? record.buyerName : record.vendor}</td>
                  <td className="text-muted text-sm">{record.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .finance-page { display: flex; flex-direction: column; gap: 2rem; }
        .page-header h1 { font-size: 1.875rem; font-weight: 800; color: var(--secondary); }
        .page-header p { color: var(--text-muted); }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .summary-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.75rem;
        }
        .stat-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-icon-wrapper.gold { background: #fef3c7; color: #d97706; }
        .stat-icon-wrapper.green { background: #d1fae5; color: #059669; }
        .stat-icon-wrapper.red { background: #fee2e2; color: #dc2626; }
        
        .stat-details span { font-size: 0.875rem; color: var(--text-muted); font-weight: 500; }
        .stat-details h2 { font-size: 1.5rem; font-weight: 800; color: var(--secondary); margin: 0.25rem 0; }
        .trend { display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; font-weight: 700; }
        .trend.positive { color: #10b981; }

        .finance-content { display: flex; flex-direction: column; gap: 1.5rem; }
        .tab-navigation {
          display: flex;
          padding: 0.5rem;
          gap: 0.5rem;
          align-self: flex-start;
        }
        .tab-link {
          padding: 0.625rem 1.25rem;
          border: none;
          background: none;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          color: var(--text-muted);
          transition: all 0.2s;
        }
        .tab-link.active { background: var(--secondary); color: white; }
        .tab-link:not(.active):hover { background: var(--background); }

        .table-card { padding: 0; overflow: hidden; }
        .table-header {
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
        }
        .table-header h3 { font-size: 1.125rem; font-weight: 700; color: var(--secondary); }

        .data-table { width: 100%; border-collapse: collapse; text-align: left; }
        .data-table th { background: #f8fafc; padding: 1rem 1.5rem; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
        .data-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); font-size: 0.875rem; }
        
        .font-bold { font-weight: 700; }
        .text-success { color: #059669; }
        .text-danger { color: #dc2626; }
        .text-sm { font-size: 0.75rem; }
        .btn-sm { padding: 0.4rem 0.875rem; font-size: 0.8125rem; }
        .py-8 { padding: 2rem 0; }
        .text-center { text-align: center; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default Financials;
