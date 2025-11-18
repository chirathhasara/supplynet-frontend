import axios from "axios";
import { useState, useEffect } from "react";
import './DeliveryView.css';

export default function DeliveryView(){
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getDeliveries();
    }, []);

    async function getDeliveries(){
        try {
            setLoading(true);
            setError(null); // Clear previous errors
            const res = await axios.get('/api/deliveries');
            console.log(res.data);
            
            // Ensure res.data is an array
            const dataArray = Array.isArray(res.data) ? res.data : [];
            
            // Parse products if they're JSON strings
            const parsedDeliveries = dataArray.map(delivery => ({
                ...delivery,
                products: typeof delivery.products === 'string' 
                    ? JSON.parse(delivery.products) 
                    : delivery.products || []
            }));
            
            setDeliveries(parsedDeliveries);
        } catch (err) {
            setError('Failed to fetch deliveries');
            console.error(err);
            setDeliveries([]); // Reset to empty array on error
        } finally {
            setLoading(false);
        }
    }

    const getStatusColor = (status) => {
        const colors = {
            'pending': '#FFA726',
            'in_transit': '#42A5F5',
            'delivered': '#66BB6A',
            'cancelled': '#EF5350'
        };
        return colors[status] || '#9E9E9E';
    };

    // Helper function to safely get products array
    const getProductsArray = (products) => {
        if (Array.isArray(products)) return products;
        if (typeof products === 'string') {
            try {
                return JSON.parse(products);
            } catch {
                return [];
            }
        }
        return [];
    };

    if (loading) {
        return (
            <div className="delivery-loading-container">
                <div className="delivery-loader"></div>
                <p>Loading deliveries...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="delivery-error-container">
                <span className="delivery-error-icon">⚠️</span>
                <p>{error}</p>
                <button onClick={getDeliveries} className="delivery-retry-btn">Retry</button>
            </div>
        );
    }

    return(
        <div className="delivery-main-container">
            <div className="delivery-header">
                <h1 className="delivery-title">
                    <span className="delivery-title-icon">🚚</span>
                    Delivery Dashboard
                </h1>
                <button onClick={getDeliveries} className="delivery-refresh-btn">
                    <span className="delivery-refresh-icon">🔄</span>
                    Refresh
                </button>
            </div>

            <div className="delivery-stats-bar">
                <div className="delivery-stat-card">
                    <span className="delivery-stat-icon">📦</span>
                    <div className="delivery-stat-info">
                        <h3>{deliveries.length}</h3>
                        <p>Total Deliveries</p>
                    </div>
                </div>
                <div className="delivery-stat-card">
                    <span className="delivery-stat-icon">⏱️</span>
                    <div className="delivery-stat-info">
                        <h3>{deliveries.filter(d => d.status === 'in_transit').length}</h3>
                        <p>In Transit</p>
                    </div>
                </div>
                <div className="delivery-stat-card">
                    <span className="delivery-stat-icon">✅</span>
                    <div className="delivery-stat-info">
                        <h3>{deliveries.filter(d => d.status === 'delivered').length}</h3>
                        <p>Delivered</p>
                    </div>
                </div>
            </div>

            {deliveries.length === 0 ? (
                <div className="delivery-empty-state">
                    <span className="delivery-empty-icon">📭</span>
                    <h3>No Deliveries Found</h3>
                    <p>There are no deliveries to display at the moment.</p>
                </div>
            ) : (
                <div className="delivery-grid-container">
                    {deliveries.map((delivery, index) => {
                        const productsArray = getProductsArray(delivery.products);
                        
                        return (
                            <div key={delivery.id || index} className="delivery-card">
                                <div className="delivery-card-header">
                                    <div className="delivery-card-title">
                                        <span className="delivery-card-icon">📍</span>
                                        <h3>Order #{delivery.product_orders_id || 'N/A'}</h3>
                                    </div>
                                    <div 
                                        className="delivery-status-badge"
                                        style={{ backgroundColor: getStatusColor(delivery.status) }}
                                    >
                                        {delivery.status || 'pending'}
                                    </div>
                                </div>

                                <div className="delivery-route-map">
                                    <div className="delivery-route-line">
                                        <div className="delivery-route-point delivery-start">
                                            <span className="delivery-point-icon">🏭</span>
                                            <span className="delivery-point-label">Warehouse</span>
                                        </div>
                                        <div className="delivery-route-path">
                                            <div className="delivery-route-truck">🚛</div>
                                            <div className="delivery-route-distance">
                                                {delivery.distance || 0} km
                                            </div>
                                        </div>
                                        <div className="delivery-route-point delivery-end">
                                            <span className="delivery-point-icon">🏪</span>
                                            <span className="delivery-point-label">
                                                {delivery.shop?.name || `Shop #${delivery.shop_id || 'N/A'}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="delivery-details-grid">
                                    <div className="delivery-detail-item">
                                        <span className="delivery-detail-icon">📅</span>
                                        <div className="delivery-detail-content">
                                            <span className="delivery-detail-label">Date</span>
                                            <span className="delivery-detail-value">
                                                {delivery.date ? new Date(delivery.date).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="delivery-detail-item">
                                        <span className="delivery-detail-icon">⏰</span>
                                        <div className="delivery-detail-content">
                                            <span className="delivery-detail-label">ETA</span>
                                            <span className="delivery-detail-value">
                                                {delivery.approximate_time || 'N/A'} mins
                                            </span>
                                        </div>
                                    </div>

                                    <div className="delivery-detail-item">
                                        <span className="delivery-detail-icon">📦</span>
                                        <div className="delivery-detail-content">
                                            <span className="delivery-detail-label">Products</span>
                                            <span className="delivery-detail-value">
                                                {productsArray.length} items
                                            </span>
                                        </div>
                                    </div>

                                    <div className="delivery-detail-item">
                                        <span className="delivery-detail-icon">📏</span>
                                        <div className="delivery-detail-content">
                                            <span className="delivery-detail-label">Distance</span>
                                            <span className="delivery-detail-value">
                                                {delivery.distance || 0} km
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {productsArray.length > 0 && (
                                    <div className="delivery-products-section">
                                        <h4 className="delivery-products-title">
                                            <span className="delivery-products-icon">📋</span>
                                            Products
                                        </h4>
                                        <div className="delivery-products-list">
                                            {productsArray.map((product, idx) => (
                                                <div key={idx} className="delivery-product-item">
                                                    <span className="delivery-product-bullet">•</span>
                                                    <span className="delivery-product-name">
                                                        {typeof product === 'object' 
                                                            ? `Product ID: ${product.product_id || 'N/A'}`
                                                            : (product.name || product.product_name || product || 'N/A')
                                                        }
                                                    </span>
                                                    {(product.quantity || product.units) && (
                                                        <span className="delivery-product-qty">
                                                            x{product.quantity || product.units}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="delivery-card-actions">
                                    <button className="delivery-action-btn delivery-view-btn">
                                        <span>👁️</span> View Details
                                    </button>
                                    <button className="delivery-action-btn delivery-track-btn">
                                        <span>📍</span> Track
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}