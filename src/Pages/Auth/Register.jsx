import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const { token, setToken } = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role:"", 
  });

  const [errors, setErrors] = useState({});

  async function handleRegister(e) {
    e.preventDefault();

    const res = await fetch("/api/register", {
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
      navigate("/");
    }
  }

  function handleName(e) {
    setFormData((f) => ({ ...f, name: e.target.value }));
  }

  function handleEmail(e) {
    setFormData((f) => ({ ...f, email: e.target.value }));
  }

  function handlePassword(e) {
    setFormData((f) => ({ ...f, password: e.target.value }));
  }

  function handlePasswordConfirmation(e) {
    setFormData((f) => ({ ...f, password_confirmation: e.target.value }));
  }

  function handleRole(e) {
    setFormData((f) => ({ ...f, role: e.target.value }));
  }

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="register-box">
          <h1 className="register-title">Welcome to Supplynet X</h1>
          <p className="register-subtitle">Sign up to optimize your supply chain performance</p>

          <form className="register-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleName}
                className="form-input"
              />
              {errors.name && <p className="error">{errors.name[0]}</p>}
            </div>

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

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={formData.password_confirmation}
                onChange={handlePasswordConfirmation}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select
                value={formData.role}
                onChange={handleRole}
                className="form-input"
              >
                <option value="top_management">Top Management</option>
                <option value="warehouse_manager">Warehouse Managers</option>
                <option value="warehouse_storekeeper">Warehouse Storekeepers</option>
                <option value="branch_manager">Branch Managers</option>
                <option value="branch_storekeeper">Branch Storekeepers</option>

              </select>
              {errors.role && <p className="error">{errors.role[0]}</p>}
            </div>

            
            <button className="register-btn">Sign Up to Dashboard</button>
          </form>

          <a href="/" className="forgot-password2"> or Log In</a>

        </div>
      </div>

      <div className="register-right">
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