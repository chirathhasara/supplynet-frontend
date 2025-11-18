import axios from "axios";
import { useState , useContext, useEffect } from "react";
import { AppContext } from "../../Context/AppContext";
import styles from "./Create.module.css";

export default function Create(){

    const { user, token } = useContext(AppContext);
    const [suppliers, setSuppliers] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        stock: "",
        supplier_id: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    async function getSuppliers(){
        try{
            const res = await axios.get('/api/suppliers', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSuppliers(res.data.data || []);
        }catch(error){
            console.log(`this error occur while fetching the data: ${error}`);
        }
    }

    useEffect(()=>{
        getSuppliers();
        // run once on mount
    }, []);

    function handleChange(e){
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: undefined }));
        setSuccessMessage("");
    }

    async function handleSubmit(e){
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccessMessage("");

        try{
            const res = await axios.post('/api/raw-materials', {
                name: formData.name,
                price: formData.price,
                stock: formData.stock,
                supplier_id: formData.supplier_id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            setSuccessMessage("Raw material created successfully.");
            setFormData({ name: "", price: "", stock: "", supplier_id: "" });
        }catch(error){
            if (error.response && error.response.status === 422) {
                // Laravel validation errors
                setErrors(error.response.data.errors || {});
            } else {
                console.error("Submit error:", error);
            }
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className={styles.crm_container}>
            <form className={styles.crm_form} onSubmit={handleSubmit} noValidate>
                <h2 className={styles.crm_title}>Create Raw Material</h2>

                {successMessage && <div className={styles.crm_success}>{successMessage}</div>}

                <div className={styles.crm_field}>
                    <label className={styles.crm_label} htmlFor="supplier_id">Supplier</label>
                    <select
                        id="supplier_id"
                        name="supplier_id"
                        value={formData.supplier_id}
                        onChange={handleChange}
                        className={styles.crm_select}
                        required
                    >
                        <option value="">Select supplier</option>
                        {suppliers.map((sup) => (
                            <option key={sup.id} value={sup.id}>{sup.name}</option>
                        ))}
                    </select>
                    {errors.supplier_id && <p className={styles.crm_error}>{errors.supplier_id[0]}</p>}
                </div>

                <div className={styles.crm_field}>
                    <label className={styles.crm_label} htmlFor="name">Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className={styles.crm_input}
                        maxLength={255}
                        required
                    />
                    {errors.name && <p className={styles.crm_error}>{errors.name[0]}</p>}
                </div>

                <div className={styles.crm_row}>
                    <div className={styles.crm_field_half}>
                        <label className={styles.crm_label} htmlFor="price">Price</label>
                        <input
                            id="price"
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            className={styles.crm_input}
                            required
                        />
                        {errors.price && <p className={styles.crm_error}>{errors.price[0]}</p>}
                    </div>

                    <div className={styles.crm_field_half}>
                        <label className={styles.crm_label} htmlFor="stock">Stock</label>
                        <input
                            id="stock"
                            name="stock"
                            type="number"
                            min="0"
                            step="1"
                            value={formData.stock}
                            onChange={handleChange}
                            className={styles.crm_input}
                            required
                        />
                        {errors.stock && <p className={styles.crm_error}>{errors.stock[0]}</p>}
                    </div>
                </div>

                <div className={styles.crm_actions}>
                    <button type="submit" className={styles.crm_button} disabled={loading}>
                        {loading ? "Saving..." : "Create"}
                    </button>
                </div>
            </form>
        </div>
    )

}