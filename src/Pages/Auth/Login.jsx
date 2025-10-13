import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import "./Login.css"; // Import CSS file

export default function Login() {
  const navigate = useNavigate();
  const { token, setToken } = useContext(AppContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  async function handleLogin(e) {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "post",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.errors) {
      setErrors(data.errors);
    } else {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      navigate("/warehouse-manager");
    }
  }

  function handleEmail(e) {
    setFormData((f) => ({ ...f, email: e.target.value }));
  }

  function handlePassword(e) {
    setFormData((f) => ({ ...f, password: e.target.value }));
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-box">
          <h1 className="login-title">Welcome to Supplynet X</h1>
          <p className="login-subtitle">Sign in to optimize your supply chain performance</p>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="text"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleEmail}
                className="form-input"
              />
              {errors.email && <p className="error">{errors.email[0]}</p>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handlePassword}
                className="form-input"
              />
              {errors.password && <p className="error">{errors.password[0]}</p>}
            </div>

            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="/register" className="forgot-password">Register</a>
            </div>

            <button className="login-btn">Sign In to Dashboard</button>
          </form>
        </div>
      </div>
      <div className="login-right">
        <div className="stats">
          <div className="stat-card">
            <h3>500K+</h3>
            <p>Orders Tracked</p>
          </div>
          <div className="stat-card">
            <h3>98%</h3>
            <p>Delivery Rate</p>
          </div>
        </div>

        <div className="hero-content">
          <h2>Optimize Supply Chain with AI-Powered Analytics</h2>
          <p>Supplynet X combines advanced supply chain analytics with intelligent optimization to help you streamline operations and reduce costs.</p>

          <div className="features">
            <div className="feature">
              <span className="feature-dot"></span>
              Real-time inventory monitoring
            </div>
            <div className="feature">
              <span className="feature-dot"></span>
              AI-powered demand forecasting
            </div>
            <div className="feature">
              <span className="feature-dot"></span>
              Supply Chain Optimization
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}