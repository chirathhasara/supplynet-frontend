import { useContext, useState } from "react"
import { AppContext } from "../../Context/AppContext";
import { useNavigate } from "react-router-dom";
import './Create.css';

export default function Create(){

  const {token} = useContext(AppContext);
  
  const navigate = useNavigate();

const [formData , setFormData] = useState({
  name: '',
  image: null,
  price: '',
  units: '',
});

function handleName(e) {
  setFormData({ ...formData, name: e.target.value });
}

function handleImage(e) {
  setFormData({ ...formData, image: e.target.files[0] });
}

function handlePrice(e) {
  setFormData({ ...formData, price: e.target.value });
}

function handleUnits(e) {
  setFormData({ ...formData, units: e.target.value });
}

const [errors , setErrors] = useState({});
const [message, setMessage] = useState("");

async function handleCreate(e){
  e.preventDefault();

  const body = new FormData();
  body.append("name", formData.name);
  body.append("price", formData.price);
  body.append("units", formData.units);
  body.append("image", formData.image);
  
  
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body,
  });

  const data = await res.json();
  if (data.errors) {
    setErrors(data.errors);
    setMessage("");
  } else {
    setMessage(data.message || "Product created successfully.");
    setFormData({
      name: '',
      image: null,
      price: '',
      units: '',
    });
    setErrors({});
  }
}

  return (
  <div className="create-product-container">
    <div className="create-product-wrapper">
      <form className="create-product-form" onSubmit={handleCreate} encType="multipart/form-data">
        <div className="form-header">
          <h2 className="form-title">Create New Product</h2>
          <p className="form-subtitle">Add a new product to your inventory</p>
        </div>

        {message && (
          <div className="form-message success-message">
            <svg className="message-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {message}
          </div>
        )}

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Product Name
              <span className="required-indicator">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleName}
              className={`form-input ${errors.name ? 'input-error' : ''}`}
              maxLength={255}
              required
              placeholder="Enter product name"
            />
            {errors.name && (
              <span className="error-text">
                <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.name}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="image" className="form-label">
              Product Image
            </label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="image"
                accept=".jpg,.jpeg,.png,.gif"
                onChange={handleImage}
                className={`file-input ${errors.image ? 'input-error' : ''}`}
              />
              <label htmlFor="image" className="file-input-label">
                <svg className="upload-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span>Choose file or drag here</span>
                <span className="file-formats">JPG, JPEG, PNG, GIF</span>
              </label>
            </div>
            {errors.image && (
              <span className="error-text">
                <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.image}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="price" className="form-label">
              Price ($)
              <span className="required-indicator">*</span>
            </label>
            <div className="input-with-icon">
              <span className="input-icon">$</span>
              <input
                type="number"
                id="price"
                value={formData.price}
                onChange={handlePrice}
                min={0}
                step="0.01"
                required
                className={`form-input input-with-prefix ${errors.price ? 'input-error' : ''}`}
                placeholder="0.00"
              />
            </div>
            {errors.price && (
              <span className="error-text">
                <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.price}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="units" className="form-label">
              Units in Stock
              <span className="required-indicator">*</span>
            </label>
            <input
              type="number"
              id="units"
              value={formData.units}
              onChange={handleUnits}
              min={0}
              required
              className={`form-input ${errors.units ? 'input-error' : ''}`}
              placeholder="Enter quantity"
            />
            {errors.units && (
              <span className="error-text">
                <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.units}
              </span>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Product
          </button>
        </div>
      </form>
    </div>
  </div>
);

}