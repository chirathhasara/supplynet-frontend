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
          <li><Link to="/dashboard">Products</Link></li>
          <li><Link to="/analytics">Business Analytics</Link></li>
          <li><Link to="/reports">Employees</Link></li>
          <li><Link to="/strategy">Anomaly Detections</Link></li>
          <li><Link to="/performance">Sales Reports</Link></li>
        </ul>
      );
    } else if (user?.role === 'warehouse_manager') {
      return (
        <ul className="menu-list">
          <li><Link to="/warehouse-manager">Home</Link></li>
          <li><Link to="/suppliers">Create Suppliers</Link></li>
          <li><Link to="/suppliers/show">Show Suppliers</Link></li>
          <li><Link to="/products/show">Raw Materials</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/products/show">View Products</Link></li>
          <li><Link to="/products/show">Purchase Orders</Link></li>
          <li><Link to="/products/show">Received Orders</Link></li>
        </ul>
      );
    } else if (user?.role === 'warehouse_storekeeper') {
      return (
        <ul className="menu-list">
          <li><Link to="/stock">Stock Management</Link></li>
          <li><Link to="/products/show">Received Orders</Link></li>
          <li><Link to="/shipping">Shipping Orders</Link></li>
          <li><Link to="/tracking">Item Tracking</Link></li>
          <li><Link to="/products/orders/view">Product Orders</Link></li>
          <li><Link to="/reports">Daily Reports</Link></li>
        </ul>
      );
    } else if (user?.role === 'branch_manager') {
      return (
        <ul className="menu-list">
          <li><Link to="/branch">Branch Overview</Link></li>
          <li><Link to="/sales">Sales Management</Link></li>
          <li><Link to="/customers">Customer Relations</Link></li>
          <li><Link to="/orders">Order Management</Link></li>
        </ul>
      );
    } else if (user?.role === 'branch_storekeeper') {
      return (
        <ul className="menu-list">
          <li><Link to="/local-stock">Local Stock</Link></li>
          <li><Link to="/products/orders">Product Orders</Link></li>
          <li><Link to="/returns">Received Orders</Link></li>
          <li><Link to="/requests">Errors Update</Link></li>
          <li><Link to="/daily-tasks">Daily Tasks</Link></li>
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