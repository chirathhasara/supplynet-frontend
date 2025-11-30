import React from 'react';
import './Dashboard.css';

export default function WhmDashboard() {
  const stats = [
    { id: 1, title: 'Total Inventory', value: '12,458', change: '+12%', icon: '📦', trend: 'up' },
    { id: 2, title: 'Orders Pending', value: '248', change: '-5%', icon: '⏳', trend: 'down' },
    { id: 3, title: 'Active Shipments', value: '89', change: '+8%', icon: '🚚', trend: 'up' },
    { id: 4, title: 'Warehouse Capacity', value: '78%', change: '+3%', icon: '📊', trend: 'up' }
  ];

  const recentOrders = [
    { id: 'ORD-001', item: 'Electronic Components', quantity: 500, status: 'Processing', time: '2 mins ago' },
    { id: 'ORD-002', item: 'Raw Materials', quantity: 1200, status: 'Shipped', time: '15 mins ago' },
    { id: 'ORD-003', item: 'Packaging Supplies', quantity: 800, status: 'Delivered', time: '1 hour ago' },
    { id: 'ORD-004', item: 'Machine Parts', quantity: 350, status: 'Processing', time: '2 hours ago' }
  ];

  return (
    <div className="whm-dashboard-container">
      <div className="whm-dashboard-header">
        <div className="whm-header-content">
          <h1 className="whm-dashboard-title">Warehouse Dashboard</h1>
          <p className="whm-dashboard-subtitle">Monitor your warehouse operations in real-time</p>
        </div>
        <div className="whm-header-actions">
          <button className="whm-btn-primary">
            <span className="whm-btn-icon">➕</span>
            New Order
          </button>
        </div>
      </div>

      <div className="whm-stats-grid">
        {stats.map((stat) => (
          <div key={stat.id} className="whm-stat-card whm-fade-in">
            <div className="whm-stat-icon-wrapper">
              <span className="whm-stat-icon">{stat.icon}</span>
            </div>
            <div className="whm-stat-content">
              <p className="whm-stat-title">{stat.title}</p>
              <h3 className="whm-stat-value">{stat.value}</h3>
              <div className={`whm-stat-change ${stat.trend === 'up' ? 'whm-trend-up' : 'whm-trend-down'}`}>
                <span className="whm-trend-icon">{stat.trend === 'up' ? '↑' : '↓'}</span>
                <span>{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="whm-content-grid">
        <div className="whm-card whm-slide-up">
          <div className="whm-card-header">
            <h2 className="whm-card-title">Recent Orders</h2>
            <button className="whm-btn-text">View All</button>
          </div>
          <div className="whm-orders-list">
            {recentOrders.map((order) => (
              <div key={order.id} className="whm-order-item">
                <div className="whm-order-info">
                  <h4 className="whm-order-id">{order.id}</h4>
                  <p className="whm-order-item-name">{order.item}</p>
                  <span className="whm-order-quantity">Qty: {order.quantity}</span>
                </div>
                <div className="whm-order-meta">
                  <span className={`whm-order-status whm-status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                  <span className="whm-order-time">{order.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="whm-card whm-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="whm-card-header">
            <h2 className="whm-card-title">Quick Actions</h2>
          </div>
          <div className="whm-quick-actions">
            <button className="whm-action-btn">
              <span className="whm-action-icon">📥</span>
              <span className="whm-action-text">Receive Stock</span>
            </button>
            <button className="whm-action-btn">
              <span className="whm-action-icon">📤</span>
              <span className="whm-action-text">Dispatch Order</span>
            </button>
            <button className="whm-action-btn">
              <span className="whm-action-icon">📋</span>
              <span className="whm-action-text">Inventory Check</span>
            </button>
            <button className="whm-action-btn">
              <span className="whm-action-icon">📊</span>
              <span className="whm-action-text">Generate Report</span>
            </button>
          </div>
        </div>
      </div>

      <div className="whm-analytics-section whm-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="whm-card">
          <div className="whm-card-header">
            <h2 className="whm-card-title">Warehouse Performance</h2>
          </div>
          <div className="whm-performance-grid">
            <div className="whm-performance-item">
              <div className="whm-performance-bar" style={{ width: '85%' }}></div>
              <p className="whm-performance-label">Storage Efficiency</p>
              <span className="whm-performance-value">85%</span>
            </div>
            <div className="whm-performance-item">
              <div className="whm-performance-bar" style={{ width: '92%' }}></div>
              <p className="whm-performance-label">Order Accuracy</p>
              <span className="whm-performance-value">92%</span>
            </div>
            <div className="whm-performance-item">
              <div className="whm-performance-bar" style={{ width: '78%' }}></div>
              <p className="whm-performance-label">Dispatch Time</p>
              <span className="whm-performance-value">78%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}