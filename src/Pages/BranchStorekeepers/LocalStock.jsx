import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./LocalStock.css";
import { AppContext } from "../../Context/AppContext";

export default function LocalStock() {
  const [products, setProducts] = useState([]);
  const [shopName, setShopName] = useState("");
  const [loading, setLoading] = useState(true);
  const {user , token} = useContext(AppContext);

  async function fetchProducts() {

     if (!user?.shop_id) return;
     
      try {
        const res = await axios.get(`/api/shops/${user.shop_id}/products`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setProducts(res.data.products);
        setShopName(res.data.shop_name);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }


  useEffect(() => {
    
    fetchProducts();
  }, [user]);

  if (loading) return <div className="sst-loading">Loading...</div>;

  return (
    <div className="sst-container">
      <h2 className="sst-title">Stocks for {shopName}</h2>
      {products.length === 0 ? (
        <p className="sst-empty">No products found for this shop.</p>
      ) : (
        <table className="sst-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.product_id}>
                <td>{p.product_id}</td>
                <td>{p.product_name}</td>
                <td>{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
