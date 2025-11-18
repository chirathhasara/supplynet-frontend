import { useContext, useEffect, useState } from "react";
import axios from 'axios';
import "./Create.css";
import { AppContext } from "../../Context/AppContext";

export default function Create(){
    const [suppliers, setSuppliers] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [formData, setFormData] = useState({
        date: '',
        raw_material_id: '',
        supplier_id: '',
        quantity: '',
        unit_price: '',
        total_price:'',
        due_date: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const {token} = useContext(AppContext);

    async function getSuppliers(){
        try {
            const res = await axios.get('/api/suppliers');
            setSuppliers(res.data.data);
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        }
    }

    async function getRawMaterials(){
        try {
            const res = await axios.get('/api/raw-materials');
            setRawMaterials(res.data.data);
        } catch (error) {
            console.error("Error fetching raw materials:", error);
        }
    }

    useEffect(() => {
        getSuppliers();
        getRawMaterials();
    }, []);

    function handleSuppliers(e){
        setFormData({...formData, supplier_id: e.target.value});
    }

    function handleRawMaterials(e){
        const selectedRaw = rawMaterials.find(raw => raw.id == e.target.value);
        const unitPrice = selectedRaw ? selectedRaw.price : '';
        const totalPrice = formData.quantity && unitPrice ? (formData.quantity * unitPrice) : 0;
        
        setFormData({
            ...formData, 
            raw_material_id: e.target.value,
            unit_price: unitPrice,
            total_price: totalPrice
        });
    }

    function handleChange(e){
        const updatedFormData = {...formData, [e.target.name]: e.target.value};
        
        if (e.target.name === 'quantity' || e.target.name === 'unit_price') {
            const quantity = e.target.name === 'quantity' ? e.target.value : formData.quantity;
            const unitPrice = e.target.name === 'unit_price' ? e.target.value : formData.unit_price;
            updatedFormData.total_price = (quantity * unitPrice) || 0;
        }
        
        setFormData(updatedFormData);
    }

    async function handleSubmit(e){
        e.preventDefault();
        setLoading(true);
        setMessage('');
        
        try {
            await axios.post('/api/purchase-orders', formData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            setMessage('Purchase order created successfully!');
            setFormData({
                date: '',
                raw_material_id: '',
                supplier_id: '',
                quantity: '',
                unit_price: '',
                total_price: '',
                due_date: ''
            });
        } catch (error) {
            setMessage('Error creating purchase order. Please try again.');
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className="po-create-wrapper">
            <div className="po-form-container">
                <h1 className="po-form-title">Create Purchase Order</h1>
                
                {message && (
                    <div className={`po-message ${message.includes('Error') ? 'po-error' : 'po-success'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="po-form">
                    <div className="po-form-row">
                        <div className="po-input-group">
                            <label className="po-label">Order Date</label>
                            <input 
                                type="date" 
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="po-input"
                                required
                            />
                        </div>

                        <div className="po-input-group">
                            <label className="po-label">Due Date</label>
                            <input 
                                type="date" 
                                name="due_date"
                                value={formData.due_date}
                                onChange={handleChange}
                                className="po-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="po-input-group">
                        <label className="po-label">Supplier</label>
                        <select 
                            onChange={handleSuppliers}
                            value={formData.supplier_id}
                            className="po-select"
                            required
                        >
                            <option value="">Select Supplier</option>
                            {suppliers.map((supplier) => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="po-input-group">
                        <label className="po-label">Raw Material</label>
                        <select 
                            onChange={handleRawMaterials}
                            value={formData.raw_material_id}
                            className="po-select"
                            required
                        >
                            <option value="">Select Raw Material</option>
                            {rawMaterials.map((raw) => (
                                <option key={raw.id} value={raw.id}>
                                    {raw.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="po-form-row">
                        <div className="po-input-group">
                            <label className="po-label">Quantity</label>
                            <input 
                                type="number" 
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="po-input"
                                placeholder="Enter quantity"
                                min="1"
                                required
                            />
                        </div>

                        <div className="po-input-group">
                            <label className="po-label">Unit Price</label>
                            <input 
                                type="number" 
                                name="unit_price"
                                value={formData.unit_price}
                                onChange={handleChange}
                                className="po-input"
                                placeholder="Auto-filled"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="po-total-section">
                        <span className="po-total-label">Total Amount:</span>
                        <span className="po-total-value">
                            ${(formData.total_price || 0).toFixed(2)}
                        </span>
                    </div>

                    <button 
                        type="submit" 
                        className="po-submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Purchase Order'}
                    </button>
                </form>
            </div>
        </div>
    );
}