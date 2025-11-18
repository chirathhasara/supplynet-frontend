import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AcceptOrder.css";

export default function AcceptOrder() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.delivery ?? null;

  // Normalize products (order.products might be an array or a JSON string)
  const productsArray = (() => {
    try {
      if (!order) return [];
      if (Array.isArray(order.products)) return order.products;
      return JSON.parse(order.products || "[]");
    } catch {
      return [];
    }
  })();

  // Map of accepted units keyed by product_id (initialize to received units)
  const initialAccepted = {};
  productsArray.forEach((p) => {
    initialAccepted[p.product_id] = Number(p.units ?? 0);
  });

  const [acceptedUnits, setAcceptedUnits] = useState(initialAccepted);

  // formData holds the JSON-strings required by backend
  const [formData, setFormData] = useState({
    shop_id: order?.shop_id ?? "",
    delivery_id: order?.id ?? "",
    received_products: JSON.stringify(productsArray),
    accepted_products: JSON.stringify([]),
    rejected_products: JSON.stringify([]),
    note: "",
  });

  // Recompute accepted_products and rejected_products (as JSON strings)
  useEffect(() => {
    const acceptedArr = [];
    const rejectedArr = [];

    productsArray.forEach((p) => {
      const pid = p.product_id;
      const received = Number(p.units ?? 0);
      // sanitize accepted input: fallback to 0, max = received, min = 0
      const rawAccept = acceptedUnits[pid];
      const accept = Number.isFinite(Number(rawAccept))
        ? Math.max(0, Math.min(received, Number(rawAccept)))
        : 0;
      const reject = Math.max(0, received - accept);

      // Only push objects with integer units (or zeros) — backend expects product_id + units
      acceptedArr.push({ product_id: pid, units: accept });
      if (reject > 0) {
        rejectedArr.push({ product_id: pid, units: reject });
      } else {
        // If zero rejected, ensure backend sees it as 0 if you prefer:
        // rejectedArr.push({ product_id: pid, units: 0 });
      }
    });

    setFormData((prev) => ({
      ...prev,
      received_products: JSON.stringify(productsArray),
      accepted_products: JSON.stringify(acceptedArr),
      rejected_products: JSON.stringify(rejectedArr),
    }));
  }, [acceptedUnits, /* productsArray stable if order doesn't change */]);

  // Handle change in accepted units input
  function handleAcceptChange(productId, value) {
    // allow empty (treat as 0) or numeric
    const numeric = value === "" ? "" : Math.floor(Number(value) || 0);
    setAcceptedUnits((prev) => ({ ...prev, [productId]: numeric }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      shop_id: formData.shop_id,
      delivery_id: formData.delivery_id,
      received_products: formData.received_products, // JSON string
      accepted_products: formData.accepted_products, // JSON string
      rejected_products: formData.rejected_products, // JSON string
      note: formData.note,
    };

    try {
      const res = await axios.post("/api/accept-products", payload);
      // handle success (adjust as you want)
      alert("Submitted successfully");
      navigate("/delivery/received"); // or wherever
    } catch (err) {
      console.error("submit error:", err);
      alert("Failed to submit. Check console for details.");
    }
  }

  if (!order) {
    return <div className="ao-no-order">No order found.</div>;
  }

  return (
    <div className="ao-container">
      <h1 className="ao-title">Accept Delivery</h1>

      <div className="ao-order-meta">
        <div><strong>Shop ID:</strong> {order.shop_id}</div>
        <div><strong>Delivery ID:</strong> {order.id}</div>
      </div>

      <form className="ao-form" onSubmit={handleSubmit}>
        <div className="ao-table-header">
          <div className="ao-col ao-col-product">Product ID</div>
          <div className="ao-col ao-col-received">Received</div>
          <div className="ao-col ao-col-accepted">Accepted (units)</div>
          <div className="ao-col ao-col-rejected">Rejected (auto)</div>
        </div>

        <div className="ao-rows">
          {productsArray.map((p) => {
            const pid = p.product_id;
            const received = Number(p.units ?? 0);
            const acceptedRaw = acceptedUnits[pid];
            const accepted = acceptedRaw === "" ? 0 : Number(acceptedRaw || 0);
            const acceptedSanitized = Math.max(0, Math.min(received, Math.floor(accepted)));
            const rejected = Math.max(0, received - acceptedSanitized);

            return (
              <div className="ao-row" key={pid}>
                <div className="ao-col ao-col-product">{pid}</div>
                <div className="ao-col ao-col-received">{received}</div>

                <div className="ao-col ao-col-accepted">
                  <input
                    className="ao-input-accepted"
                    type="number"
                    min="0"
                    max={received}
                    value={acceptedUnits[pid] === "" ? "" : acceptedUnits[pid]}
                    onChange={(e) => handleAcceptChange(pid, e.target.value)}
                    onBlur={(e) => {
                      // sanitize: empty => 0, clamp to [0, received]
                      const v = e.target.value === "" ? 0 : Math.floor(Number(e.target.value) || 0);
                      handleAcceptChange(pid, Math.max(0, Math.min(received, v)));
                    }}
                  />
                </div>

                <div className="ao-col ao-col-rejected">{rejected}</div>
              </div>
            );
          })}
        </div>

        <textarea
          className="ao-note"
          placeholder="Note (optional)"
          value={formData.note}
          required
          onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
        />

        <div className="ao-submit-row">
          <button type="submit" className="ao-submit-btn">Submit</button>
        </div>
      </form>
    </div>
  );
}
