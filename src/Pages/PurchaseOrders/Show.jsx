import axios from "axios";
import { useState, useEffect } from "react";
import "./Show.css";

export default function Show(){
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    async function getPurchaseOrders() {
        try {
            const res = await axios.get('/api/purchase-orders');
            setPurchaseOrders(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching purchase orders:", error);
            setLoading(false);
        }
    }

    useEffect(() => {
        getPurchaseOrders();
    }, []);

    if (loading) {
        return <div className="po-loading">Loading Purchase Orders...</div>;
    }

    return (
        <div className="po-show-wrapper">
            <div className="po-show-header">
                <h1 className="po-show-title">Purchase Orders</h1>
                <div className="po-show-stats">
                    <div className="po-stat-card">
                        <span className="po-stat-number">{purchaseOrders.length}</span>
                        <span className="po-stat-label">Total Orders</span>
                    </div>
                </div>
            </div>

            <div className="po-orders-grid">
                {purchaseOrders.map((order) => (
                    <div key={order.id} className="po-order-card">
                        <div className="po-card-header">
                            <div className="po-order-id">Order #{order.id}</div>
                            <div className="po-order-status">Pending</div>
                        </div>

                        <div className="po-card-body">
                            <div className="po-info-section">
                                <div className="po-info-icon">📦</div>
                                <div className="po-info-content">
                                    <span className="po-info-label">Raw Material</span>
                                    <span className="po-info-value">
                                        {order.raw_material?.name || 'N/A'}
                                    </span>
                                </div>
                            </div>

                            <div className="po-info-section">
                                <div className="po-info-icon">🏢</div>
                                <div className="po-info-content">
                                    <span className="po-info-label">Supplier</span>
                                    <span className="po-info-value">
                                        {order.supplier?.name || 'N/A'}
                                    </span>
                                </div>
                            </div>

                            <div className="po-details-row">
                                <div className="po-detail-item">
                                    <span className="po-detail-label">Quantity</span>
                                    <span className="po-detail-value">{order.quantity} units</span>
                                </div>
                                <div className="po-detail-item">
                                    <span className="po-detail-label">Unit Price</span>
                                    <span className="po-detail-value">${order.unit_price}</span>
                                </div>
                            </div>

                            <div className="po-dates-row">
                                <div className="po-date-item">
                                    <span className="po-date-label">📅 Order Date</span>
                                    <span className="po-date-value">
                                        {new Date(order.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="po-date-item">
                                    <span className="po-date-label">⏰ Due Date</span>
                                    <span className="po-date-value">
                                        {new Date(order.due_date).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="po-card-footer">
                            <span className="po-total-label">Total Amount</span>
                            <span className="po-total-amount">${order.total_price}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}