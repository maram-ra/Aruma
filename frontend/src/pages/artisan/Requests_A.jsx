import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Requests_A() {
  // === State variables ===
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [alertMessage, setAlertMessage] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showContract, setShowContract] = useState(false);
  const [formData, setFormData] = useState({
    price: "",
    timeframe: "",
  });

  const token = localStorage.getItem("token");
  const artisanId = localStorage.getItem("userId");

  // 🎯 Fetch requests from backend
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/v1/artisans/${artisanId}/requests`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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

  // 🎨 Status colors
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#d4a017";
      case "accepted":
        return "#3c7c59";
      case "progress":
        return "#29648a";
      case "completed":
        return "#6c757d";
      case "rejected":
        return "#a13a3a";
      default:
        return "#6c757d";
    }
  };

  // 🧩 Filter requests
  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((req) => req.status === filter);

  // 🔢 Count by status
  const getCount = (status) =>
    status === "all"
      ? requests.length
      : requests.filter((r) => r.status === status).length;

  // 🔄 Update request status
  const updateStatus = async (id, newStatus) => {
    try {
      let url = "";

      if (newStatus === "accepted") {
        url = `http://127.0.0.1:8000/api/v1/requests/${id}/accept`;
      } else if (newStatus === "rejected") {
        url = `http://127.0.0.1:8000/api/v1/requests/${id}/reject`;
      } else {
        console.error("Invalid status action");
        return;
      }

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body:
          newStatus === "accepted"
            ? JSON.stringify({
                cost: 0,
                timeframe: "TBD",
              })
            : null,
      });

      if (response.ok) {
        setRequests((prev) =>
          prev.map((req) =>
            req._id === id ? { ...req, status: newStatus } : req
          )
        );
        showAlert(`Request ${newStatus}!`);
      } else {
        const err = await response.text();
        console.error("Failed to update status:", err);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // 🕒 Temporary top alert
  const showAlert = (text) => {
    setAlertMessage(text);
    setTimeout(() => setAlertMessage(null), 2500);
  };

  // 📨 Send contract (accept request with terms)
  const handleContractSubmit = async (e) => {
  e.preventDefault();
  if (!selectedRequest) return;

  try {
    const response = await fetch("http://127.0.0.1:8000/api/v1/contracts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        requestId: selectedRequest._id,
        artisanId,
        clientId: selectedRequest.clientId,
        cost: parseFloat(formData.price),
        timeframe: formData.timeframe,
        status: "pending",
      }),
    });

    if (response.ok) {
      showAlert("Contract sent successfully!");
      setShowContract(false);
      setFormData({ price: "", timeframe: "" });
    } else {
      const err = await response.text();
      console.error("Failed to send contract:", err);
      alert("Failed to send contract");
    }
  } catch (error) {
    console.error("Error sending contract:", error);
  }
};


  return (
    <div className="requests-page" style={{ backgroundColor: "#f5f5ee" }}>
      {/* ===== Navbar ===== */}
      <Navbar />

      {/* ===== Alert ===== */}
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
              Welcome back
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
          {["all", "pending", "accepted", "in progress", "completed", "rejected"].map(
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

        {filteredRequests.length === 0 ? (
          <p className="text-muted mt-4">
            No requests yet. You’ll see new ones here once clients contact you.
          </p>
        ) : (
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
                      req.status === "progress"
                        ? "rgba(41,100,138,0.05)"
                        : "#f9f8f4",
                    borderColor: "#eee",
                    transition: "all 0.3s ease",
                  }}
                >
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
                      <small
                        className="text-muted"
                        style={{ fontSize: "0.9rem" }}
                      >
                        Client ID: {req.clientId}
                      </small>
                    </div>
                    <small className="text-muted" style={{ fontSize: "0.9rem" }}>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </small>
                  </div>

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

                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div className="d-flex gap-2 flex-wrap">
                      <span
                        className="px-3 py-1 border rounded-pill small fw-medium"
                        style={{
                          color: getStatusColor(req.status),
                          borderColor: getStatusColor(req.status),
                          backgroundColor: "rgba(0,0,0,0.03)",
                        }}
                      >
                        {req.status}
                      </span>
                    </div>

                    {/* Actions */}
                    {req.status === "pending" && (
                      <div className="d-flex gap-2">
                        <button
                          className="btn"
                          onClick={() => updateStatus(req._id, "accepted")}
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
                          onClick={() => updateStatus(req._id, "rejected")}
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
                        Send Contract
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

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
                  <label
                    className="form-label fw-semibold small"
                    style={{ color: "#3a0b0b" }}
                  >
                    Client ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedRequest?.clientId}
                    disabled
                    style={{ borderRadius: "8px", backgroundColor: "#eeeae3" }}
                  />
                </div>

                <div className="mb-3 text-start">
                  <label
                    className="form-label fw-semibold small"
                    style={{ color: "#3a0b0b" }}
                  >
                    Price (SAR)
                  </label>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    placeholder="Set your price"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    style={{ borderRadius: "8px", borderColor: "#cbbeb3" }}
                  />
                </div>

                <div className="mb-4 text-start">
                  <label
                    className="form-label fw-semibold small"
                    style={{ color: "#3a0b0b" }}
                  >
                    Timeframe
                  </label>
                  <input
                    type="text"
                    name="timeframe"
                    className="form-control"
                    placeholder="e.g. 3 days"
                    required
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
                    Send Contract
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
