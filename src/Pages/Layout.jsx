import { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import "./Layout.css";

export default function Layout() {
  const { user, token, setToken, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  async function handleLogout(e) {
    e.preventDefault();

    const res = await fetch('/api/logout', {
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      navigate('/');
    }
  }

  console.log(user?.role);

  const renderMenuItems = () => {
    if (user?.role === 'top_management') {
      return (
        <ul className="menu-list">
          <li><Link to="/top-manager">Home</Link></li>
          <li><Link to="/all-products/view">Products</Link></li>
          <li><Link to="/product-orders/stats">Product Order details</Link></li>
          <li><Link to="/employees">Employees</Link></li>
          <li><Link to="/purchase-order/stat">Anomaly Detections</Link></li>
          <li><Link to="/sales/stat">Sales Reports</Link></li>
        </ul>
      );
    } else if (user?.role === 'warehouse_manager') {
      return (
        <ul className="menu-list">
          <li><Link to="/warehouse-manager">Home</Link></li>
          <li><Link to="/suppliers">Create Suppliers</Link></li>
          <li><Link to="/rawmaterials/submit">Create RawMaterials</Link></li>
          <li><Link to="/suppliers/show">Show Suppliers</Link></li>
          <li><Link to="/rawmaterials/show">Raw Materials</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/products/show">View Products</Link></li>
          <li><Link to="/purchase-order/create">Purchase Orders</Link></li>
          <li><Link to="/purchase-order/view">View Purchase Orders</Link></li>
          <li><Link to="/products/show">Received Orders</Link></li>
        </ul>
      );
    } else if (user?.role === 'warehouse_storekeeper') {
      return (
        <ul className="menu-list">
          <li><Link to="/warehouse-manager">Home</Link></li>
          <li><Link to="/suppliers/show">Show Suppliers</Link></li>
          <li><Link to="/products/show">All Products</Link></li>
          <li><Link to="/delivery/view">Shipping Orders</Link></li>
          <li><Link to="/rawmaterials/show">Raw Materials</Link></li>
          <li><Link to="/products/orders/view">Product Orders</Link></li>
          <li><Link to="/purchase-order/received">Received Purchase Orders</Link></li>
        </ul>
      );
    } else if (user?.role === 'branch_manager') {
      return (
        <ul className="menu-list">
          <li><Link to="/branch-manager">Home</Link></li>
          <li><Link to="/products/orders">Product Orders</Link></li>
          <li><Link to="/sales/forecast/data">Forecast Data</Link></li>
          <li><Link to="/sales/forecast">Sales Forecast</Link></li>
          <li><Link to="/sales">Sales</Link></li>
          <li><Link to="/order/details/view">Order Management</Link></li>
        </ul>
      );
    } else if (user?.role === 'branch_storekeeper') {
      return (
        <ul className="menu-list">
          <li><Link to="/branch-manager">Home</Link></li>
          <li><Link to="/local/stock">Local Stock</Link></li>
          <li><Link to="/products/orders">Product Orders</Link></li>
          <li><Link to="/delivery/received">Received Orders</Link></li>
           <li><Link to="/sales/forecast/data">Forecast Data</Link></li>
          <li><Link to="/order/details/view">Order Management</Link></li>
        </ul>
      );
    }
    return null;
  };

  return (
    <div className="layout-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Supplynet X</h2>
          <div className="user-info">
            <p className="user-name">{user?.name}</p>
            <p className="user-role">{user?.role?.replace('_', ' ').toUpperCase()}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {renderMenuItems()}
        </nav>

        <div className="sidebar-footer">
          <form onSubmit={handleLogout}>
            <button className="logout-btn">Logout</button>
          </form>
        </div>
      </div>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}