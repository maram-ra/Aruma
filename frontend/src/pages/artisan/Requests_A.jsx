import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Requests_A() {
  // === بيانات الطلبات ===
  const [requests, setRequests] = useState([
    {
      id: 1,
      client: "Reem.H",
      type: "Workshop Request",
      message:
        "I’d like to schedule a pottery class for 5 participants next month. Can we discuss materials and timing?",
      date: "Oct 10, 2025",
      status: "new",
    },
    {
      id: 2,
      client: "Laila.M",
      type: "Product Order",
      message:
        "Looking for a custom vase set in beige tones. Could you make 3 pieces with a matte finish?",
      date: "Oct 5, 2025",
      status: "accepted",
    },
    {
      id: 3,
      client: "Noor.S",
      type: "Live Show Invite",
      message:
        "We’d love to feature you in our craft show during Riyadh Art Week. Are you available on November 2nd?",
      date: "Sep 30, 2025",
      status: "in progress",
    },
    {
      id: 4,
      client: "Huda.A",
      type: "Product Collaboration",
      message:
        "Interested in collaborating on a limited ceramic collection. Let’s discuss design ideas.",
      date: "Sep 15, 2025",
      status: "completed",
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [alertMessage, setAlertMessage] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showContract, setShowContract] = useState(false);
  const [formData, setFormData] = useState({
    price: "",
    message: "",
    timeframe: "",
  });

  // 🎨 ألوان الحالات
  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "#d4a017";
      case "accepted":
        return "#3c7c59";
      case "in progress":
        return "#29648a";
      case "completed":
        return "#6c757d";
      case "rejected":
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

  // 🔄 تحديث حالة الطلب
  const updateStatus = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: newStatus } : req
      )
    );
  };

  // ⚙️ تحديث الحالة بعد إرسال العقد
  window.updateRequestStatus = (clientName, newStatus) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.client === clientName ? { ...req, status: newStatus } : req
      )
    );
  };

  // 🕒 إظهار تنبيه مؤقت بعد كل إجراء
  const showAlert = (text) => {
    setAlertMessage(text);
    setTimeout(() => setAlertMessage(null), 2500);
  };

  // 📨 إرسال العقد
  const handleContractSubmit = (e) => {
    e.preventDefault();
    showAlert(`Contract sent to ${selectedClient} successfully!`);
    setShowContract(false);
    window.updateRequestStatus(selectedClient, "in progress");
    setFormData({ price: "", message: "", timeframe: "" });
  };

  return (
    <div className="requests-page" style={{ backgroundColor: "#f5f5ee" }}>
      {/* ===== Navbar ===== */}
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
          {["all", "new", "accepted", "in progress", "completed", "rejected"].map(
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

        {/* حالة فارغة */}
        {filteredRequests.length === 0 && (
        <p className="text-muted mt-4">
        {filter === "all" && "No requests yet. You'll see new ones here once clients contact you."}
        {filter === "new" && "No new requests at the moment. New client inquiries will appear here."}
        {filter === "accepted" && "No accepted requests. Accept some new requests to see them here."}
        {filter === "in progress" && "No requests in progress. Send contracts to move accepted requests to this stage."}
        {filter === "completed" && "No completed requests yet. Finish your ongoing projects to see them here."}
        {filter === "rejected" && "No rejected requests. Requests you decline will appear here."}
        </p>
        )}

        <div className="row justify-content-center">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="col-12 col-sm-10 col-md-8 mb-4 d-flex justify-content-center"
            >
              {/* ===== Card ===== */}
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
                      {req.type}
                    </h6>
                    <small
                      className="text-muted"
                      style={{ fontSize: "0.9rem" }}
                    >
                      Client: {req.client}
                    </small>
                  </div>
                  <small className="text-muted" style={{ fontSize: "0.9rem" }}>
                    {req.date}
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
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  {/* Status badges */}
                  <div className="d-flex gap-2 flex-wrap">
                    {["new", "accepted", "in progress", "completed", "rejected"].map(
                      (status) => (
                        <span
                          key={status}
                          className="px-3 py-1 border rounded-pill small fw-medium"
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
                  {req.status === "new" && (
                    <div className="d-flex gap-2">
                      <button
                        className="btn"
                        onClick={() => updateStatus(req.id, "accepted")}
                        style={{
                          border: "1px solid #3a0b0b",
                          color: "#3a0b0b",
                          borderRadius: "20px",
                          padding: "4px 12px",
                          fontSize: "0.85rem",
                        }}
                      >
                        Accept
                      </button>
                      <button
                        className="btn"
                        onClick={() => updateStatus(req.id, "rejected")}
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
                  {req.status === "accepted" && (
                    <button
                      className="btn"
                      onClick={() => {
                        setSelectedClient(req.client);
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
                      Send Contract
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Footer ===== */}
      <Footer />

      {/* ===== Contract Modal ===== */}
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
                  onClick={() => setShowContract(false)}
                ></button>
              </div>

              <form onSubmit={handleContractSubmit}>
                <div className="mb-3 text-start">
                  <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                    Client
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClient}
                    disabled
                    style={{ borderRadius: "8px", backgroundColor: "#eeeae3" }}
                  />
                </div>

                <div className="mb-3 text-start">
                  <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                    Price
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
                    style={{ borderRadius: "8px", borderColor: "#cbbeb3" }}
                  />
                </div>

                <div className="mb-3 text-start">
                  <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                    Message
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
                    style={{ borderRadius: "8px", borderColor: "#cbbeb3" }}
                  ></textarea>
                </div>

                <div className="mb-4 text-start">
                  <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                    Timeframe
                  </label>
                  <input
                    type="text"
                    name="timeframe"
                    className="form-control"
                    placeholder="How long will it take?"
                    value={formData.timeframe}
                    onChange={(e) =>
                      setFormData({ ...formData, timeframe: e.target.value })
                    }
                    style={{ borderRadius: "8px", borderColor: "#cbbeb3" }}
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
                    }}
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
