import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import axios from "axios";
import "./SalesStat.css";

export default function SalesStat() {
    const navigate = useNavigate();
    const { token } = useContext(AppContext);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (token) {
            fetchStatistics();
        }
    }, [token]);

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/sales/statistics', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setStatistics(response.data.statistics);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="salesstat-container">
                <div className="salesstat-loading">Loading statistics...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="salesstat-container">
                <div className="salesstat-error">Error: {error}</div>
                <button className="salesstat-back-btn" onClick={() => navigate(-1)}>
                    ← Go Back
                </button>
            </div>
        );
    }

    if (!statistics || statistics.total_sales === 0) {
        return (
            <div className="salesstat-container">
                <div className="salesstat-header">
                    <h1 className="salesstat-title">Sales Statistics</h1>
                    <button className="salesstat-back-btn" onClick={() => navigate(-1)}>
                        ← Go Back
                    </button>
                </div>
                <div className="salesstat-loading">
                    No sales data available. Please add sales records to view statistics.
                </div>
            </div>
        );
    }

    return (
        <div className="salesstat-container">
            <div className="salesstat-header">
                <h1 className="salesstat-title">Sales Statistics</h1>
                <button className="salesstat-back-btn" onClick={() => navigate(-1)}>
                    ← Go Back
                </button>
            </div>

            {statistics && (
                <>
                    {/* Overview Cards */}
                    <div className="salesstat-overview">
                        <div className="salesstat-card">
                            <div className="salesstat-card-icon">📊</div>
                            <div className="salesstat-card-content">
                                <h3 className="salesstat-card-label">Total Sales</h3>
                                <p className="salesstat-card-value">{statistics.total_sales.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="salesstat-card">
                            <div className="salesstat-card-icon">💰</div>
                            <div className="salesstat-card-content">
                                <h3 className="salesstat-card-label">Total Revenue</h3>
                                <p className="salesstat-card-value">Rs {statistics.total_revenue.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="salesstat-card">
                            <div className="salesstat-card-icon">📈</div>
                            <div className="salesstat-card-content">
                                <h3 className="salesstat-card-label">Average Sale Price</h3>
                                <p className="salesstat-card-value">Rs {statistics.average_sale_price.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sales Analysis Section */}
                    <div className="salesstat-section">
                        <h2 className="salesstat-section-title">Sales Analysis</h2>
                        <div className="salesstat-analysis-grid">
                            {/* Promotion Analysis */}
                            <div className="salesstat-analysis-card">
                                <h3 className="salesstat-analysis-title">Promotion Analysis</h3>
                                <div className="salesstat-analysis-content">
                                    <div className="salesstat-analysis-item">
                                        <span className="salesstat-analysis-label">Promotion Sales:</span>
                                        <span className="salesstat-analysis-value">{statistics.promotion_analysis.promotion_sales.toLocaleString()}</span>
                                    </div>
                                    <div className="salesstat-analysis-item">
                                        <span className="salesstat-analysis-label">Non-Promotion Sales:</span>
                                        <span className="salesstat-analysis-value">{statistics.promotion_analysis.non_promotion_sales.toLocaleString()}</span>
                                    </div>
                                    <div className="salesstat-analysis-item">
                                        <span className="salesstat-analysis-label">Promotion Percentage:</span>
                                        <span className="salesstat-analysis-value salesstat-highlight">{statistics.promotion_analysis.promotion_percentage}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Day Analysis */}
                            <div className="salesstat-analysis-card">
                                <h3 className="salesstat-analysis-title">Day Analysis</h3>
                                <div className="salesstat-analysis-content">
                                    <div className="salesstat-analysis-item">
                                        <span className="salesstat-analysis-label">Weekend Sales:</span>
                                        <span className="salesstat-analysis-value">{statistics.day_analysis.weekend_sales.toLocaleString()}</span>
                                    </div>
                                    <div className="salesstat-analysis-item">
                                        <span className="salesstat-analysis-label">Weekday Sales:</span>
                                        <span className="salesstat-analysis-value">{statistics.day_analysis.weekday_sales.toLocaleString()}</span>
                                    </div>
                                    <div className="salesstat-analysis-item">
                                        <span className="salesstat-analysis-label">Holiday Sales:</span>
                                        <span className="salesstat-analysis-value salesstat-highlight">{statistics.day_analysis.holiday_sales.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sales by Shop */}
                    <div className="salesstat-section">
                        <h2 className="salesstat-section-title">Sales by Shop</h2>
                        <div className="salesstat-table-wrapper">
                            <table className="salesstat-table">
                                <thead>
                                    <tr>
                                        <th>Shop Name</th>
                                        <th>Total Sales</th>
                                        <th>Total Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statistics.sales_by_shop && statistics.sales_by_shop.length > 0 ? (
                                        statistics.sales_by_shop.map((shop) => (
                                            <tr key={shop.shop_id}>
                                                <td>{shop.shop_name}</td>
                                                <td>{shop.total_sales.toLocaleString()}</td>
                                                <td>Rs {shop.total_revenue.toLocaleString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign: 'center' }}>No shop data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Sales by Product */}
                    <div className="salesstat-section">
                        <h2 className="salesstat-section-title">Sales by Product</h2>
                        <div className="salesstat-table-wrapper">
                            <table className="salesstat-table">
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Total Sales</th>
                                        <th>Total Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statistics.sales_by_product && statistics.sales_by_product.length > 0 ? (
                                        statistics.sales_by_product.map((product) => (
                                            <tr key={product.product_id}>
                                                <td>{product.product_name}</td>
                                                <td>{product.total_sales.toLocaleString()}</td>
                                                <td>Rs {product.total_revenue.toLocaleString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign: 'center' }}>No product data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Sales */}
                    <div className="salesstat-section">
                        <h2 className="salesstat-section-title">Recent Sales (Last 10)</h2>
                        <div className="salesstat-table-wrapper">
                            <table className="salesstat-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Shop</th>
                                        <th>Product</th>
                                        <th>Units Sold</th>
                                        <th>Price</th>
                                        <th>Promotion</th>
                                        <th>Weekend</th>
                                        <th>Holiday</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statistics.recent_sales && statistics.recent_sales.length > 0 ? (
                                        statistics.recent_sales.map((sale, index) => (
                                            <tr key={index}>
                                                <td>{new Date(sale.date).toLocaleDateString()}</td>
                                                <td>{sale.shop?.name || 'N/A'}</td>
                                                <td>{sale.product?.name || 'N/A'}</td>
                                                <td>{sale.units_sold}</td>
                                                <td>Rs {sale.price.toLocaleString()}</td>
                                                <td>
                                                    <span className={`salesstat-badge ${sale.promotion_flag ? 'salesstat-badge-yes' : 'salesstat-badge-no'}`}>
                                                        {sale.promotion_flag ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`salesstat-badge ${sale.is_weekend ? 'salesstat-badge-yes' : 'salesstat-badge-no'}`}>
                                                        {sale.is_weekend ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`salesstat-badge ${sale.is_holiday ? 'salesstat-badge-yes' : 'salesstat-badge-no'}`}>
                                                        {sale.is_holiday ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" style={{ textAlign: 'center' }}>No recent sales available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}