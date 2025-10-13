import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Show.css';

export default function Show() {
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(null);

    // Fetch suppliers data
    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/suppliers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                // Handle different API response formats
                const suppliersArray = Array.isArray(data) ? data : 
                                     data.data ? data.data : 
                                     data.suppliers ? data.suppliers : [];
                setSuppliers(suppliersArray);
                setError('');
            } else {
                setError('Failed to fetch suppliers');
            }
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            setError('An error occurred while fetching suppliers');
        } finally {
            setLoading(false);
        }
    };

    console.log(suppliers);

    // Handle delete supplier
    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                setDeleteLoading(id);
                const response = await fetch(`/api/suppliers/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    // Remove supplier from state
                    setSuppliers(suppliers.filter(supplier => supplier.id !== id));
                } else {
                    setError('Failed to delete supplier');
                }
            } catch (error) {
                console.error('Error deleting supplier:', error);
                setError('An error occurred while deleting supplier');
            } finally {
                setDeleteLoading(null);
            }
        }
    };

    // Handle navigation to create page
    const handleCreate = () => {
        navigate('/create');
    };

    // Handle navigation to update page
    const handleUpdate = (id) => {
        navigate(`/update/${id}`);
    };

    // Handle refresh
    const handleRefresh = () => {
        fetchSuppliers();
    };

    if (loading) {
        return (
            <div className="suppliers-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading suppliers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="suppliers-container">
            <div className="suppliers-card">
                {/* Header */}
                <div className="card-header">
                    <div className="header-content">
                        <h1>Suppliers Management</h1>
                        <p>Manage your suppliers efficiently</p>
                    </div>
                    <div className="header-actions">
                        <button 
                            onClick={handleRefresh}
                            className="btn btn-refresh"
                            title="Refresh Data"
                        >
                            <span className="btn-icon">↻</span>
                            Refresh
                        </button>
                        <button 
                            onClick={handleCreate}
                            className="btn btn-create"
                        >
                            <span className="btn-icon">+</span>
                            Add Supplier
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="error-banner">
                        <span className="error-icon">⚠</span>
                        {error}
                        <button 
                            onClick={() => setError('')}
                            className="error-close"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Suppliers Count */}
                <div className="suppliers-stats">
                    <div className="stat-item">
                        <span className="stat-number">{suppliers.length}</span>
                        <span className="stat-label">Total Suppliers</span>
                    </div>
                </div>

                {/* Suppliers List */}
                <div className="suppliers-content">
                    {suppliers.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📦</div>
                            <h3>No Suppliers Found</h3>
                            <p>Start by adding your first supplier to the system</p>
                            <button 
                                onClick={handleCreate}
                                className="btn btn-create"
                            >
                                <span className="btn-icon">+</span>
                                Add First Supplier
                            </button>
                        </div>
                    ) : (
                        <div className="suppliers-grid">
                            {suppliers.map((supplier) => (
                                <div key={supplier.id} className="supplier-card">
                                    <div className="supplier-header">
                                        <h3 className="supplier-name">{supplier.name}</h3>
                                        <span className="supplier-id">ID: {supplier.id}</span>
                                    </div>
                                    
                                    <div className="supplier-details">
                                        <div className="detail-item">
                                            <span className="detail-icon">📍</span>
                                            <div className="detail-content">
                                                <span className="detail-label">Location</span>
                                                <span className="detail-value">{supplier.location}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="detail-item">
                                            <span className="detail-icon">📱</span>
                                            <div className="detail-content">
                                                <span className="detail-label">Mobile</span>
                                                <span className="detail-value">{supplier.mobile_number}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="supplier-actions">
                                        <button
                                            onClick={() => handleUpdate(supplier.id)}
                                            className="btn btn-update"
                                            title="Update Supplier"
                                        >
                                            <span className="btn-icon">✏</span>
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(supplier.id, supplier.name)}
                                            className="btn btn-delete"
                                            disabled={deleteLoading === supplier.id}
                                            title="Delete Supplier"
                                        >
                                            {deleteLoading === supplier.id ? (
                                                <>
                                                    <span className="btn-spinner"></span>
                                                    Deleting...
                                                </>
                                            ) : (
                                                <>
                                                    <span className="btn-icon">🗑</span>
                                                    Delete
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}