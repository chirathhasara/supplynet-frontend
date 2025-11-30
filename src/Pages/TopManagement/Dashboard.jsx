import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    totalSuppliers: 0,
    totalProducts: 0,
    warehouseStock: 0,
    branchStock: 0,
  });

  useEffect(() => {
    // Simulated data - replace with actual API calls
    setTimeout(() => {
      setStats({
        totalOrders: 1248,
        pendingOrders: 87,
        completedOrders: 1161,
        totalRevenue: 2456789,
        totalSuppliers: 45,
        totalProducts: 234,
        warehouseStock: 15678,
        branchStock: 8934,
      });
    }, 300);
  }, []);

  const dashboardCards = [
    {
      id: 1,
      title: "Total Orders",
      value: stats.totalOrders,
      icon: "📦",
      color: "blue",
      trend: "+12%",
    },
    {
      id: 2,
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: "⏳",
      color: "orange",
      trend: "-5%",
    },
    {
      id: 3,
      title: "Completed Orders",
      value: stats.completedOrders,
      icon: "✅",
      color: "green",
      trend: "+8%",
    },
    {
      id: 4,
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: "💰",
      color: "purple",
      trend: "+15%",
    },
    {
      id: 5,
      title: "Total Suppliers",
      value: stats.totalSuppliers,
      icon: "🏢",
      color: "cyan",
      trend: "+3",
    },
    {
      id: 6,
      title: "Total Products",
      value: stats.totalProducts,
      icon: "📊",
      color: "indigo",
      trend: "+18",
    },
    {
      id: 7,
      title: "Warehouse Stock",
      value: stats.warehouseStock,
      icon: "🏭",
      color: "teal",
      trend: "+7%",
    },
    {
      id: 8,
      title: "Branch Stock",
      value: stats.branchStock,
      icon: "🏪",
      color: "blue",
      trend: "+4%",
    },
  ];

  const quickActions = [
    {
      title: "Product Order Statistics",
      description: "View detailed product order analytics",
      icon: "📈",
      path: "/top-management/product-order-stats",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Purchase Order Statistics",
      description: "Monitor purchase order trends",
      icon: "📊",
      path: "/top-management/purchase-order-stats",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      title: "Stock Overview",
      description: "View all warehouse and branch stocks",
      icon: "📦",
      path: "/top-management/show-stocks",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
  ];

  return (
    <div className="topMgmtDashboard__container">
      <div className="topMgmtDashboard__header">
        <div className="topMgmtDashboard__headerContent">
          <h1 className="topMgmtDashboard__title">
            <span className="topMgmtDashboard__titleIcon">📊</span>
            Top Management Dashboard
          </h1>
          <p className="topMgmtDashboard__subtitle">
            Welcome back! Here's your business overview
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="topMgmtDashboard__statsGrid">
        {dashboardCards.map((card, index) => (
          <div
            key={card.id}
            className={`topMgmtDashboard__statCard topMgmtDashboard__statCard--${card.color}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="topMgmtDashboard__statCardTop">
              <div className="topMgmtDashboard__statIcon">{card.icon}</div>
              <span
                className={`topMgmtDashboard__statTrend ${
                  card.trend.includes("+")
                    ? "topMgmtDashboard__statTrend--positive"
                    : "topMgmtDashboard__statTrend--negative"
                }`}
              >
                {card.trend}
              </span>
            </div>
            <div className="topMgmtDashboard__statValue">{card.value}</div>
            <div className="topMgmtDashboard__statTitle">{card.title}</div>
            <div className="topMgmtDashboard__statCardGlow"></div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="topMgmtDashboard__quickActionsSection">
        <h2 className="topMgmtDashboard__sectionTitle">Quick Actions</h2>
        <div className="topMgmtDashboard__quickActionsGrid">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="topMgmtDashboard__actionCard"
              onClick={() => navigate(action.path)}
              style={{
                background: action.gradient,
                animationDelay: `${index * 0.15}s`,
              }}
            >
              <div className="topMgmtDashboard__actionIcon">{action.icon}</div>
              <h3 className="topMgmtDashboard__actionTitle">{action.title}</h3>
              <p className="topMgmtDashboard__actionDescription">
                {action.description}
              </p>
              <div className="topMgmtDashboard__actionArrow">→</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="topMgmtDashboard__activitySection">
        <h2 className="topMgmtDashboard__sectionTitle">System Status</h2>
        <div className="topMgmtDashboard__activityGrid">
          <div className="topMgmtDashboard__activityCard">
            <div className="topMgmtDashboard__activityIcon topMgmtDashboard__activityIcon--success">
              ✓
            </div>
            <div className="topMgmtDashboard__activityContent">
              <h4 className="topMgmtDashboard__activityTitle">
                System Operational
              </h4>
              <p className="topMgmtDashboard__activityText">
                All systems running smoothly
              </p>
            </div>
          </div>
          <div className="topMgmtDashboard__activityCard">
            <div className="topMgmtDashboard__activityIcon topMgmtDashboard__activityIcon--info">
              ⓘ
            </div>
            <div className="topMgmtDashboard__activityContent">
              <h4 className="topMgmtDashboard__activityTitle">
                Active Users: 24
              </h4>
              <p className="topMgmtDashboard__activityText">
                Currently online across all branches
              </p>
            </div>
          </div>
          <div className="topMgmtDashboard__activityCard">
            <div className="topMgmtDashboard__activityIcon topMgmtDashboard__activityIcon--warning">
              🔔
            </div>
            <div className="topMgmtDashboard__activityContent">
              <h4 className="topMgmtDashboard__activityTitle">
                3 Notifications
              </h4>
              <p className="topMgmtDashboard__activityText">
                Pending approvals and updates
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
