import axios from "axios";
import { useState, useEffect } from "react";
import './ReceivedProductOrders.css';
import { useNavigate } from "react-router-dom";
import Delivery from "./Delivery";

export default function ReceivedProductOrders() {
    const [productOrders, setProductOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const[delivery , setDelivery] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getProductOrders();
        getProducts();
        getDelivery();
    }, []);

    async function getProductOrders() {
        try {
            const response = await axios.get("/api/product-orders");
            setProductOrders(response.data.data || []);
        } catch (err) {
            console.error("Failed to fetch product orders", err);
            setProductOrders([]);
        }
    }

    async function getDelivery(){
        const res = await axios.get('/api/deliveries');
        setDelivery(res.data);
    }

    async function getProducts() {
        try {
            const response = await axios.get("/api/products");
            setProducts(response.data.data || []);
        } catch (err) {
            console.error("Failed to fetch products", err);
            setProducts([]);
        }
    }

    // simple lookup map for product names
    const productMap = {};
    products.forEach(p => { productMap[p.id] = p; });

    async function handleDelete(orderId) {
        console.log("delete", orderId);
        
    }

    async function handleUpdate(orderId) {
        console.log("update", orderId);
        
    }

    async function handleSetDelivery(orderId) {
        try {
            const res = await axios.get(`/api/product-orders/${orderId}`);

            navigate('/delivery', { state: { order: res.data?.data ?? res.data } });
            console.log(res.data.data);
        } catch (err) {
            console.error('Failed to fetch order for delivery', err);
        }
    }

    return (
        <div className="received-orders-layout">
            <div className="received-orders-container">
                {productOrders.map(order => {
                    const parsedProducts = Array.isArray(order.products)
                        ? order.products
                        : (typeof order.products === "string" ? (() => {
                            try { return JSON.parse(order.products); } catch { return []; }
                        })() : []);
                    
                        console.log(parsedProducts);

                        const isDelivered = delivery.find(d => d.product_orders_id == order.id);
                        console.log(isDelivered);

                    return (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <h3>{order.shop?.name ?? "Unknown Shop"}</h3>
                                <small>Warehouse: {order.warehouse?.name ?? "Unknown"}</small>
                                <div className="order-meta">Order ID: {order.id}</div>
                            </div>

                            <div className="products-grid">
                                {parsedProducts.map((it, idx) => {
                                    const prod = productMap[it.product_id];
                                    return (
                                        <div className="product-item" key={idx}>
                                            <div className="product-name">{prod?.name ?? "Unknown product"}</div>
                                            <div className="product-units">Units: {it.units ?? it.unit ?? 0}</div>
                                        </div>
                                    );
                                })}
                            </div>

                            

                            <div className="order-actions">
                                <button onClick={() => handleUpdate(order.id)} className="pro-update-btn">Update</button>
                                <button onClick={() => handleDelete(order.id)} className="pro-delete-btn">Delete</button>
                               {isDelivered ? <button className="pro-delivered-btn">Delivered</button> : <button onClick={() => handleSetDelivery(order.id)} className="pro-delivery-btn">Set Delivery</button> } 
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}