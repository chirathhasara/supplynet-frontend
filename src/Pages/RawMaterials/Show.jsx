import axios from "axios";
import { useState, useEffect } from "react";
import "./Show.css";

export default function Show() {
    const [rawMaterials, setRawMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    async function getRawMaterials() {
        try {
            const res = await axios.get('/api/raw-materials');
            setRawMaterials(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching raw materials:", error);
            setLoading(false);
        }
    }

    useEffect(() => {
        getRawMaterials();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="raw-materials-container">
            <h1 className="page-title">Raw Materials</h1>
            <div className="materials-grid">
                {rawMaterials.map((raw) => (
                    <div key={raw.id} className="material-card">
                        <div className="card-header">
                            <h2 className="material-name">{raw.name}</h2>
                        </div>
                        <div className="card-body">
                            <div className="info-row">
                                <span className="label">Price:</span>
                                <span className="value price">Rs {raw.price}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Stock:</span>
                                <span className={`value stock ${raw.stock < 10 ? 'low-stock' : ''}`}>
                                    {raw.stock} units
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="label">Supplier:</span>
                                <span className="value supplier">
                                    {raw.supplier?.name || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}