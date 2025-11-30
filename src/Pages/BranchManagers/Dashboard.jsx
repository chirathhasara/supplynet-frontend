import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../Context/AppContext';
import './Dashboard.css';

export default function BranchManagerDashboard() {
  const { user } = useContext(AppContext);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const metrics = [
    { 
      id: 1, 
      title: 'Branch Performance', 
      value: '94.5%', 
      change: '+5.2%', 
      icon: '📈', 
      trend: 'up',
      color: 'primary'
    },
    { 
      id: 2, 
      title: 'Active Orders', 
      value: '156', 
      change: '+12', 
      icon: '🛒', 
      trend: 'up',
      color: 'success'
    },
    { 
      id: 3, 
      title: 'Stock Levels', 
      value: '87%', 
      change: '-3%', 
      icon: '📦', 
      trend: 'down',
      color: 'warning'
    },
    { 
      id: 4, 
      title: 'Team Members', 
      value: '24', 
      change: '+2', 
      icon: '👥', 
      trend: 'up',
      color: 'info'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'New order received', user: 'Branch Store', time: '5 mins ago', status: 'new' },
    { id: 2, action: 'Stock replenishment completed', user: 'Warehouse', time: '20 mins ago', status: 'completed' },
    { id: 3, action: 'Product delivery confirmed', user: 'Customer', time: '45 mins ago', status: 'completed' },
    { id: 4, action: 'Low stock alert', user: 'System', time: '1 hour ago', status: 'alert' },
    { id: 5, action: 'Order dispatched', user: 'Store Keeper', time: '2 hours ago', status: 'pending' }
  ];

  const quickActions = [
    { id: 1, title: 'View Orders', icon: '📋', color: 'blue', path: '/orders' },
    { id: 2, title: 'Manage Stock', icon: '📊', color: 'green', path: '/stock' },
    { id: 3, title: 'Team Management', icon: '👨‍💼', color: 'purple', path: '/team' },
    { id: 4, title: 'Reports', icon: '📑', color: 'orange', path: '/reports' },
    { id: 5, title: 'Settings', icon: '⚙️', color: 'gray', path: '/settings' },
    { id: 6, title: 'Notifications', icon: '🔔', color: 'red', path: '/notifications' }
  ];

  const branchStats = [
    { label: 'Daily Revenue', value: '$12,540', icon: '💰' },
    { label: 'Orders Today', value: '48', icon: '📦' },
    { label: 'Avg. Response Time', value: '15 min', icon: '⏱️' },
    { label: 'Customer Satisfaction', value: '4.8/5', icon: '⭐' }
  ];

  return (
    <div className="bm-dashboard-wrapper">
      {/* Header Section */}
      <div className="bm-dashboard-header">
        <div className="bm-header-left">
          <div className="bm-greeting-section">
            <h1 className="bm-greeting-title">
              Welcome back, <span className="bm-username">{user?.name || 'Branch Manager'}</span>
            </h1>
            <p className="bm-greeting-subtitle">
              Here's what's happening with your branch today
            </p>
          </div>
        </div>
        <div className="bm-header-right">
          <div className="bm-time-widget">
            <div className="bm-time-icon">🕐</div>
            <div className="bm-time-content">
              <div className="bm-current-time">{currentTime.toLocaleTimeString()}</div>
              <div className="bm-current-date">{currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="bm-metrics-grid">
        {metrics.map((metric, index) => (
          <div 
            key={metric.id} 
            className={`bm-metric-card bm-metric-${metric.color} bm-animate-slide-up`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="bm-metric-icon-wrapper">
              <span className="bm-metric-icon">{metric.icon}</span>
            </div>
            <div className="bm-metric-details">
              <h3 className="bm-metric-title">{metric.title}</h3>
              <div className="bm-metric-value-row">
                <span className="bm-metric-value">{metric.value}</span>
                <span className={`bm-metric-change bm-trend-${metric.trend}`}>
                  <span className="bm-trend-arrow">{metric.trend === 'up' ? '↑' : '↓'}</span>
                  {metric.change}
                </span>
              </div>
            </div>
            <div className="bm-metric-overlay"></div>
          </div>
        ))}
      </div>

      {/* Branch Stats Bar */}
      <div className="bm-stats-bar bm-animate-fade-in">
        {branchStats.map((stat, index) => (
          <div key={index} className="bm-stat-item">
            <span className="bm-stat-icon">{stat.icon}</span>
            <div className="bm-stat-content">
              <div className="bm-stat-label">{stat.label}</div>
              <div className="bm-stat-value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="bm-content-grid">
        {/* Recent Activities */}
        <div className="bm-card bm-activities-card bm-animate-slide-up">
          <div className="bm-card-header">
            <h2 className="bm-card-title">
              <span className="bm-title-icon">📊</span>
              Recent Activities
            </h2>
            <button className="bm-btn-link">View All</button>
          </div>
          <div className="bm-card-body">
            <div className="bm-activities-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="bm-activity-item">
                  <div className={`bm-activity-indicator bm-status-${activity.status}`}></div>
                  <div className="bm-activity-content">
                    <p className="bm-activity-action">{activity.action}</p>
                    <div className="bm-activity-meta">
                      <span className="bm-activity-user">{activity.user}</span>
                      <span className="bm-activity-divider">•</span>
                      <span className="bm-activity-time">{activity.time}</span>
                    </div>
                  </div>
                  <span className={`bm-activity-badge bm-badge-${activity.status}`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bm-card bm-actions-card bm-animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="bm-card-header">
            <h2 className="bm-card-title">
              <span className="bm-title-icon">⚡</span>
              Quick Actions
            </h2>
          </div>
          <div className="bm-card-body">
            <div className="bm-quick-actions-grid">
              {quickActions.map((action) => (
                <button 
                  key={action.id} 
                  className={`bm-action-button bm-action-${action.color}`}
                  onClick={() => console.log(`Navigate to ${action.path}`)}
                >
                  <span className="bm-action-icon">{action.icon}</span>
                  <span className="bm-action-title">{action.title}</span>
                  <div className="bm-action-ripple"></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart Section */}
      <div className="bm-chart-section bm-animate-fade-in">
        <div className="bm-card bm-chart-card">
          <div className="bm-card-header">
            <h2 className="bm-card-title">
              <span className="bm-title-icon">📈</span>
              Performance Overview
            </h2>
            <div className="bm-chart-controls">
              <button className="bm-chart-btn bm-active">Week</button>
              <button className="bm-chart-btn">Month</button>
              <button className="bm-chart-btn">Year</button>
            </div>
          </div>
          <div className="bm-card-body">
            <div className="bm-chart-placeholder">
              <div className="bm-chart-bars">
                <div className="bm-bar" style={{ height: '60%' }}><span className="bm-bar-label">Mon</span></div>
                <div className="bm-bar" style={{ height: '75%' }}><span className="bm-bar-label">Tue</span></div>
                <div className="bm-bar" style={{ height: '85%' }}><span className="bm-bar-label">Wed</span></div>
                <div className="bm-bar" style={{ height: '70%' }}><span className="bm-bar-label">Thu</span></div>
                <div className="bm-bar" style={{ height: '90%' }}><span className="bm-bar-label">Fri</span></div>
                <div className="bm-bar" style={{ height: '65%' }}><span className="bm-bar-label">Sat</span></div>
                <div className="bm-bar" style={{ height: '50%' }}><span className="bm-bar-label">Sun</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
