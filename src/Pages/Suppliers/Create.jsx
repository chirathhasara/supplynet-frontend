import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../../Context/AppContext";
import './Create.css';

export default function Create() {
    const { token } = useContext(AppContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        mobile_number: ''
    });
    
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle form submission
    async function handleCreate(e) {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const res = await fetch("/api/suppliers", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            
            if (data.errors) {
                setErrors(data.errors);
            } else {
                // Reset form and navigate
                setFormData({
                    name: '',
                    location: '',
                    mobile_number: ''
                });
                navigate('/suppliers');
            }
        } catch (error) {
            console.error('Error creating supplier:', error);
            setErrors({ general: 'An error occurred while creating the supplier.' });
        } finally {
            setLoading(false);
        }
    }

    // Handle cancel/back button
    const handleCancel = () => {
        navigate('/suppliers');
    };

    return (
        <div className="create-container">
            <div className="create-card">
                <div className="card-header">
                    <h2>Create New Supplier</h2>
                    <p>Add a new supplier to your system</p>
                </div>

                <form onSubmit={handleCreate} className="create-form">
                    {/* General Error Message */}
                    {errors.general && (
                        <div className="error-message general-error">
                            {errors.general}
                        </div>
                    )}

                    {/* Name Field */}
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            Supplier Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`form-input ${errors.name ? 'error' : ''}`}
                            placeholder="Enter supplier name"
                            maxLength="255"
                        />
                        {errors.name && (
                            <div className="error-message">
                                {Array.isArray(errors.name) ? errors.name[0] : errors.name}
                            </div>
                        )}
                    </div>

                    {/* Location Field */}
                    <div className="form-group">
                        <label htmlFor="location" className="form-label">
                            Location <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className={`form-input ${errors.location ? 'error' : ''}`}
                            placeholder="Enter supplier location"
                            maxLength="255"
                        />
                        {errors.location && (
                            <div className="error-message">
                                {Array.isArray(errors.location) ? errors.location[0] : errors.location}
                            </div>
                        )}
                    </div>

                    {/* Mobile Number Field */}
                    <div className="form-group">
                        <label htmlFor="mobile_number" className="form-label">
                            Mobile Number <span className="required">*</span>
                        </label>
                        <input
                            type="tel"
                            id="mobile_number"
                            name="mobile_number"
                            value={formData.mobile_number}
                            onChange={handleInputChange}
                            className={`form-input ${errors.mobile_number ? 'error' : ''}`}
                            placeholder="Enter mobile number (7-15 digits)"
                            pattern="[0-9]{7,15}"
                        />
                        {errors.mobile_number && (
                            <div className="error-message">
                                {Array.isArray(errors.mobile_number) ? errors.mobile_number[0] : errors.mobile_number}
                            </div>
                        )}
                        <small className="form-hint">
                            Please enter 7-15 digits only
                        </small>
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="btn btn-secondary"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Supplier'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}