import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import axios from "axios";
import "./ProductOrderStat.css";

export default function ProductOrderStat() {
    const { token } = useContext(AppContext);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get("/api/accept-product-orders/statistics", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setStatistics(response.data.statistics);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch statistics");
            console.error("Error fetching statistics:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="pos-loading-container">
                <div className="pos-spinner"></div>
                <p className="pos-loading-text">Loading statistics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pos-error-container">
                <div className="pos-error-icon">⚠️</div>
                <h2 className="pos-error-title">Error Loading Statistics</h2>
                <p className="pos-error-message">{error}</p>
                <button className="pos-retry-button" onClick={fetchStatistics}>
                    🔄 Retry
                </button>
            </div>
        );
    }

    if (!statistics) {
        return null;
    }

    return (
        <div className="pos-container">
            <div className="pos-header">
                <h1 className="pos-title">📊 Product Order Statistics</h1>
                <button className="pos-refresh-button" onClick={fetchStatistics}>
                    🔄 Refresh
                </button>
            </div>

            {/* Main Stats Cards */}
            <div className="pos-stats-grid">
                <div className="pos-stat-card pos-card-blue">
                    <div className="pos-stat-icon">📦</div>
                    <div className="pos-stat-content">
                        <h3 className="pos-stat-value">{statistics.total_orders}</h3>
                        <p className="pos-stat-label">Total Orders</p>
                    </div>
                    <div className="pos-card-glow"></div>
                </div>

                <div className="pos-stat-card pos-card-green">
                    <div className="pos-stat-icon">✅</div>
                    <div className="pos-stat-content">
                        <h3 className="pos-stat-value">{statistics.total_accepted_products}</h3>
                        <p className="pos-stat-label">Accepted Products</p>
                    </div>
                    <div className="pos-card-glow"></div>
                </div>

                <div className="pos-stat-card pos-card-purple">
                    <div className="pos-stat-icon">📥</div>
                    <div className="pos-stat-content">
                        <h3 className="pos-stat-value">{statistics.total_received_products}</h3>
                        <p className="pos-stat-label">Received Products</p>
                    </div>
                    <div className="pos-card-glow"></div>
                </div>

                <div className="pos-stat-card pos-card-red">
                    <div className="pos-stat-icon">❌</div>
                    <div className="pos-stat-content">
                        <h3 className="pos-stat-value">{statistics.total_rejected_products}</h3>
                        <p className="pos-stat-label">Rejected Products</p>
                    </div>
                    <div className="pos-card-glow"></div>
                </div>
            </div>

            {/* Acceptance Rate Card */}
            <div className="pos-acceptance-card">
                <div className="pos-acceptance-header">
                    <h2>📈 Acceptance Rate</h2>
                </div>
                <div className="pos-acceptance-content">
                    <div className="pos-rate-circle">
                        <svg className="pos-rate-svg" viewBox="0 0 200 200">
                            <defs>
                                <linearGradient id="pos-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#667eea" />
                                    <stop offset="100%" stopColor="#764ba2" />
                                </linearGradient>
                            </defs>
                            <circle
                                className="pos-rate-bg"
                                cx="100"
                                cy="100"
                                r="90"
                            />
                            <circle
                                className="pos-rate-progress"
                                cx="100"
                                cy="100"
                                r="90"
                                style={{
                                    strokeDashoffset: `${565 - (565 * parseFloat(statistics.acceptance_rate)) / 100}`,
                                }}
                            />
                        </svg>
                        <div className="pos-rate-text">
                            <span className="pos-rate-value">{statistics.acceptance_rate}</span>
                        </div>
                    </div>
                    <div className="pos-rate-details">
                        <div className="pos-rate-item">
                            <span className="pos-rate-dot pos-dot-green"></span>
                            <span>Accepted: {statistics.total_accepted_products}</span>
                        </div>
                        <div className="pos-rate-item">
                            <span className="pos-rate-dot pos-dot-purple"></span>
                            <span>Received: {statistics.total_received_products}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders by Shop */}
            <div className="pos-shop-section">
                <h2 className="pos-section-title">🏪 Orders by Shop</h2>
                <div className="pos-shop-grid">
                    {statistics.orders_by_shop.map((shop) => (
                        <div key={shop.shop_id} className="pos-shop-card">
                            <div className="pos-shop-icon">🏬</div>
                            <h3 className="pos-shop-name">{shop.shop_name}</h3>
                            <div className="pos-shop-orders">
                                <span className="pos-shop-count">{shop.total_orders}</span>
                                <span className="pos-shop-label">Orders</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Orders */}
            <div className="pos-recent-section">
                <h2 className="pos-section-title">🕒 Recent Orders</h2>
                <div className="pos-orders-list">
                    {statistics.recent_orders.map((order) => (
                        <div key={order.id} className="pos-order-item">
                            <div className="pos-order-icon">📋</div>
                            <div className="pos-order-info">
                                <h4 className="pos-order-shop">
                                    {order.shop?.name || "Unknown Shop"}
                                </h4>
                                <p className="pos-order-date">
                                    Order ID: #{order.id} • 
                                    {order.delivery?.date 
                                        ? ` Delivery: ${new Date(order.delivery.date).toLocaleDateString()}`
                                        : " No delivery date"}
                                </p>
                            </div>
                            <div className="pos-order-badge">
                                {order.accepted_products ? JSON.parse(order.accepted_products).length : 0} items
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}