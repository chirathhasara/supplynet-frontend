import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../Context/AppContext";
import './Show.css';

export default function ViewProducts() {

  const { token } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  

  useEffect(() => {
   
    fetchProducts();
  },[]);

   async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch('/api/products', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await res.json();

        console.log(data);

        setProducts(data.data || []);
      } catch (err) {
        setError(err.message || 'Error fetching products');
      } finally {
        setLoading(false);
      }
    }

  console.log(products);



  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (units) => {
    if (units === 0) return { status: 'out-of-stock', text: 'Out of Stock' };
    if (units < 10) return { status: 'low-stock', text: 'Low Stock' };
    return { status: 'in-stock', text: 'In Stock' };
  };

  const handleUpdate = (productId) => {
    // Update function will be implemented later
    console.log('Update product:', productId);
  };

  const handleDelete = (productId) => {
    // Delete function will be implemented later
    console.log('Delete product:', productId);
  };

  if (loading) {
    return (
      <div className="products-container">
        <div className="loading-wrapper">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-container">
        <div className="error-wrapper">
          <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="error-text">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-wrapper">
        <div className="products-header">
          <div className="header-content">
            <h1 className="products-title">Product Inventory</h1>
            <p className="products-subtitle">Manage your product catalog</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{products.length}</span>
              <span className="stat-label">Total Products</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{products.filter(p => p.units > 0).length}</span>
              <span className="stat-label">In Stock</span>
            </div>
          </div>
        </div>

        <div className="products-controls">
          <div className="search-wrapper">
            <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="empty-title">No products found</h3>
            <p className="empty-description">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first product'}
            </p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.units);
              return (
                <div key={product.id} className="product-card">
                  <div className="product-image-wrapper">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgNzVIMTc1VjEyNUgxMjVWNzVaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIxNDAiIGN5PSI5MCIgcj0iNSIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                      }}
                    />
                    <div className={`stock-badge ${stockStatus.status}`}>
                      {stockStatus.text}
                    </div>
                  </div>

                  <div className="product-content">
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-details">
                        <div className="product-price">
                          <span className="price-label">Price:</span>
                          <span className="price-value">${product.price}</span>
                        </div>
                        <div className="product-units">
                          <span className="units-label">Units:</span>
                          <span className={`units-value ${product.units === 0 ? 'out-of-stock' : ''}`}>
                            {product.units}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="product-actions">
                      <button
                        className="action-btn update-btn"
                        onClick={() => handleUpdate(product.id)}
                        title="Update Product"
                      >
                        <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Update
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(product.id)}
                        title="Delete Product"
                      >
                        <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}