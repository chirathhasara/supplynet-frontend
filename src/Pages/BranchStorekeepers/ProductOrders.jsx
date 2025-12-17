import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import "./ProductOrders.css";

export default function ProductOrders(){
    const location = useLocation();
    const prefilledData = location.state;

    const [orders, setOrders] = useState({
        shop_id: '',
        ware_house_id: '',
        products: [],
        due_date: ''
    });
    
    const [warehouses, setWarehouses] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [units, setUnits] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const {user} = useContext(AppContext);

    async function handleSubmit(e){
        e.preventDefault();
        setLoading(true);
        setMessage('');
        
        try {
            const response = await axios.post('/api/product-orders', {
                ...orders,
                shop_id: user.shop_id,
                products: JSON.stringify(orders.products)
            });
            setMessage('Order placed successfully!');
            // Reset form
            setOrders({
                shop_id: '',
                ware_house_id: '',
                products: [],
                due_date: ''
            });
            setSelectedProduct('');
            setUnits('');
        } catch (error) {
            setMessage('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    async function getProducts(){
        try {
            const response = await axios.get('/api/products');
            console.log(response.data.data);
            setProducts(response.data.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    async function getWarehouses(){
        try {
            const response = await axios.get('/api/warehouses');
            console.log(response.data.data);
            const warehousesData = response.data.data || [];
            setWarehouses(warehousesData);
            
            // Auto-select main warehouse if prefilled data indicates so
            if (prefilledData?.autoSelectMainWarehouse && warehousesData.length > 0) {
                // Find main warehouse (assuming it's the first one or has 'main' in name)
                const mainWarehouse = warehousesData.find(w => 
                    w.name?.toLowerCase().includes('main') || 
                    w.name?.toLowerCase().includes('central')
                ) || warehousesData[0];
                
                setOrders(prev => ({...prev, ware_house_id: mainWarehouse.id}));
            }
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
    }

    function handleWarehouseChange(e){
        setOrders({...orders, ware_house_id: e.target.value});
    }

    function handleDueDate(e){
        setOrders({...orders, due_date: e.target.value});
    }

    function handleProductSelect(e){
        setSelectedProduct(e.target.value);
    }

    function handleUnitsChange(e){
        setUnits(e.target.value);
    }

    function addProduct(){
        if(selectedProduct && units > 0){
            const newProduct = {
                product_id: selectedProduct,
                units: units
            };
            setOrders({
                ...orders, 
                products: [...orders.products, newProduct]
            });
            setSelectedProduct('');
            setUnits('');
        }
    }

    function removeProduct(index){
        const updatedProducts = orders.products.filter((_, i) => i !== index);
        setOrders({...orders, products: updatedProducts});
    }

    useEffect(()=>{
        getProducts();
        getWarehouses();
    },[]);

    // Handle prefilled products from forecast data
    useEffect(() => {
        if (prefilledData?.prefilledProducts && products.length > 0) {
            const prefilledProductsData = prefilledData.prefilledProducts.map(item => ({
                product_id: item.product_id,
                units: item.units
            }));
            setOrders(prev => ({...prev, products: prefilledProductsData}));
            
            // Show info message
            setMessage(`Pre-filled order with ${prefilledProductsData.length} product(s) based on forecast data. Please set the due date.`);
        }
    }, [prefilledData, products]);

    return(
        <div className="product-orders-container">
            <div className="orders-card">
                <h2 className="orders-title">Create Product Order</h2>
                
                {message && (
                    <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="orders-form">
                    <div className="form-group">
                        <label htmlFor="warehouse">Select Warehouse</label>
                        <select 
                            id="warehouse"
                            value={orders.ware_house_id}
                            onChange={handleWarehouseChange}
                            required
                            className="form-select"
                        >
                            <option value="">Choose a warehouse...</option>
                            {warehouses.map((warehouse)=>(
                                <option key={warehouse.id} value={warehouse.id}>
                                    {warehouse.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="dueDate">Due Date</label>
                        <input 
                            type="date" 
                            id="dueDate"
                            value={orders.due_date}
                            onChange={handleDueDate}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="products-section">
                        <h3 className="section-title">Add Products</h3>
                        
                        <div className="product-input-group">
                            <div className="form-group flex-grow">
                                <label htmlFor="product">Product</label>
                                <select 
                                    id="product"
                                    value={selectedProduct}
                                    onChange={handleProductSelect}
                                    className="form-select"
                                >
                                    <option value="">Select a product...</option>
                                    {products.map((product)=>(
                                        <option key={product.id} value={product.id}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="units">Units</label>
                                <input 
                                    type="number" 
                                    id="units"
                                    value={units}
                                    onChange={handleUnitsChange}
                                    min="1"
                                    placeholder="0"
                                    className="form-input"
                                />
                            </div>

                            <button 
                                type="button" 
                                onClick={addProduct}
                                className="btn-add"
                                disabled={!selectedProduct || !units}
                            >
                                Add
                            </button>
                        </div>

                        {orders.products.length > 0 && (
                            <div className="products-list">
                                <h4 className="list-title">Selected Products</h4>
                                <div className="products-items">
                                    {orders.products.map((item, index) => {
                                        const product = products.find(p => p.id == item.product_id);
                                        return product ? (
                                            <div key={index} className="product-item">
                                                <div className="product-info">
                                                    <span className="product-name">
                                                        {product?.name || 'Unknown Product'}
                                                    </span>
                                                    <span className="product-units">
                                                        {item.units} units
                                                    </span>
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={() => removeProduct(index)}
                                                    className="btn-remove"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        className="btn-submit"
                        disabled={loading || orders.products.length === 0}
                    >
                        {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                </form>
            </div>
        </div>
    );
}