import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../Context/AppContext";
import "./OrderDetails.css";

export default function OrderDetails(){

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {user, token} = useContext(AppContext);

    async function getOrders(){
        try {
            setLoading(true);
            const res = await axios.get(`/api/product-orders/shop/${user?.shop_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOrders(res.data.data || []);
            console.log(res.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch orders");
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user?.shop_id) {
            getOrders();
        }
    }, [user]);

    const parseProducts = (productsString) => {
        try {
            return JSON.parse(productsString);
        } catch (e) {
            console.error("Error parsing products:", e);
            return [];
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="orderdetails-container">
                <div className="orderdetails-loading">
                    <div className="orderdetails-spinner"></div>
                    <p>Loading orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="orderdetails-container">
                <div className="orderdetails-error">
                    <svg className="orderdetails-error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                        <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2"/>
                        <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2"/>
                    </svg>
                    <h3>Error Loading Orders</h3>
                    <p>{error}</p>
                    <button onClick={getOrders} className="orderdetails-retry-btn">Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="orderdetails-container">
            <div className="orderdetails-header">
                <div className="orderdetails-header-content">
                    <svg className="orderdetails-header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2"/>
                        <path d="M9 12h6m-6 4h6" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <div>
                        <h1>Product Orders</h1>
                        <p className="orderdetails-subtitle">Total Orders: {orders.total_orders || orders.length}</p>
                    </div>
                </div>
                <button onClick={getOrders} className="orderdetails-refresh-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M1 4v6h6M23 20v-6h-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Refresh
                </button>
            </div>

            {orders.length === 0 ? (
                <div className="orderdetails-empty">
                    <svg className="orderdetails-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" strokeWidth="2"/>
                        <rect x="9" y="3" width="6" height="4" rx="1" strokeWidth="2"/>
                        <line x1="12" y1="12" x2="12" y2="12.01" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <h3>No Orders Found</h3>
                    <p>You haven't placed any product orders yet.</p>
                </div>
            ) : (
                <div className="orderdetails-grid">
                    {orders.map((order, index) => {
                        const products = parseProducts(order.products);
                        return (
                            <div 
                                key={order.id} 
                                className="orderdetails-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="orderdetails-card-header">
                                    <div className="orderdetails-order-badge">
                                        <span className="orderdetails-order-id">Order #{order.id}</span>
                                        <span className="orderdetails-order-date">{formatDateTime(order.created_at)}</span>
                                    </div>
                                </div>

                                <div className="orderdetails-card-body">
                                    <div className="orderdetails-info-grid">
                                        <div className="orderdetails-info-item">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeWidth="2"/>
                                                <polyline points="9 22 9 12 15 12 15 22" strokeWidth="2"/>
                                            </svg>
                                            <div>
                                                <span className="orderdetails-info-label">Shop</span>
                                                <span className="orderdetails-info-value">{order.shop?.name || 'N/A'}</span>
                                                <span className="orderdetails-info-sublabel">{order.shop?.location || ''}</span>
                                            </div>
                                        </div>

                                        <div className="orderdetails-info-item">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeWidth="2"/>
                                                <polyline points="3.27 6.96 12 12.01 20.73 6.96" strokeWidth="2"/>
                                                <line x1="12" y1="22.08" x2="12" y2="12" strokeWidth="2"/>
                                            </svg>
                                            <div>
                                                <span className="orderdetails-info-label">Warehouse</span>
                                                <span className="orderdetails-info-value">{order.warehouse?.name || 'N/A'}</span>
                                                <span className="orderdetails-info-sublabel">{order.warehouse?.location || ''}</span>
                                            </div>
                                        </div>

                                        <div className="orderdetails-info-item orderdetails-due-date">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                                                <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
                                                <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
                                                <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
                                            </svg>
                                            <div>
                                                <span className="orderdetails-info-label">Due Date</span>
                                                <span className="orderdetails-info-value">{formatDate(order.due_date)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="orderdetails-products-section">
                                        <h4 className="orderdetails-products-title">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                                                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                                                <path d="M21 15l-5-5L5 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            Ordered Products ({products.length})
                                        </h4>
                                        <div className="orderdetails-products-list">
                                            {products.map((product, idx) => (
                                                <div key={idx} className="orderdetails-product-item">
                                                    <div className="orderdetails-product-icon">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
                                                            <circle cx="12" cy="12" r="3" fill="currentColor"/>
                                                        </svg>
                                                    </div>
                                                    <div className="orderdetails-product-info">
                                                        <span className="orderdetails-product-id">Product ID: {product.product_id}</span>
                                                        <span className="orderdetails-product-units">{product.units} units</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}