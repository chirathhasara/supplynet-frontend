import { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import './ReceivedPurchaseOrder.css';
import { AppContext } from '../../Context/AppContext';

export default function ReceivedPurchaseOrder() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [receivedOrders, setReceivedOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    purchase_order_id: '',
    raw_material_id: '',
    requested_units: '',
    received_units: '',
    due_date: '',
    received_date: '',
    quality_status: 'good',
    batch_no: '',
    expiry_date: '',
    attachment: '',
    note: '',
    difference_reason: '',
    status: 'received'
  });

  const {token} = useContext(AppContext);

  // Calculated fields display
  const [calculatedFields, setCalculatedFields] = useState({
    unit_shortage: 0,
    no_of_late_days: 0,
    loss_amount: 0
  });

  useEffect(() => {
    getPurchaseOrders();
    getReceivedOrders();
  }, []);

  async function getPurchaseOrders() {
    try {
      const res = await axios.get('/api/purchase-orders');
      setPurchaseOrders(res.data.data);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
    }
  }

  async function getReceivedOrders() {
    try {
      const res = await axios.get('/api/accept-pruchase-orders');
      setReceivedOrders(res.data.data);
    } catch (error) {
      console.error('Error fetching received orders:', error);
    }
  }

  // Filter out already received purchase orders
  const availablePurchaseOrders = purchaseOrders.filter(po => {
    return !receivedOrders.some(received => received.purchase_order_id === po.id);
  });

  // Auto-fill fields when purchase order is selected
  function handlePurchaseOrderChange(e) {
    const selectedId = e.target.value;
    const selectedPO = purchaseOrders.find(po => po.id === parseInt(selectedId));

    if (selectedPO) {
      setFormData(prev => ({
        ...prev,
        purchase_order_id: selectedId,
        raw_material_id: selectedPO.raw_material_id,
        requested_units: selectedPO.quantity,
        due_date: selectedPO.due_date
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        purchase_order_id: '',
        raw_material_id: '',
        requested_units: '',
        due_date: ''
      }));
    }
  }

  // Calculate fields when relevant data changes
  const calculateFields = useCallback(() => {
    const requested = parseFloat(formData.requested_units) || 0;
    const received = parseFloat(formData.received_units) || 0;
    const unitShortage = Math.max(0, requested - received);

    // Calculate late days
    let lateDays = 0;
    if (formData.due_date && formData.received_date) {
      const dueDate = new Date(formData.due_date);
      const receivedDate = new Date(formData.received_date);
      const diffTime = receivedDate - dueDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      lateDays = Math.max(0, diffDays);
    }

    // Calculate loss amount
    const selectedPO = purchaseOrders.find(po => po.id === parseInt(formData.purchase_order_id));
    const unitPrice = selectedPO?.unit_price || 0;
    const lossAmount = unitShortage * unitPrice;

    setCalculatedFields({
      unit_shortage: unitShortage,
      no_of_late_days: lateDays,
      loss_amount: lossAmount.toFixed(2)
    });
  }, [formData.requested_units, formData.received_units, formData.due_date, formData.received_date, formData.purchase_order_id, purchaseOrders]);

  useEffect(() => {
    calculateFields();
  }, [calculateFields]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        unit_shortage: calculatedFields.unit_shortage,
        no_of_late_days: calculatedFields.no_of_late_days,
        loss_amount: parseFloat(calculatedFields.loss_amount)
      };

      const res = await axios.post('/api/accept-pruchase-orders', submitData,
        {
            headers:{
                    Authorization:`Bearer ${token}`
                }
        }
      );
      alert('Received Purchase Order created successfully!');
      
      // Reset form
      setFormData({
        purchase_order_id: '',
        raw_material_id: '',
        requested_units: '',
        received_units: '',
        due_date: '',
        received_date: '',
        quality_status: 'good',
        batch_no: '',
        expiry_date: '',
        attachment: '',
        note: '',
        difference_reason: '',
        status: 'received'
      });

      // Reset calculated fields
      setCalculatedFields({
        unit_shortage: 0,
        no_of_late_days: 0,
        loss_amount: 0
      });
      
      // Refresh both lists
      await getReceivedOrders();
      await getPurchaseOrders();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error creating received purchase order: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rpo-container">
      <div className="rpo-header">
        <h1 className="rpo-title">Received Purchase Orders</h1>
        <p className="rpo-subtitle">Record and track received purchase orders</p>
      </div>

      <div className="rpo-content">
        {/* Form Section */}
        <div className="rpo-form-card">
          <h2 className="rpo-form-title">New Received Order</h2>
          
          <form className="rpo-form" onSubmit={handleSubmit}>
            {/* Purchase Order Selection */}
            <div className="rpo-form-group">
              <label className="rpo-label">Purchase Order *</label>
              <select
                name="purchase_order_id"
                value={formData.purchase_order_id}
                onChange={handlePurchaseOrderChange}
                required
                className="rpo-select"
              >
                <option value="">Select Purchase Order</option>
                {availablePurchaseOrders.map(po => (
                  <option key={po.id} value={po.id}>
                    PO #{po.id} - {po.raw_material?.name} (Qty: {po.quantity})
                  </option>
                ))}
              </select>
            </div>

            {/* Auto-filled fields */}
            <div className="rpo-form-row">
              <div className="rpo-form-group">
                <label className="rpo-label">Raw Material ID</label>
                <input
                  type="text"
                  value={formData.raw_material_id}
                  disabled
                  className="rpo-input rpo-input-disabled"
                />
              </div>

              <div className="rpo-form-group">
                <label className="rpo-label">Requested Units</label>
                <input
                  type="number"
                  value={formData.requested_units}
                  disabled
                  className="rpo-input rpo-input-disabled"
                />
              </div>
            </div>

            <div className="rpo-form-row">
              <div className="rpo-form-group">
                <label className="rpo-label">Due Date</label>
                <input
                  type="date"
                  value={formData.due_date}
                  disabled
                  className="rpo-input rpo-input-disabled"
                />
              </div>

              <div className="rpo-form-group">
                <label className="rpo-label">Received Date *</label>
                <input
                  type="date"
                  name="received_date"
                  value={formData.received_date}
                  onChange={handleInputChange}
                  required
                  className="rpo-input"
                />
              </div>
            </div>

            {/* Manual input fields */}
            <div className="rpo-form-row">
              <div className="rpo-form-group">
                <label className="rpo-label">Received Units *</label>
                <input
                  type="number"
                  name="received_units"
                  value={formData.received_units}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="rpo-input"
                  placeholder="Enter received units"
                />
              </div>

              <div className="rpo-form-group">
                <label className="rpo-label">Quality Status</label>
                <select
                  name="quality_status"
                  value={formData.quality_status}
                  onChange={handleInputChange}
                  className="rpo-select"
                >
                  <option value="good">Good</option>
                  <option value="damaged">Damaged</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>

            <div className="rpo-form-row">
              <div className="rpo-form-group">
                <label className="rpo-label">Batch Number</label>
                <input
                  type="text"
                  name="batch_no"
                  value={formData.batch_no}
                  onChange={handleInputChange}
                  className="rpo-input"
                  placeholder="Enter batch number"
                />
              </div>

              <div className="rpo-form-group">
                <label className="rpo-label">Expiry Date</label>
                <input
                  type="date"
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleInputChange}
                  className="rpo-input"
                />
              </div>
            </div>

            <div className="rpo-form-row">
              <div className="rpo-form-group">
                <label className="rpo-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="rpo-select"
                >
                  <option value="received">Received</option>
                  <option value="partially_received">Partially Received</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="rpo-form-group">
                <label className="rpo-label">Attachment URL</label>
                <input
                  type="text"
                  name="attachment"
                  value={formData.attachment}
                  onChange={handleInputChange}
                  className="rpo-input"
                  placeholder="Enter attachment URL"
                />
              </div>
            </div>

            <div className="rpo-form-group">
              <label className="rpo-label">Difference Reason</label>
              <textarea
                name="difference_reason"
                value={formData.difference_reason}
                onChange={handleInputChange}
                className="rpo-textarea"
                rows="2"
                placeholder="Explain any differences..."
              />
            </div>

            <div className="rpo-form-group">
              <label className="rpo-label">Notes</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                className="rpo-textarea"
                rows="3"
                placeholder="Additional notes..."
              />
            </div>

            {/* Calculated fields display */}
            <div className="rpo-calculated-section">
              <h3 className="rpo-calculated-title">Calculated Fields</h3>
              <div className="rpo-calculated-grid">
                <div className="rpo-calculated-item">
                  <span className="rpo-calculated-label">Unit Shortage:</span>
                  <span className="rpo-calculated-value">{calculatedFields.unit_shortage}</span>
                </div>
                <div className="rpo-calculated-item">
                  <span className="rpo-calculated-label">Late Days:</span>
                  <span className="rpo-calculated-value">{calculatedFields.no_of_late_days}</span>
                </div>
                <div className="rpo-calculated-item">
                  <span className="rpo-calculated-label">Loss Amount:</span>
                  <span className="rpo-calculated-value">${calculatedFields.loss_amount}</span>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="rpo-submit-btn"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Received Order'}
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="rpo-list-card">
          <h2 className="rpo-list-title">Recent Received Orders</h2>
          
          <div className="rpo-list">
            {receivedOrders.length === 0 ? (
              <p className="rpo-empty">No received orders yet</p>
            ) : (
              receivedOrders.map(order => (
                <div key={order.id} className="rpo-list-item">
                  <div className="rpo-item-header">
                    <span className="rpo-item-id">Order #{order.id}</span>
                    <span className={`rpo-status-badge rpo-status-${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="rpo-item-details">
                    <p><strong>PO:</strong> #{order.purchase_order_id}</p>
                    <p><strong>Received:</strong> {order.received_units} / {order.requested_units} units</p>
                    <p><strong>Date:</strong> {order.received_date}</p>
                    <p><strong>Quality:</strong> {order.quality_status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}