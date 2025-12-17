import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Package,
  Store,
  TrendingUp,
  MapPin,
  Phone,
  Layers,
  ArrowLeft,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Box
} from 'lucide-react';
import './ShowStocks.css';
import { AppContext } from '../../Context/AppContext';

export default function ShowStocks() {
  const {token} = useContext(AppContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProducts, setExpandedProducts] = useState(new Set());
  const [sortBy, setSortBy] = useState('name'); // name, stock, shops

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/api/products-with-shops', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      setProducts(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (productId) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  const filteredProducts = products
    .filter(product =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.product_name.localeCompare(b.product_name);
      } else if (sortBy === 'stock') {
        return b.total_stock_across_shops - a.total_stock_across_shops;
      } else if (sortBy === 'shops') {
        return b.total_shops - a.total_shops;
      }
      return 0;
    });

  const totalProducts = products.length;
  const totalShops = new Set(products.flatMap(p => p.shops.map(s => s.shop_id))).size;
  const totalStock = products.reduce((sum, p) => sum + p.total_stock_across_shops, 0);

  if (loading) {
    return (
      <div className="show-stocks-container">
        <div className="show-stocks-loading">
          <div className="show-stocks-spinner"></div>
          <p>Loading Products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="show-stocks-container">
        <div className="show-stocks-error">
          <Package size={48} />
          <p>Error: {error}</p>
          <button onClick={fetchProducts} className="show-stocks-retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="show-stocks-container">
      {/* Back Button */}
      <button
        onClick={() => navigate('/warehouse-manager')}
        className="show-stocks-back-btn"
      >
        <ArrowLeft size={20} />
        Go Back
      </button>

      {/* Header */}
      <div className="show-stocks-header">
        <h1 className="show-stocks-title">Product & Stock Management</h1>
        <p className="show-stocks-subtitle">
          Comprehensive overview of products across all shops
        </p>
      </div>

      {/* Summary Cards */}
      <div className="show-stocks-summary-grid">
        <div className="show-stocks-summary-card show-stocks-card-blue">
          <div className="show-stocks-summary-icon">
            <Package size={32} />
          </div>
          <div className="show-stocks-summary-content">
            <p className="show-stocks-summary-label">Total Products</p>
            <h3 className="show-stocks-summary-value">{totalProducts}</h3>
          </div>
        </div>

        <div className="show-stocks-summary-card show-stocks-card-white">
          <div className="show-stocks-summary-icon">
            <Store size={32} />
          </div>
          <div className="show-stocks-summary-content">
            <p className="show-stocks-summary-label">Active Shops</p>
            <h3 className="show-stocks-summary-value">{totalShops}</h3>
          </div>
        </div>

        <div className="show-stocks-summary-card show-stocks-card-blue">
          <div className="show-stocks-summary-icon">
            <Layers size={32} />
          </div>
          <div className="show-stocks-summary-content">
            <p className="show-stocks-summary-label">Total Stock</p>
            <h3 className="show-stocks-summary-value">{totalStock.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="show-stocks-controls">
        <div className="show-stocks-search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="show-stocks-search-input"
          />
        </div>

        <div className="show-stocks-sort-box">
          <Filter size={20} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="show-stocks-sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="stock">Sort by Stock</option>
            <option value="shops">Sort by Shops</option>
          </select>
        </div>
      </div>

      {/* Products List */}
      <div className="show-stocks-products-list">
        {filteredProducts.map((product, index) => (
          <div
            key={product.product_id}
            className="show-stocks-product-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Product Header */}
            <div
              className="show-stocks-product-header"
              onClick={() => toggleExpand(product.product_id)}
            >
              <div className="show-stocks-product-info">
                <div className="show-stocks-product-icon">
                  <Box size={24} />
                </div>
                <div>
                  <h3 className="show-stocks-product-name">
                    {product.product_name}
                  </h3>
                  <p className="show-stocks-product-meta">
                    {product.product_price && (
                      <span className="show-stocks-price">
                        Rs {Number(product.product_price).toFixed(2)}
                      </span>
                    )}
                    <span className="show-stocks-shops-count">
                      <Store size={14} /> {product.total_shops} shops
                    </span>
                    <span className="show-stocks-stock-count">
                      <Layers size={14} /> {product.total_stock_across_shops} units
                    </span>
                  </p>
                </div>
              </div>

              <button className="show-stocks-expand-btn">
                {expandedProducts.has(product.product_id) ? (
                  <ChevronUp size={24} />
                ) : (
                  <ChevronDown size={24} />
                )}
              </button>
            </div>

            {/* Shops Details */}
            {expandedProducts.has(product.product_id) && (
              <div className="show-stocks-shops-grid">
                {product.shops.map((shop) => (
                  <div key={shop.shop_id} className="show-stocks-shop-card">
                    <div className="show-stocks-shop-header">
                      <Store size={20} />
                      <h4 className="show-stocks-shop-name">{shop.shop_name}</h4>
                    </div>

                    <div className="show-stocks-shop-details">
                      <div className="show-stocks-shop-detail">
                        <MapPin size={16} />
                        <span>{shop.shop_location}</span>
                      </div>
                      <div className="show-stocks-shop-detail">
                        <Phone size={16} />
                        <span>{shop.shop_mobile}</span>
                      </div>
                      <div className="show-stocks-shop-detail show-stocks-stock-detail">
                        <Layers size={16} />
                        <span className="show-stocks-stock-value">
                          Stock: {shop.stock} units
                        </span>
                      </div>
                    </div>

                    {/* Stock Progress Bar */}
                    <div className="show-stocks-progress-bar">
                      <div
                        className="show-stocks-progress-fill"
                        style={{
                          width: `${Math.min(
                            (shop.stock / product.total_stock_across_shops) * 100,
                            100
                          )}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="show-stocks-empty">
          <Package size={64} />
          <p>No products found</p>
        </div>
      )}
    </div>
  );
}