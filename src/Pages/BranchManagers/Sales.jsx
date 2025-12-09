import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../Context/AppContext"
import axios from "axios"
import "./Sales.css"

export default function Sales(){

    const {user, token} = useContext(AppContext);
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalSales: 0,
        totalUnits: 0,
        totalRevenue: 0,
        avgPrice: 0
    });

    useEffect(() => {
        if (user && user.shop_id) {
            fetchSales();
        }
    }, [user]);

    const fetchSales = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`/api/sales/shop/${user.shop_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const salesData = response.data.data;
            setSales(salesData);
            calculateStats(salesData);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch sales data");
            console.error("Error fetching sales:", err);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (salesData) => {
        const totalSales = salesData.length;
        const totalUnits = salesData.reduce((sum, sale) => sum + parseFloat(sale.units_sold || 0), 0);
        const totalRevenue = salesData.reduce((sum, sale) => sum + (parseFloat(sale.units_sold || 0) * parseFloat(sale.price || 0)), 0);
        const avgPrice = totalUnits > 0 ? totalRevenue / totalUnits : 0;

        setStats({
            totalSales,
            totalUnits,
            totalRevenue,
            avgPrice
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return 'Rs. ' + new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const getDayBadgeClass = (isWeekend, isHoliday) => {
        if (isHoliday) return 'sales-badge-holiday';
        if (isWeekend) return 'sales-badge-weekend';
        return 'sales-badge-weekday';
    };

    if (loading) {
        return (
            <div className="sales-container">
                <div className="sales-loading">
                    <div className="sales-spinner"></div>
                    <p>Loading sales data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="sales-container">
                <div className="sales-error">
                    <svg className="sales-error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                        <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2"/>
                        <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2"/>
                    </svg>
                    <h3>Error Loading Sales Data</h3>
                    <p>{error}</p>
                    <button onClick={fetchSales} className="sales-retry-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M1 4v6h6M23 20v-6h-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return(
        <div className="sales-container">
            <div className="sales-header">
                <div className="sales-header-content">
                    <svg className="sales-header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="12" y1="1" x2="12" y2="23" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h1>Sales Data</h1>
                </div>
                <button onClick={fetchSales} className="sales-refresh-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M1 4v6h6M23 20v-6h-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Refresh
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="sales-stats-grid">
                <div className="sales-stat-card" style={{ animationDelay: '0s' }}>
                    <div className="sales-stat-icon sales-stat-icon-total">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="7" r="4" strokeWidth="2"/>
                        </svg>
                    </div>
                    <div className="sales-stat-content">
                        <p className="sales-stat-label">Total Sales</p>
                        <p className="sales-stat-value">{stats.totalSales}</p>
                    </div>
                </div>

                <div className="sales-stat-card" style={{ animationDelay: '0.1s' }}>
                    <div className="sales-stat-icon sales-stat-icon-units">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeWidth="2"/>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="12" y1="22.08" x2="12" y2="12" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <div className="sales-stat-content">
                        <p className="sales-stat-label">Total Units Sold</p>
                        <p className="sales-stat-value">{stats.totalUnits.toFixed(0)}</p>
                    </div>
                </div>

                <div className="sales-stat-card" style={{ animationDelay: '0.2s' }}>
                    <div className="sales-stat-icon sales-stat-icon-revenue">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="12" y1="1" x2="12" y2="23" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div className="sales-stat-content">
                        <p className="sales-stat-label">Total Revenue</p>
                        <p className="sales-stat-value">{formatCurrency(stats.totalRevenue)}</p>
                    </div>
                </div>

                <div className="sales-stat-card" style={{ animationDelay: '0.3s' }}>
                    <div className="sales-stat-icon sales-stat-icon-avg">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <polyline points="7 10 12 15 17 10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="12" y1="15" x2="12" y2="3" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <div className="sales-stat-content">
                        <p className="sales-stat-label">Avg Price</p>
                        <p className="sales-stat-value">{formatCurrency(stats.avgPrice)}</p>
                    </div>
                </div>
            </div>

            {sales.length === 0 ? (
                <div className="sales-empty">
                    <svg className="sales-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                        <path d="M16 16s-1.5-2-4-2-4 2-4 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <h3>No Sales Data Available</h3>
                    <p>There are no sales records for your shop yet.</p>
                </div>
            ) : (
                <div className="sales-table-container">
                    <table className="sales-table">
                        <thead>
                            <tr>
                                <th>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                                        <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
                                        <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
                                        <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
                                    </svg>
                                    Date
                                </th>
                                <th>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                                        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                                        <path d="M21 15l-5-5L5 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Product
                                </th>
                                <th>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeWidth="2"/>
                                    </svg>
                                    Units Sold
                                </th>
                                <th>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <line x1="12" y1="1" x2="12" y2="23" strokeWidth="2" strokeLinecap="round"/>
                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Price
                                </th>
                                <th>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" strokeWidth="2"/>
                                        <line x1="1" y1="10" x2="23" y2="10" strokeWidth="2"/>
                                    </svg>
                                    Revenue
                                </th>
                                <th>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeWidth="2"/>
                                        <circle cx="12" cy="10" r="3" strokeWidth="2"/>
                                    </svg>
                                    Day Info
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map((sale, index) => (
                                <tr key={sale.id} style={{ animationDelay: `${index * 0.05}s` }}>
                                    <td className="sales-date-cell">
                                        <div className="sales-date-wrapper">
                                            <span className="sales-date-main">{formatDate(sale.date)}</span>
                                            <span className="sales-day-name">{sale.day_of_week}</span>
                                        </div>
                                    </td>
                                    <td className="sales-product-cell">
                                        <div className="sales-product-info">
                                            <span className="sales-product-name">{sale.product?.name || 'Unknown'}</span>
                                            <span className="sales-product-id">ID: {sale.product_id}</span>
                                        </div>
                                    </td>
                                    <td className="sales-units-cell">
                                        <span className="sales-units-badge">{sale.units_sold}</span>
                                    </td>
                                    <td className="sales-price-cell">
                                        {formatCurrency(sale.price)}
                                    </td>
                                    <td className="sales-revenue-cell">
                                        <strong>{formatCurrency(sale.units_sold * sale.price)}</strong>
                                    </td>
                                    <td className="sales-day-info-cell">
                                        <div className="sales-badges-wrapper">
                                            <span className={`sales-day-badge ${getDayBadgeClass(sale.is_weekend, sale.is_holiday)}`}>
                                                {sale.is_holiday ? '🎉 Holiday' : sale.is_weekend ? '🎈 Weekend' : '📅 Weekday'}
                                            </span>
                                            {sale.promotion_flag && (
                                                <span className="sales-promotion-badge">
                                                    🎁 Promo
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}