import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../../Context/AppContext"
import axios from "axios"
import "./ForecastData.css"

export default function ForecastData(){

    const navigate = useNavigate();
    const {user, token} = useContext(AppContext);
    const [predictions, setPredictions] = useState([]);
    const [stockData, setStockData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user && user.shop_id) {
            fetchPredictions();
        }
    }, [user]);

    const fetchPredictions = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`/api/predictions/shop/${user.shop_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const predictionsData = response.data.data;
            setPredictions(predictionsData);
            
            // Fetch stock data for each product
            await fetchStockData(predictionsData);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch predictions");
            console.error("Error fetching predictions:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStockData = async (predictionsData) => {
        try {
            const stockPromises = predictionsData.map(prediction => 
                axios.get(`/api/shops/${user.shop_id}/products/${prediction.product_id}/stock`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).catch(err => {
                    console.error(`Error fetching stock for product ${prediction.product_id}:`, err);
                    return { data: { stock: 0 } };
                })
            );
            
            const stockResponses = await Promise.all(stockPromises);
            const stockMap = {};
            
            predictionsData.forEach((prediction, index) => {
                stockMap[prediction.product_id] = stockResponses[index].data.stock || 0;
            });
            
            setStockData(stockMap);
        } catch (err) {
            console.error("Error fetching stock data:", err);
        }
    };

    const calculateVariance = (productId, predictedUnits) => {
        const currentStock = stockData[productId] || 0;
        return currentStock - predictedUnits;
    };

    const calculateOrderQuantity = (variance) => {
        // If variance is negative (need more stock), add safety buffer of 50
        // If variance is positive (have excess stock), don't order unless prediction is high
        if (variance < 0) {
            return Math.abs(variance) + 50;
        } else if (variance >= 0 && variance < 50) {
            // If we have small excess, still order a minimal amount for safety
            return 30;
        }
        return 0;
    };

    const handleCreateOrder = (prediction) => {
        const variance = calculateVariance(prediction.product_id, prediction.predicted_units_for_week);
        const orderQuantity = calculateOrderQuantity(variance);
        
        if (orderQuantity <= 0) {
            alert("Stock level is sufficient. No order needed.");
            return;
        }

        // Navigate to ProductOrders with pre-filled data
        navigate('/products/orders', {
            state: {
                prefilledProducts: [{
                    product_id: prediction.product_id,
                    units: orderQuantity,
                    productName: prediction.product?.name || 'Unknown Product'
                }],
                autoSelectMainWarehouse: true
            }
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="forecastdata-container">
                <div className="forecastdata-loading">
                    <div className="forecastdata-spinner"></div>
                    <p>Loading predictions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="forecastdata-container">
                <div className="forecastdata-error">
                    <svg className="forecastdata-error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                        <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2"/>
                        <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2"/>
                    </svg>
                    <h3>Error Loading Predictions</h3>
                    <p>{error}</p>
                    <button onClick={fetchPredictions} className="forecastdata-retry-btn">
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
        <div className="forecastdata-container">
            <div className="forecastdata-header">
                <div className="forecastdata-header-content">
                    <svg className="forecastdata-header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h1>Sales Forecast Data</h1>
                </div>
                <button onClick={fetchPredictions} className="forecastdata-refresh-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M1 4v6h6M23 20v-6h-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Refresh
                </button>
            </div>

            {predictions.length === 0 ? (
                <div className="forecastdata-empty">
                    <svg className="forecastdata-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                        <line x1="12" y1="8" x2="12" y2="16" strokeWidth="2"/>
                        <line x1="8" y1="12" x2="16" y2="12" strokeWidth="2"/>
                    </svg>
                    <h3>No Predictions Available</h3>
                    <p>There are no forecast predictions for your shop yet.</p>
                </div>
            ) : (
                <div className="forecastdata-grid">
                    {predictions.map((prediction, index) => (
                        <div 
                            key={prediction.id} 
                            className="forecastdata-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="forecastdata-card-header">
                                <div className="forecastdata-product-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                                        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                                        <path d="M21 15l-5-5L5 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <div className="forecastdata-product-name">
                                    <h3>{prediction.product?.name || 'Unknown Product'}</h3>
                                    <span className="forecastdata-product-id">ID: {prediction.product_id}</span>
                                </div>
                            </div>

                            <div className="forecastdata-card-body">
                                <div className="forecastdata-stats-grid">
                                    <div className="forecastdata-stat-item forecastdata-prediction">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <div>
                                            <span className="forecastdata-stat-label">Predicted Units</span>
                                            <span className="forecastdata-stat-value">{prediction.predicted_units_for_week}</span>
                                        </div>
                                    </div>

                                    <div className="forecastdata-stat-item forecastdata-stock">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeWidth="2"/>
                                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" strokeWidth="2"/>
                                            <line x1="12" y1="22.08" x2="12" y2="12" strokeWidth="2"/>
                                        </svg>
                                        <div>
                                            <span className="forecastdata-stat-label">Current Stock</span>
                                            <span className="forecastdata-stat-value">{stockData[prediction.product_id] || 0}</span>
                                        </div>
                                    </div>

                                    <div className={`forecastdata-stat-item forecastdata-variance ${
                                        calculateVariance(prediction.product_id, prediction.predicted_units_for_week) < 0 
                                            ? 'forecastdata-variance-negative' 
                                            : 'forecastdata-variance-positive'
                                    }`}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2" strokeLinecap="round"/>
                                            <polyline points="19 12 12 19 5 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <div>
                                            <span className="forecastdata-stat-label">Variance</span>
                                            <span className="forecastdata-stat-value">
                                                {calculateVariance(prediction.product_id, prediction.predicted_units_for_week)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="forecastdata-date-range">
                                    <div className="forecastdata-date-item">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                                            <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
                                            <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
                                            <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
                                        </svg>
                                        <div>
                                            <span className="forecastdata-date-label">Start Date</span>
                                            <span className="forecastdata-date-value">{formatDate(prediction.start_date)}</span>
                                        </div>
                                    </div>
                                    <div className="forecastdata-date-arrow">→</div>
                                    <div className="forecastdata-date-item">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                                            <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
                                            <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
                                            <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
                                        </svg>
                                        <div>
                                            <span className="forecastdata-date-label">End Date</span>
                                            <span className="forecastdata-date-value">{formatDate(prediction.end_date)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="forecastdata-card-footer">
                                <div className="forecastdata-shop-info">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeWidth="2"/>
                                        <polyline points="9 22 9 12 15 12 15 22" strokeWidth="2"/>
                                    </svg>
                                    <span>Shop ID: {prediction.shop_id}</span>
                                </div>
                                <button 
                                    onClick={() => handleCreateOrder(prediction)}
                                    className="forecastdata-order-btn"
                                    disabled={calculateOrderQuantity(calculateVariance(prediction.product_id, prediction.predicted_units_for_week)) <= 0}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2"/>
                                        <path d="M9 12h6m-6 4h6" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                    Create Order ({calculateOrderQuantity(calculateVariance(prediction.product_id, prediction.predicted_units_for_week))} units)
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}