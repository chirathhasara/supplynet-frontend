import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import './Delivery.css'; 


export default function Delivery() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [products , setProducts] = useState([]); 
    const order = state?.order ?? null;


    async function getProducts(){
        try {
            const res = await axios.get('/api/products');
            setProducts(res.data.data || []);
        } catch (err) {
            console.error('Failed to load products', err);
            setProducts([]);
        }
    }

    // new form state (default values come from order)
    const toDateInput = (d) => {
        if (!d) return '';
        try { return new Date(d).toISOString().slice(0,10); } catch { return ''; }
    };

    const [date, setDate] = useState(order ? toDateInput(order.date ?? order.due_date) : '');
    const [shopId, setShopId] = useState(order ? (order.shop?.id ?? order.shop_id ?? '') : '');
    const [productsField, setProductsField] = useState(() => {
        if (!order) return '';
        if (typeof order.products === 'string') return order.products;
        try { return JSON.stringify(order.products); } catch { return ''; }
    });
    const [distance, setDistance] = useState(order ? (order.distance ?? '') : '');
    const [approximateTime, setApproximateTime] = useState(order ? (order.approximate_time ?? '') : '');

    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    async function submitDelivery(e){
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        // client-side validation
        if (!date || !shopId || !productsField || !distance || !approximateTime) {
            setErrorMessage('All fields are required.');
            return;
        }
        
        // ⚠️ CRITICAL FIX: Ensure 'order' and 'order.id' exist
        if (!order || !order.id) {
            setErrorMessage('Cannot submit: Order ID is missing. Please go back and try again.');
            console.error('Order ID is null or missing in component state.', order);
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                date,
                product_orders_id: order.id,
                shop_id: shopId,
                products: productsField,
                distance,
                approximate_time: approximateTime
            };

            await axios.post('/api/deliveries', payload);
            setSuccessMessage('Delivery submitted successfully.');
            // Navigate back after a short delay
            setTimeout(() => navigate(-1), 900);
        } catch (err) {
            console.error('Failed to submit delivery', err);
            // Provide a more user-friendly error message
            setErrorMessage(`Failed to submit delivery. Error: ${err.response?.data?.message || 'Server error'}`);
        } finally {
            setSubmitting(false);
        }
    }

    useEffect(()=>{
        getProducts();
    },[])

    if (!order) {
        return (
            <div className="delivery-layout">
                <div className="empty-state">
                    No order received. <button className="btn-ghost" onClick={() => navigate(-1)}>Go back</button>
                </div>
            </div>
        );
    }

    let parsedProducts = [];
    try {
        const raw = typeof order.products === 'string' ? JSON.parse(order.products) : order.products;
        if (raw == null) {
            parsedProducts = [];
        } else if (Array.isArray(raw)) {
            parsedProducts = raw;
        } else if (typeof raw === 'object') {
            parsedProducts = [raw];
        } else {
            parsedProducts = [];
        }
    } catch (err) {
        parsedProducts = [];
        console.error('Failed to parse order.products', err);
    }

    return (
        <div className="delivery-layout">
            <div className="delivery-card">
                <div className="order-header">
                    <h3 className="shop-name">{order.shop?.name ?? "Unknown Shop"}</h3>
                    <small className="warehouse-name">Warehouse: {order.warehouse?.name ?? "Unknown"}</small>
                    <div className="order-meta">Order ID: {order.id}</div>
                </div>

                <div className="products-grid">
                    {parsedProducts.length > 0 ? parsedProducts.map((it, idx) => {
                        // Use strict comparison if all IDs are guaranteed to be numbers/strings
                        const product = products.find(p => p.id == it.product_id) ?? { name: 'Unknown' };
                        return (
                            <div className="product-item" key={idx}>
                                <div className="product-name">{product.name}</div>
                                <div className="product-units">Units: {it.units ?? it.unit ?? 0}</div>
                            </div>
                        );
                    }) : (
                        <div className="empty-products">No products listed for this order.</div>
                    )}
                </div>

                <form className="delivery-form" onSubmit={submitDelivery}>
                    {/* The hidden field is for traditional form submission. For Axios, it's illustrative only. */}
                    {/* ⚠️ Typo corrected here for consistency, though not used by Axios payload: */}
                    <input type="hidden" name="product_orders_id" value={order.id} /> 
                    {errorMessage && <div className="form-message error">{errorMessage}</div>}
                    {successMessage && <div className="form-message success">{successMessage}</div>}
                    
                    <div className="form-row">
                        <label>Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-row">
                        <label>Shop ID</label>
                        <input
                            type="text"
                            value={shopId}
                            onChange={e => setShopId(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-row">
                        <label>Products (JSON)</label>
                        <textarea
                            value={productsField}
                            onChange={e => setProductsField(e.target.value)}
                            required
                            rows={4}
                            className="form-input"
                        />
                    </div>

                    <div className="form-row">
                        <label>Distance</label>
                        <input
                            type="text"
                            value={distance}
                            onChange={e => setDistance(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-row">
                        <label>Approximate Time</label>
                        <input
                            type="text"
                            value={approximateTime}
                            onChange={e => setApproximateTime(e.target.value)}
                            required
                            placeholder="e.g. 30 mins"
                            className="form-input"
                        />
                    </div>

                    <div className="form-actions">
                        <button className="btn-primary" type="submit" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Confirm Delivery'}
                        </button>
                        <button type="button" className="btn-ghost" onClick={() => navigate(-1)}>Back</button>
                    </div>
                </form>
            </div>
        </div>
    );
}