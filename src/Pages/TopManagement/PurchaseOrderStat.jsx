import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, Package, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import './PurchaseOrderStat.css';

const PurchaseOrderStat = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/received-purchase-orders/anomaly-statistics');
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError('Failed to load statistics');
      }
    } catch (err) {
      setError('Error fetching data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="po-anomaly-stats-container">
        <div className="po-anomaly-loading">
          <div className="po-anomaly-spinner"></div>
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="po-anomaly-stats-container">
        <div className="po-anomaly-error">
          <AlertCircle size={48} />
          <p>{error}</p>
          <button onClick={fetchStatistics} className="po-anomaly-retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  const COLORS = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];

  // Prepare pie chart data for anomaly breakdown
  const anomalyPieData = [
    { name: 'Late Deliveries', value: data.anomaly_breakdown.late_deliveries },
    { name: 'Quality Issues', value: data.anomaly_breakdown.quality_issues },
    { name: 'Shortage Issues', value: data.anomaly_breakdown.shortage_issues },
    { name: 'Good Orders', value: data.anomaly_breakdown.on_time_good_quality }
  ];

  // Prepare quality distribution pie data
  const qualityPieData = Object.entries(data.quality_distribution).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: value
  }));

  return (
    <div className="po-anomaly-stats-container">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/warehouse-manager')}
        className="po-anomaly-back-btn"
      >
        <ArrowLeft size={20} />
        Go Back
      </button>

      {/* Header */}
      <div className="po-anomaly-header">
        <h1 className="po-anomaly-title">Purchase Order Anomaly Detection Dashboard</h1>
        <p className="po-anomaly-subtitle">Management Overview & Supplier Performance Analysis</p>
      </div>

      {/* Overview Cards */}
      <div className="po-anomaly-cards-grid">
        <div className="po-anomaly-card po-anomaly-card-blue">
          <div className="po-anomaly-card-icon">
            <Package size={32} />
          </div>
          <div className="po-anomaly-card-content">
            <p className="po-anomaly-card-label">Total Orders</p>
            <h2 className="po-anomaly-card-value">{data.overview.total_orders}</h2>
          </div>
        </div>

        <div className="po-anomaly-card po-anomaly-card-warning">
          <div className="po-anomaly-card-icon">
            <Clock size={32} />
          </div>
          <div className="po-anomaly-card-content">
            <p className="po-anomaly-card-label">Late Deliveries</p>
            <h2 className="po-anomaly-card-value">{data.overview.late_deliveries}</h2>
            <p className="po-anomaly-card-percentage">{data.overview.late_delivery_rate}%</p>
          </div>
        </div>

        <div className="po-anomaly-card po-anomaly-card-danger">
          <div className="po-anomaly-card-icon">
            <AlertTriangle size={32} />
          </div>
          <div className="po-anomaly-card-content">
            <p className="po-anomaly-card-label">Quality Issues</p>
            <h2 className="po-anomaly-card-value">{data.overview.quality_issues}</h2>
            <p className="po-anomaly-card-percentage">{data.overview.quality_issue_rate}%</p>
          </div>
        </div>

        <div className="po-anomaly-card po-anomaly-card-loss">
          <div className="po-anomaly-card-icon">
            <TrendingDown size={32} />
          </div>
          <div className="po-anomaly-card-content">
            <p className="po-anomaly-card-label">Total Loss Amount</p>
            <h2 className="po-anomaly-card-value">Rs {data.overview.total_loss_amount.toLocaleString()}</h2>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="po-anomaly-charts-row">
        {/* Anomaly Breakdown Pie Chart */}
        <div className="po-anomaly-chart-card">
          <h3 className="po-anomaly-chart-title">Anomaly Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={anomalyPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {anomalyPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Quality Status Distribution */}
        <div className="po-anomaly-chart-card">
          <h3 className="po-anomaly-chart-title">Quality Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={qualityPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {qualityPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="po-anomaly-chart-card po-anomaly-full-width">
        <h3 className="po-anomaly-chart-title">6-Month Anomaly Trend Analysis</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data.monthly_trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total_orders" stroke="#1e40af" name="Total Orders" strokeWidth={2} />
            <Line type="monotone" dataKey="late_orders" stroke="#f59e0b" name="Late Orders" strokeWidth={2} />
            <Line type="monotone" dataKey="shortage_orders" stroke="#ef4444" name="Shortage Orders" strokeWidth={2} />
            <Line type="monotone" dataKey="quality_issues" stroke="#8b5cf6" name="Quality Issues" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Overall Supplier Metrics */}
      <div className="po-anomaly-supplier-overview">
        <h3 className="po-anomaly-section-title">Overall Supplier Performance Metrics</h3>
        <div className="po-anomaly-cards-grid">
          <div className="po-anomaly-metric-card">
            <p className="po-anomaly-metric-label">Total Suppliers</p>
            <h3 className="po-anomaly-metric-value">{data.overall_supplier_metrics.total_suppliers}</h3>
          </div>
          <div className="po-anomaly-metric-card">
            <p className="po-anomaly-metric-label">Avg On-Time Rate</p>
            <h3 className="po-anomaly-metric-value">{data.overall_supplier_metrics.avg_on_time_rate}%</h3>
          </div>
          <div className="po-anomaly-metric-card">
            <p className="po-anomaly-metric-label">Avg Quality Rate</p>
            <h3 className="po-anomaly-metric-value">{data.overall_supplier_metrics.avg_quality_rate}%</h3>
          </div>
          <div className="po-anomaly-metric-card">
            <p className="po-anomaly-metric-label">Avg Fulfillment Rate</p>
            <h3 className="po-anomaly-metric-value">{data.overall_supplier_metrics.avg_fulfillment_rate}%</h3>
          </div>
        </div>
      </div>

      {/* Supplier Performance Table */}
      <div className="po-anomaly-chart-card po-anomaly-full-width">
        <h3 className="po-anomaly-chart-title">Detailed Supplier Performance Analysis</h3>
        <div className="po-anomaly-table-wrapper">
          <table className="po-anomaly-table">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Contact</th>
                <th>Total Orders</th>
                <th>On-Time Rate</th>
                <th>Quality Rate</th>
                <th>Fulfillment Rate</th>
                <th>Late Deliveries</th>
                <th>Avg Late Days</th>
                <th>Total Loss ($)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.supplier_performance.map((supplier) => (
                <tr key={supplier.supplier_id}>
                  <td className="po-anomaly-supplier-name">{supplier.supplier_name}</td>
                  <td className="po-anomaly-supplier-contact">
                    <div>{supplier.supplier_email}</div>
                    <div className="po-anomaly-phone">{supplier.supplier_mobile}</div>
                    <div className="po-anomaly-location">{supplier.supplier_location}</div>
                  </td>
                  <td>{supplier.total_orders}</td>
                  <td>
                    <span className={`po-anomaly-badge ${supplier.on_time_delivery_rate >= 80 ? 'po-anomaly-badge-success' : supplier.on_time_delivery_rate >= 60 ? 'po-anomaly-badge-warning' : 'po-anomaly-badge-danger'}`}>
                      {supplier.on_time_delivery_rate}%
                    </span>
                  </td>
                  <td>
                    <span className={`po-anomaly-badge ${supplier.quality_rate >= 90 ? 'po-anomaly-badge-success' : supplier.quality_rate >= 70 ? 'po-anomaly-badge-warning' : 'po-anomaly-badge-danger'}`}>
                      {supplier.quality_rate}%
                    </span>
                  </td>
                  <td>
                    <span className={`po-anomaly-badge ${supplier.fulfillment_rate >= 95 ? 'po-anomaly-badge-success' : supplier.fulfillment_rate >= 80 ? 'po-anomaly-badge-warning' : 'po-anomaly-badge-danger'}`}>
                      {supplier.fulfillment_rate}%
                    </span>
                  </td>
                  <td>{supplier.late_deliveries}</td>
                  <td>{parseFloat(supplier.avg_late_days).toFixed(1)} days</td>
                  <td>Rs {parseFloat(supplier.total_loss_amount).toLocaleString()}</td>
                  <td>
                    <button 
                      onClick={() => setSelectedSupplier(supplier)}
                      className="po-anomaly-view-btn"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Material Issues */}
      <div className="po-anomaly-chart-card po-anomaly-full-width">
        <h3 className="po-anomaly-chart-title">Top 10 Raw Materials with Issues</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data.material_issues}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="material_name" angle={-45} textAnchor="end" height={120} stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Legend />
            <Bar dataKey="late_count" fill="#f59e0b" name="Late Deliveries" />
            <Bar dataKey="shortage_count" fill="#ef4444" name="Shortage Issues" />
            <Bar dataKey="quality_issue_count" fill="#8b5cf6" name="Quality Issues" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Supplier Detail Modal */}
      {selectedSupplier && (
        <div className="po-anomaly-modal-overlay" onClick={() => setSelectedSupplier(null)}>
          <div className="po-anomaly-modal" onClick={(e) => e.stopPropagation()}>
            <div className="po-anomaly-modal-header">
              <h2>{selectedSupplier.supplier_name} - Detailed Performance</h2>
              <button onClick={() => setSelectedSupplier(null)} className="po-anomaly-modal-close">×</button>
            </div>
            <div className="po-anomaly-modal-body">
              <div className="po-anomaly-modal-grid">
                <div className="po-anomaly-modal-item">
                  <label>Email:</label>
                  <p>{selectedSupplier.supplier_email}</p>
                </div>
                <div className="po-anomaly-modal-item">
                  <label>Phone:</label>
                  <p>{selectedSupplier.supplier_phone}</p>
                </div>
                <div className="po-anomaly-modal-item">
                  <label>Total Orders:</label>
                  <p>{selectedSupplier.total_orders}</p>
                </div>
                <div className="po-anomaly-modal-item">
                  <label>Late Deliveries:</label>
                  <p>{selectedSupplier.late_deliveries}</p>
                </div>
                <div className="po-anomaly-modal-item">
                  <label>Average Late Days:</label>
                  <p>{parseFloat(selectedSupplier.avg_late_days).toFixed(2)} days</p>
                </div>
                <div className="po-anomaly-modal-item">
                  <label>Shortage Orders:</label>
                  <p>{selectedSupplier.shortage_orders}</p>
                </div>
                <div className="po-anomaly-modal-item">
                  <label>Total Shortage Units:</label>
                  <p>{selectedSupplier.total_shortage_units}</p>
                </div>
                <div className="po-anomaly-modal-item">
                  <label>Quality Issues:</label>
                  <p>{selectedSupplier.quality_issues}</p>
                </div>
                <div className="po-anomaly-modal-item">
                  <label>Total Loss Amount:</label>
                  <p className="po-anomaly-loss-highlight">Rs {parseFloat(selectedSupplier.total_loss_amount).toLocaleString()}</p>
                </div>
                <div className="po-anomaly-modal-item po-anomaly-modal-full">
                  <label>Performance Summary:</label>
                  <div className="po-anomaly-performance-bars">
                    <div className="po-anomaly-perf-bar">
                      <span>On-Time Delivery</span>
                      <div className="po-anomaly-progress-bar">
                        <div 
                          className="po-anomaly-progress-fill" 
                          style={{ width: `${selectedSupplier.on_time_delivery_rate}%` }}
                        ></div>
                      </div>
                      <span>{selectedSupplier.on_time_delivery_rate}%</span>
                    </div>
                    <div className="po-anomaly-perf-bar">
                      <span>Quality Rate</span>
                      <div className="po-anomaly-progress-bar">
                        <div 
                          className="po-anomaly-progress-fill" 
                          style={{ width: `${selectedSupplier.quality_rate}%` }}
                        ></div>
                      </div>
                      <span>{selectedSupplier.quality_rate}%</span>
                    </div>
                    <div className="po-anomaly-perf-bar">
                      <span>Fulfillment Rate</span>
                      <div className="po-anomaly-progress-bar">
                        <div 
                          className="po-anomaly-progress-fill" 
                          style={{ width: `${selectedSupplier.fulfillment_rate}%` }}
                        ></div>
                      </div>
                      <span>{selectedSupplier.fulfillment_rate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrderStat;