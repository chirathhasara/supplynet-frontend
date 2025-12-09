import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../Context/AppContext";
import axios from "axios";
import "./SalesForcast.css";

export default function SalesForcast() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [promotionFlags, setPromotionFlags] = useState([false, false, false, false, false, false, false]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const { user, token } = useContext(AppContext);

    useEffect(() => {
        getProducts();
    }, []);

    async function getProducts() {
        try {
            const res = await axios.get('/api/products');
            setProducts(res.data.data);
        } catch (error) {
            setMessage({ text: "Failed to load products", type: "error" });
        }
    }

    // Get lag_7_units_sold from sales data
    async function getLag7UnitsSold(productId, shopId, targetDate) {
        try {
            const lag7Date = new Date(targetDate);
            lag7Date.setDate(lag7Date.getDate() - 7);
            const formattedDate = lag7Date.toISOString().split('T')[0];

            const res = await axios.get(`/api/sales`);
            const sales = res.data.data;

            const matchingSale = sales.find(sale => 
                sale.product_id === productId && 
                sale.shop_id === shopId && 
                sale.date === formattedDate
            );

            return matchingSale ? matchingSale.units_sold : 0;
        } catch (error) {
            console.error("Error fetching lag_7_units_sold:", error);
            return 0;
        }
    }

    // Check if date is weekend (0 = Sunday, 6 = Saturday)
    function isWeekend(date) {
        const day = date.getDay();
        return day === 0 || day === 6 ? 1 : 0;
    }

    // Get day of week (1 = Monday, 0 = Sunday)
    function getDayOfWeek(date) {
        const day = date.getDay();
        return day === 0 ? 0 : day;
    }

    // Make prediction for a single day
    async function makePrediction(productId, shopId, price, date, promotionFlag, lag7Units) {
        try {
            const dayOfWeek = getDayOfWeek(date);
            const weekend = isWeekend(date);

            const payload = {
                shop_id: shopId,
                product_id: productId,
                price: price,
                promotion_flag: promotionFlag ? 1 : 0,
                day_of_week: dayOfWeek,
                is_weekend: weekend,
                is_holiday: 0, // You can enhance this with holiday detection
                lag_7_units_sold: lag7Units
            };

            const res = await axios.post('http://127.0.0.1:5000/predict', payload);
            return res.data.prediction;
        } catch (error) {
            console.error("Prediction API error:", error);
            throw error;
        }
    }

    // Handle form submission
    async function handleForecast(e) {
        e.preventDefault();

        if (!selectedProduct || !startDate || !user?.shop_id) {
            setMessage({ text: "Please select a product and start date", type: "error" });
            return;
        }

        setLoading(true);
        setMessage({ text: "Generating forecast...", type: "info" });

        try {
            const shopId = user.shop_id;
            const productId = selectedProduct.id;
            const price = selectedProduct.price;
            let totalPrediction = 0;

            // Loop through 7 days and make predictions
            for (let i = 0; i < 7; i++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(currentDate.getDate() + i);

                // Get lag_7_units_sold for this date
                const lag7Units = await getLag7UnitsSold(productId, shopId, currentDate);

                // Make prediction for this day
                const prediction = await makePrediction(
                    productId,
                    shopId,
                    price,
                    currentDate,
                    promotionFlags[i],
                    lag7Units
                );

                totalPrediction += prediction;
            }

            // Round the total prediction
            const roundedPrediction = Math.round(totalPrediction);

            // Calculate end date (6 days after start date)
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 6);

            // Store prediction in database
            const predictionData = {
                shop_id: shopId,
                product_id: productId,
                start_date: startDate,
                end_date: endDate.toISOString().split('T')[0],
                predicted_units_for_week: roundedPrediction
            };

            await axios.post('/api/predictions', predictionData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMessage({ 
                text: `Forecast completed successfully! Predicted units for the week: ${roundedPrediction}`, 
                type: "success" 
            });

            // Reset form
            setSelectedProduct(null);
            setStartDate("");
            setPromotionFlags([false, false, false, false, false, false, false]);

        } catch (error) {
            console.error("Forecast error:", error);
            setMessage({ 
                text: "Failed to create forecast. Please try again.", 
                type: "error" 
            });
        } finally {
            setLoading(false);
        }
    }

    // Handle promotion flag toggle
    function togglePromotionFlag(index) {
        const newFlags = [...promotionFlags];
        newFlags[index] = !newFlags[index];
        setPromotionFlags(newFlags);
    }

    // Get day names for display
    function getDayName(dayIndex) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        if (!startDate) return days[dayIndex === 0 ? 0 : dayIndex];
        
        const date = new Date(startDate);
        date.setDate(date.getDate() + dayIndex);
        return days[date.getDay()];
    }

    return (
        <div className="sf-forecast-container">
            <div className="sf-forecast-card">
                <h1 className="sf-forecast-title">Sales Forecast</h1>
                <p className="sf-forecast-subtitle">Predict weekly sales using AI-powered forecasting</p>

                {message.text && (
                    <div className={`sf-message sf-message-${message.type}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleForecast} className="sf-forecast-form">
                    {/* Product Selection */}
                    <div className="sf-form-group">
                        <label className="sf-label">Select Product</label>
                        <select
                            className="sf-select"
                            value={selectedProduct?.id || ""}
                            onChange={(e) => {
                                const product = products.find(p => p.id === parseInt(e.target.value));
                                setSelectedProduct(product);
                            }}
                            required
                        >
                            <option value="">-- Choose a product --</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name} - ${product.price}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Start Date */}
                    <div className="sf-form-group">
                        <label className="sf-label">Start Date</label>
                        <input
                            type="date"
                            className="sf-input"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>

                    {/* Promotion Flags for 7 Days */}
                    <div className="sf-form-group">
                        <label className="sf-label">Promotion Schedule (7 Days)</label>
                        <div className="sf-promotion-grid">
                            {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
                                <div key={dayIndex} className="sf-promotion-day">
                                    <div className="sf-day-header">
                                        <span className="sf-day-name">{getDayName(dayIndex)}</span>
                                        <span className="sf-day-number">Day {dayIndex + 1}</span>
                                    </div>
                                    <label className="sf-checkbox-container">
                                        <input
                                            type="checkbox"
                                            checked={promotionFlags[dayIndex]}
                                            onChange={() => togglePromotionFlag(dayIndex)}
                                            className="sf-checkbox"
                                        />
                                        <span className="sf-checkbox-label">
                                            {promotionFlags[dayIndex] ? "Promotion Active" : "No Promotion"}
                                        </span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Selected Product Info */}
                    {selectedProduct && (
                        <div className="sf-product-info">
                            <h3 className="sf-info-title">Selected Product Details</h3>
                            <div className="sf-info-grid">
                                <div className="sf-info-item">
                                    <span className="sf-info-label">Product:</span>
                                    <span className="sf-info-value">{selectedProduct.name}</span>
                                </div>
                                <div className="sf-info-item">
                                    <span className="sf-info-label">Price:</span>
                                    <span className="sf-info-value">${selectedProduct.price}</span>
                                </div>
                                <div className="sf-info-item">
                                    <span className="sf-info-label">Shop:</span>
                                    <span className="sf-info-value">{user?.shop_id || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="sf-submit-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="sf-spinner"></span>
                                Generating Forecast...
                            </>
                        ) : (
                            "Generate Weekly Forecast"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}