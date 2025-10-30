import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Requests_C() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "";

  // ==== Modal States ====
  const [showModal, setShowModal] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState(null);

  // 🧩 جلب الطلبات من الباك إند
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/v1/requests/client/${clientId}/requests`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch requests");
        const data = await res.json();
        setRequests(data.requests || []);
      } catch (err) {
        console.error("Error fetching client requests:", err);
      }
    };

    if (clientId && token) fetchRequests();
  }, [clientId, token]);

  // 🪄 تأكيد العقد
  const handleConfirmContract = async (contractId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/v1/contracts/${contractId}/confirm`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to confirm contract");
      alert("Workshop confirmed successfully! 🌿");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error confirming contract");
    }
  };

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
        return "#a13a3a";
      default:
        return "#6c757d";
    }
  };

  // 🔍 الفلترة
  const filteredRequests =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  // 🔢 العدّاد
  const getCount = (state) =>
    state === "all"
      ? requests.length
      : requests.filter((r) => r.status === state).length;

  return (
    <div className="requests-page">
      <Navbar />

      {/* ===== Header ===== */}
      <section className="container py-5 mt-5">
        <h6
          className="fw-bold mb-2"
          style={{ color: "#3a0b0b", fontSize: "1.2rem" }}
        >
          Welcome back{userName ? `, ${userName}` : ""}!
        </h6>
        <p className="small" style={{ color: "#5c4b45", maxWidth: "480px" }}>
          Track your requests, follow artisan updates, and confirm your
          workshop details once approved.
        </p>
      </section>

      {/* Divider */}
      <div
        className="container"
        style={{
          borderBottom: "1px solid #cbbeb3",
          opacity: 0.5,
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
                onClick={() => setFilter(state)}
                className={`btn ${
                  filter === state ? "btn-dark" : "btn-outline-dark"
                }`}
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
          style={{ color: "#3a0b0b", fontSize: "1.25rem" }}
        >
          Your Requests
          <div
            style={{
              width: "50px",
              height: "2px",
              backgroundColor: "#cbbeb3",
              margin: "10px auto 0",
              opacity: 0.8,
            }}
          ></div>
        </h5>

        {filteredRequests.length === 0 ? (
          <p className="text-muted">
            No requests yet. Your submitted requests will appear here.
          </p>
        ) : (
          <div className="row justify-content-center">
            {filteredRequests.map((req) => (
              <div
                key={req._id}
                className="col-12 col-sm-10 col-md-8 mb-4 d-flex justify-content-center"
              >
                <div
                  className="border rounded-3 p-4 shadow-sm w-100"
                  style={{ backgroundColor: "#f1efe8" }}
                >
                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="text-start">
                      <h6
                        className="fw-semibold mb-1"
                        style={{ color: "#3a0b0b" }}
                      >
                        {req.requestType || "Request"}
                      </h6>
                      <small className="text-muted">
                        Artisan: {req.artisanName || "Unknown"}
                      </small>
                    </div>
                    <small className="text-muted">{req.date || "—"}</small>
                  </div>

                  {/* Message */}
                  <p
                    className="small text-start"
                    style={{ color: "#5c4b45", lineHeight: "1.6" }}
                  >
                    {req.message}
                  </p>
                  {req.contractCost && (
  <p className="small text-start text-muted mb-1">
    <strong>Price:</strong> {req.contractCost} SAR
  </p>
)}

{req.contractDate && (
  <p className="small text-start text-muted mb-3">
    <strong>Date:</strong> {req.contractDate}
  </p>
)}


                  {/* Status + Actions */}
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <span
                      className="px-3 py-1 border rounded-pill small fw-medium"
                      style={{
                        color: getStatusColor(req.status),
                        borderColor: getStatusColor(req.status),
                        backgroundColor: "rgba(0,0,0,0.03)",
                      }}
                    >
                      {req.status?.toUpperCase()}
                    </span>

                    {/* ✅ Confirm Contract */}
                    {req.status === "accepted" && req.contractId && (
                      <button
                        className="btn"
                        onClick={() => {
                          setSelectedContractId(req.contractId);
                          setShowModal(true);
                        }}
                        style={{
                          border: "1px solid #3a0b0b",
                          color: "#3a0b0b",
                          borderRadius: "20px",
                          padding: "4px 12px",
                          fontSize: "0.85rem",
                        }}
                      >
                        Confirm Details
                      </button>
                    )}

                    {/* ✅ WhatsApp Contact after confirmation */}
                    {req.status === "in progress" && req.artisanPhone && (
                      <a
                        href={`https://wa.me/${req.artisanPhone}?text=${encodeURIComponent(
                          `Hi ${req.artisanName}! I’m confirming our workshop from Aruma 🌿`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn"
                        style={{
                          border: "1px solid #25D366",
                          color: "#25D366",
                          borderRadius: "20px",
                          padding: "4px 12px",
                          fontSize: "0.85rem",
                        }}
                      >
                        Message on WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== Confirm Contract Modal ===== */}
      {showModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            className="modal-content p-4 rounded-3 shadow"
            style={{
              backgroundColor: "#f9f7f2",
              width: "90%",
              maxWidth: "420px",
            }}
          >
            <h5
              className="fw-bold mb-3"
              style={{ color: "#3a0b0b", textAlign: "center" }}
            >
              Confirm Workshop Details
            </h5>

            <p
              className="text-center small mb-4"
              style={{ color: "#5c4b45", lineHeight: "1.6" }}
            >
              By confirming, you agree to the workshop’s proposed date and cost
              shared by the artisan. You can then contact them directly on
              WhatsApp 🌿
            </p>

            <div className="d-flex justify-content-end gap-3">
              <button
                className="btn btn-outline-secondary"
                style={{
                  borderRadius: "20px",
                  padding: "6px 16px",
                }}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn"
                style={{
                  backgroundColor: "#3a0b0b",
                  color: "#fff",
                  borderRadius: "20px",
                  padding: "6px 16px",
                }}
                onClick={() => {
                  handleConfirmContract(selectedContractId);
                  setShowModal(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
