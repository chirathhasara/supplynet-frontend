import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import "./ReceivedProducts.css";

export default function ReceivedProducts() {
  const { user } = useContext(AppContext);
  const [deliveries, setDeliveries] = useState([]);
  const [products , setProducts] = useState([]);
  const [acceptOrders , setAcceptOrders] = useState([]);
  const navigate = useNavigate();

  async function getDeliveries() {
    try {
      const res = await axios.get(`/api/deliveries/get-shops/${user.shop_id}`);
      setDeliveries(res.data || []); // ✅ use res.data
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    }
  }

  async function getAcceptedOrders(){
    try{
      const res = await axios.get('/api/accept-products')
      setAcceptOrders(res.data.data);
    }catch(error){
      console.log(error);
    }
  }

  async function getProducts(){
    try{
      const res = await axios.get('/api/products');
      setProducts(res.data.data);
    }catch(error){
      console.log(`error is ${error}`);
    }
  }

  useEffect(()=>{
    getProducts();
    getAcceptedOrders();
  },[]);

  useEffect(() => {
    if (user?.shop_id) {
      getDeliveries();
    }
  }, [user]);

  function handleAcceptDelivery(delivery) {
    navigate("/delivery/accept", { state: { delivery } });
  }

  return (
    <div className="received-products-container">
      <h2 className="received-products-title">Received Deliveries</h2>

      {deliveries.length === 0 ? (
        <p className="no-deliveries-text">No deliveries available.</p>
      ) : (
        deliveries.map((delivery, index) => {
          const productList = JSON.parse(delivery.products || "[]");

          const acceptOrder = acceptOrders.find(a=> a.delivery_id == delivery.id);
         

          return (
            <div className="delivery-card" key={index}>
              <div className="delivery-header">
                <h3>Delivery #{delivery.id}</h3>
                <p>Date: {delivery.date}</p>
                <p>Order ID: {delivery.product_orders_id}</p>
              </div>

              <div className="delivery-products">
                <h4>Products:</h4>
                <ul>
                  {productList.map((item, i) => {
                    const productName = products.find(p=> p.id == item.product_id)
                    return(
                      <li key={i} className="product-item">
                      <span>Product: {productName ? productName.name : item.product_id}</span>
                      <span>Units: {item.units}</span>
                    </li>
                    )
                    
                     })}
                </ul>
              </div>

              <div className="delivery-actions">
                {acceptOrder ? <button>Accepted</button>:<>
                <button
                  className="accept-btn"
                  onClick={() => handleAcceptDelivery(delivery)}
                >
                  Accept Order
                </button>
                <button className="reject-btn">Reject Full Order</button></>}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
