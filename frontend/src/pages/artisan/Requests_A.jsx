import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Requests_A() {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");
  const artisanId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/v1/artisans/${artisanId}/requests`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!response.ok) throw new Error("Failed to load requests");
        const data = await response.json();
        setRequests(data.requests || []);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    if (artisanId && token) fetchRequests();
  }, [artisanId, token]);

  const [filter, setFilter] = useState("all");
  const [alertMessage, setAlertMessage] = useState(null);
  const [showContract, setShowContract] = useState(false);
  const [showViewContract, setShowViewContract] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [formData, setFormData] = useState({
    price: "",
    message: "",
    date: "",
  });

  // 🎨 ألوان الحالات
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#d4a017";
      case "accepted":
        return "#9370DB";
      case "in progress":
        return "#29648a";
      case "completed":
        return "#3c7c59";
      case "rejected":
      case "canceled":
        return "#a13a3a";
      default:
        return "#6c757d";
    }
  };

  // 🧩 فلترة الطلبات
  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((req) => req.status === filter);

  // 🔢 العدّاد
  const getCount = (status) =>
    status === "all"
      ? requests.length
      : requests.filter((r) => r.status === status).length;

  // 🕒 إظهار تنبيه مؤقت
  const showAlert = (text) => {
    setAlertMessage(text);
    setTimeout(() => setAlertMessage(null), 2500);
  };

  // 📨 إرسال العقد
  const handleContractSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/requests/${selectedRequest._id}/accept`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cost: parseFloat(formData.price),
            message: formData.message,
            date: formData.date,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRequests((prev) =>
          prev.map((r) =>
            r._id === selectedRequest._id
              ? { ...r, status: "accepted", ...data.request }
              : r
          )
        );
        showAlert("Contract sent successfully!");
        setShowContract(false);
        setFormData({ price: "", message: "", date: "" });
      } else {
        showAlert("Failed to send contract");
      }
    } catch (error) {
      console.error("Error sending contract:", error);
      showAlert("Network error");
    }
  };

  

  // ❌ رفض الطلب
  const rejectRequest = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/requests/${id}/reject`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        setRequests((prev) =>
          prev.map((r) =>
            r._id === id ? { ...r, status: "rejected" } : r
          )
        );
        showAlert("Request rejected successfully!");
      } else {
        showAlert("Failed to reject request");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      showAlert("Network error");
    }
  };

  // ✅ إنهاء الطلب
  const markAsCompleted = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/requests/${id}/complete`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        setRequests((prev) =>
          prev.map((r) =>
            r._id === id ? { ...r, status: "completed" } : r
          )
        );
        showAlert("Marked as completed!");
      } else {
        showAlert("Failed to mark as completed");
      }
    } catch (error) {
      console.error("Error marking as completed:", error);
      showAlert("Network error");
    }
  };

  // 👁️ عرض تفاصيل العقد
  const handleViewContract = (request) => {
    const contractData = {
      client: request.clientId || "Client",
      type: request.requestType,
      price: request.cost ? `${request.cost} SAR` : "N/A",
      message: request.message || "No message provided.",
      date: request.timeframe || "",
    };
    setSelectedContract(contractData);
    setShowViewContract(true);
  };

  return (
    <div className="requests-page" style={{ backgroundColor: "#f5f5ee" }}>
      <Navbar />

      {/* ===== تنبيه علوي ===== */}
      {alertMessage && (
        <div
          className="alert alert-success text-center small mb-0 rounded-0"
          role="alert"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 2000,
            backgroundColor: "#3c7c59",
            color: "#fff",
            letterSpacing: "0.3px",
            padding: "0.75rem 0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {alertMessage}
        </div>
      )}

      {/* ===== Header ===== */}
      <section className="container py-5 mt-5">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6
              className="fw-bold mb-2"
              style={{
                color: "#3a0b0b",
                fontSize: "1.2rem",
                letterSpacing: "0.3px",
              }}
            >
              Welcome back, Sara
            </h6>
            <p
              className="small mb-0"
              style={{
                color: "#5c4b45",
                lineHeight: "1.8",
                maxWidth: "480px",
                fontSize: "0.95rem",
              }}
            >
              Manage your client requests, send contracts, and follow up on your
              ongoing projects.
            </p>
          </div>
          <Link
            to="/artisan/Profile"
            className="btn btn-sm"
            style={{
              border: "1px solid #3a0b0b",
              color: "#3a0b0b",
              borderRadius: "20px",
              padding: "6px 14px",
              fontSize: "0.85rem",
            }}
          >
            ← Back to Profile
          </Link>
        </div>
      </section>

      {/* ===== Divider ===== */}
      <div
        className="container"
        style={{
          borderBottom: "1px solid #cbbeb3",
          opacity: "0.5",
          marginBottom: "2rem",
        }}
      ></div>

      {/* ===== Filters ===== */}
      <section className="container text-center mb-4">
        <div className="d-flex flex-wrap justify-content-center gap-3">
          {["all", "pending", "accepted", "in progress", "completed", "rejected", "canceled"].map(
            (state) => (
              <button
                key={state}
                className={`btn ${
                  filter === state ? "btn-dark" : "btn-outline-dark"
                }`}
                onClick={() => setFilter(state)}
                style={{
                  borderRadius: "20px",
                  padding: "6px 16px",
                  fontSize: "0.9rem",
                  borderColor: "#3a0b0b",
                  color: filter === state ? "#fff" : "#3a0b0b",
                  backgroundColor:
                    filter === state ? "#3a0b0b" : "transparent",
                }}
              >
                {state.charAt(0).toUpperCase() + state.slice(1)}{" "}
                <span style={{ opacity: 0.7 }}>({getCount(state)})</span>
              </button>
            )
          )}
        </div>
      </section>

      {/* ===== Requests List ===== */}
      <section className="container py-5 text-center">
        <h5
          className="fw-bold mb-5"
          style={{
            color: "#3a0b0b",
            fontSize: "1.25rem",
            letterSpacing: "0.5px",
          }}
        >
          Client Requests
          <div
            style={{
              width: "50px",
              height: "2px",
              backgroundColor: "#cbbeb3",
              margin: "10px auto 0",
              opacity: "0.8",
            }}
          ></div>
        </h5>

        {filteredRequests.length === 0 && (
  <p className="text-muted mt-4">
    {filter === "all" && "No requests yet. You'll see new ones here once clients contact you."}
    {filter === "pending" && "No pending requests. Accept & Send contracts to new requests to see them here."}
    {filter === "accepted" && "No accepted requests. Once you send contracts, they'll appear here."}
    {filter === "in progress" && "No requests in progress. Client-accepted contracts will appear here."}
    {filter === "completed" && "No completed requests yet. Finish your ongoing projects to see them here."}
    {filter === "rejected" && "No rejected requests. Requests you decline will appear here."}
    {filter === "canceled" && "No canceled orders. Client-canceled orders will appear here."}
  </p>
)}


        <div className="row justify-content-center">
          {filteredRequests.map((req) => (
            <div
              key={req._id}
              className="col-12 col-sm-10 col-md-8 mb-4 d-flex justify-content-center"
            >
              <div
                className="d-flex flex-column border rounded-3 p-4 bg-white shadow-sm w-100"
                style={{
                  backgroundColor:
                    req.status === "in progress"
                      ? "rgba(41,100,138,0.05)"
                      : "#f9f8f4",
                  borderColor: "#eee",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <h6
                      className="fw-semibold mb-1"
                      style={{
                        color: "#3a0b0b",
                        fontSize: "1rem",
                        letterSpacing: "0.3px",
                      }}
                    >
                      {req.requestType}
                    </h6>
                    <small className="text-muted" style={{ fontSize: "0.9rem" }}>
                      Client: {req.clientId}
                    </small>
                  </div>
                  <small className="text-muted" style={{ fontSize: "0.9rem" }}>
                    {req.date || ""}
                  </small>
                </div>

                {/* Message */}
                <p
                  className="small mb-3 text-start"
                  style={{
                    color: "#5c4b45",
                    lineHeight: "1.7",
                    fontSize: "0.95rem",
                  }}
                >
                  {req.message}
                </p>

                {/* Status + Actions */}
                <div className="d-flex flex-column gap-3 ">
                  {/* Status badges */}
                  <div className="d-flex gap-2  flex-wrap justify-content-start">
                    {["pending", "accepted", "in progress", "completed", "rejected", "canceled"].map(
                      (status) => (
                        <span
                          key={status}
                          className="px-3 py-1 border rounded-pill small fw-medium "
                          style={{
                            color:
                              req.status === status
                                ? getStatusColor(status)
                                : "#6c757d",
                            borderColor:
                              req.status === status
                                ? getStatusColor(status)
                                : "#dee2e6",
                            backgroundColor:
                              req.status === status
                                ? "rgba(0,0,0,0.03)"
                                : "transparent",
                          }}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      )
                    )}
                  </div>

                  {/* Actions */}
                  <div className="d-flex justify-content-end">
                    {/* === NEW REQUEST === */}
                    {req.status === "pending" && (
                      <div className="d-flex gap-2">
                        <button
                          className="btn"
                          onClick={() => {
                            setSelectedRequest(req);
                            setShowContract(true);
                          }}
                          style={{
                            border: "1px solid #3c7c59",
                            color: "#3c7c59",
                            borderRadius: "20px",
                            padding: "4px 12px",
                            fontSize: "0.85rem",
                          }}
                        >
                          Accept & Send Contract
                        </button>
                        <button
                          className="btn"
                          onClick={() => rejectRequest(req._id)}
                          style={{
                            border: "1px solid #a13a3a",
                            color: "#a13a3a",
                            borderRadius: "20px",
                            padding: "4px 12px",
                            fontSize: "0.85rem",
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {/* === ACCEPTED === */}
                    {req.status === "accepted" && (
                      <div className="d-flex gap-2">
                        <button
                          className="btn"
                          onClick={() => handleViewContract(req)}
                          style={{
                            border: "1px solid #3a0b0b",
                            color: "#3a0b0b",
                            borderRadius: "20px",
                            padding: "4px 12px",
                            fontSize: "0.85rem",
                          }}
                        >
                          View Contract
                        </button>
                        <button
                          className="btn"
                          onClick={() => markAsCompleted(req._id)}
                          style={{
                            border: "1px solid #3c7c59",
                            color: "#3c7c59",
                            borderRadius: "20px",
                            padding: "4px 12px",
                            fontSize: "0.85rem",
                          }}
                        >
                          Mark as Completed
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      {/* ===== Send Contract Modal ===== */}
{showContract && (
  <div
    className="modal show d-block"
    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
  >
    <div className="modal-dialog modal-dialog-centered">
      <div
        className="modal-content border-0 shadow"
        style={{
          backgroundColor: "#f5f5ee",
          borderRadius: "16px",
          padding: "2rem 1.5rem",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold m-0" style={{ color: "#3a0b0b" }}>
            Contract Details
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              setShowContract(false);
              setFormData({ price: "", message: "", date: "" });
            }}
          ></button>
        </div>

        <form onSubmit={handleContractSubmit}>
          {/* Client Field */}
          <div className="mb-4 text-start">
            <label
              className="form-label fw-semibold small"
              style={{ color: "#3a0b0b" }}
            >
              Client *
            </label>
            <input
              type="text"
              className="form-control"
              value={selectedRequest?.clientId || ""}
              disabled
              style={{
                borderRadius: "8px",
                backgroundColor: "#eeeae3",
                border: "1px solid #cbbeb3",
              }}
            />
          </div>

          {/* Price */}
          <div className="mb-4 text-start">
            <label
              className="form-label fw-semibold small"
              style={{ color: "#3a0b0b" }}
            >
              Price *
            </label>
            <input
              type="text"
              name="price"
              className="form-control"
              placeholder="Set your price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
              style={{
                borderRadius: "8px",
                border: "1px solid #cbbeb3",
                backgroundColor: formData.price ? "#ffffff" : "#f8f9fa",
              }}
            />
          </div>

          {/* Message */}
          <div className="mb-4 text-start">
            <label
              className="form-label fw-semibold small"
              style={{ color: "#3a0b0b" }}
            >
              Message *
            </label>
            <textarea
              name="message"
              className="form-control"
              placeholder="Write extra details for the client"
              rows="4"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
              style={{
                borderRadius: "8px",
                border: "1px solid #cbbeb3",
                backgroundColor: formData.message ? "#ffffff" : "#f8f9fa",
              }}
            ></textarea>
          </div>

          {/* Date */}
          <div className="mb-4 text-start">
            <label
              className="form-label fw-semibold small"
              style={{ color: "#3a0b0b" }}
            >
              Preferred Date *
            </label>
            <input
              type="date"
              name="date"
              className="form-control"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
              min={new Date().toISOString().split("T")[0]}
              style={{
                borderRadius: "8px",
                border: "1px solid #cbbeb3",
                backgroundColor: formData.date ? "#ffffff" : "#f8f9fa",
              }}
            />
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn fw-semibold px-4"
              style={{
                backgroundColor: "#3a0b0b",
                color: "#f5f5ee",
                borderRadius: "8px",
                padding: "8px 24px",
                fontSize: "0.9rem",
              }}
            >
              Send Contract
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

{/* ===== View Contract Modal ===== */}
{showViewContract && selectedContract && (
  <div
    className="modal show d-block"
    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
  >
    <div className="modal-dialog modal-dialog-centered">
      <div
        className="modal-content border-0 shadow"
        style={{
          backgroundColor: "#f5f5ee",
          borderRadius: "16px",
          padding: "2rem 1.5rem",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold m-0" style={{ color: "#3a0b0b" }}>
            Contract Details
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowViewContract(false)}
          ></button>
        </div>

        <div className="text-start small" style={{ color: "#3a0b0b" }}>
          <p>
            <strong>Client:</strong> {selectedContract.client}
          </p>
          <p>
            <strong>Service Type:</strong>{" "}
            {selectedContract.type.charAt(0).toUpperCase() +
              selectedContract.type.slice(1)}
          </p>
          <p>
            <strong>Price:</strong> {selectedContract.price}
          </p>
          <p>
            <strong>Date:</strong> {selectedContract.date || "Not specified"}
          </p>
          <p>
            <strong>Message:</strong>
            <br />
            <span style={{ color: "#5c4b45" }}>
              {selectedContract.message || "No message provided."}
            </span>
          </p>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button
            type="button"
            className="btn"
            onClick={() => setShowViewContract(false)}
            style={{
              backgroundColor: "#3a0b0b",
              color: "#f5f5ee",
              borderRadius: "8px",
              padding: "8px 24px",
              fontSize: "0.9rem",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
