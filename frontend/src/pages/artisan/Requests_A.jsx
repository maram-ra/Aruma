// src/pages/artisan/Requests_A.jsx
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  alertSuccess,
  alertError,
  alertInfo,
  alertConfirm,
} from "../../components/ArumaAlert";

// قاعدة عنوان الـ API
const API =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

export default function Requests_A() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const token = localStorage.getItem("token");
  const artisanId = localStorage.getItem("userId");
  const artisanName = localStorage.getItem("userName") || "";

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "accept" | "reject" | "complete"
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [formData, setFormData] = useState({
    budget: "",
    deadline: "",
    note: "",
  });

  // ===== Fetch Requests =====
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(`${API}/artisans/${artisanId}/requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch requests");
        const payload = await res.json();

        // ندعم الشكلين: مصفوفة مباشرة أو كائن فيه {requests: [...]}
        const raw = Array.isArray(payload) ? payload : payload.requests || [];

        // نطبّع الحقول عشان نتعامل مع تسميات قديمة/جديدة
        const list = raw.map((r) => ({
          id: r.id ?? r._id ?? r.requestId,
          type: r.type ?? r.requestType ?? r.request_type ?? "request",
          message: r.message ?? r.description ?? "",
          // الحرفي لازم يشوف حالة الحرفي
          status:
            r.status ??
            r.status_artisan ??
            r.statusArtisan ??
            r.status_client ??
            "new",
          budget: r.budget ?? r.offer_budget ?? r.offerBudget ?? null,
          deadline: r.deadline ?? r.offer_deadline ?? r.offerDeadline ?? null,
          clientName: r.clientName ?? r.client_name ?? r.client ?? "Unknown",
          createdAt: r.createdAt ?? r.created_at ?? r.date ?? "",
        }));

        setRequests(list);
      } catch (err) {
        console.error("Error fetching artisan requests:", err);
        await alertError("Failed to load requests. Please try again later.");
      }
    };

    if (artisanId && token) fetchRequests();
  }, [artisanId, token]);

  // ===== Submit actions =====
  const handleSubmit = async () => {
    if (!selectedRequestId) {
      await alertInfo("No request selected.");
      return;
    }

    let url = `${API}/requests/${selectedRequestId}`;
    let method = "PUT";
    let body = {};

    if (modalType === "accept") {
      if (!formData.budget || !formData.deadline) {
        await alertInfo("Please fill in both budget and deadline.");
        return;
      }
      // المسار الجديد لعرض الحرفي
      url += "/artisan/offer";
      body = {
        budget: Number(formData.budget),
        deadline: formData.deadline, // YYYY-MM-DD
      };
    } else if (modalType === "reject") {
      url += "/artisan/reject";
      body = { note: formData.note || "Unfortunately, I can’t take this one." };
    } else if (modalType === "complete") {
      url += "/artisan/complete";
      body = {};
    } else {
      await alertInfo("Unknown action type.");
      return;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text();
        await alertError(`Server error (${res.status}): ${txt || "Unknown error"}`);
        return;
      }

      const successMsg =
        modalType === "accept"
          ? "Offer sent successfully!"
          : modalType === "reject"
          ? "Request rejected successfully!"
          : "Request marked as completed!";
      await alertSuccess(successMsg);

      // تحدّيث محلي لحالة الطلب
      setRequests((prev) =>
        prev.map((r) =>
          r.id === selectedRequestId
            ? {
                ...r,
                status:
                  modalType === "accept"
                    ? "pending" // بانتظار تأكيد العميل
                    : modalType === "reject"
                    ? "rejected"
                    : "completed",
                budget:
                  modalType === "accept" ? Number(formData.budget) : r.budget,
                deadline:
                  modalType === "accept" ? formData.deadline : r.deadline,
              }
            : r
        )
      );
      setShowModal(false);
    } catch (err) {
      console.error(err);
      await alertError(`Unexpected error: ${err.message || "Unknown"}`);
    }
  };

  // ===== Colors =====
  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "new":
        return "#6c757d";
      case "pending":
        return "#d4a017";
      case "inprogress":
        return "#9370DB";
      case "completed":
        return "#3c7c59";
      case "rejected":
        return "#a13a3a";
      default:
        return "#6c757d";
    }
  };

  // ===== Filtered Requests =====
  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter(
          (r) => (r.status || "").toLowerCase() === filter.toLowerCase()
        );

  const getCount = (state) =>
    state === "all"
      ? requests.length
      : requests.filter(
          (r) => (r.status || "").toLowerCase() === state.toLowerCase()
        ).length;

  return (
    <div className="requests-page">
      <Navbar />

      {/* Header */}
      <section className="container py-5 mt-5">
        <h6
          className="fw-bold mb-2"
          style={{ color: "#3a0b0b", fontSize: "1.2rem" }}
        >
          Welcome back{artisanName ? `, ${artisanName}` : ""}!
        </h6>
        <p className="small" style={{ color: "#5c4b45", maxWidth: "480px" }}>
          Manage your incoming requests — send offers, reject requests, or mark
          them as completed.
        </p>
      </section>

      <div
        className="container"
        style={{
          borderBottom: "1px solid #cbbeb3",
          opacity: 0.5,
          marginBottom: "2rem",
        }}
      ></div>

      {/* Filters */}
      <section className="container text-center mb-4">
        <div className="d-flex flex-wrap justify-content-center gap-3">
          {["all", "new", "pending", "inprogress", "completed", "rejected"].map(
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
                  backgroundColor: filter === state ? "#3a0b0b" : "transparent",
                }}
              >
                {state.charAt(0).toUpperCase() + state.slice(1)}{" "}
                <span style={{ opacity: 0.7 }}>({getCount(state)})</span>
              </button>
            )
          )}
        </div>
      </section>

      {/* Requests List */}
      <section className="container py-5 text-center">
        <h5
          className="fw-bold mb-5"
          style={{ color: "#3a0b0b", fontSize: "1.25rem" }}
        >
          Incoming Requests
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
          <p className="text-muted">No requests found.</p>
        ) : (
          <div className="row justify-content-center">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="col-12 col-sm-10 col-md-8 mb-4 d-flex justify-content-center"
              >
                <div
                  className="border rounded-3 p-4 shadow-sm w-100"
                  style={{ backgroundColor: "#f1efe8" }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="text-start">
                      <h6 className="fw-semibold mb-1" style={{ color: "#3a0b0b" }}>
                        {req.type || "Request"}
                      </h6>
                      <small className="text-muted">
                        Client: {req.clientName || "Unknown"}
                      </small>
                    </div>
                    <small className="text-muted">{req.createdAt || "—"}</small>
                  </div>

                  <p
                    className="small text-start"
                    style={{ color: "#5c4b45", lineHeight: "1.6" }}
                  >
                    {req.message}
                  </p>

                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <span
                      className="px-3 py-1 border rounded-pill small fw-medium"
                      style={{
                        color: getStatusColor(req.status),
                        borderColor: getStatusColor(req.status),
                        backgroundColor: "rgba(0,0,0,0.03)",
                      }}
                    >
                      {(req.status || "").toUpperCase()}
                    </span>

                    {req.status === "new" && (
                      <div className="d-flex gap-2">
                        <button
                          className="btn"
                          onClick={() => {
                            setModalType("accept");
                            setSelectedRequestId(req.id);
                            setFormData({ budget: "", deadline: "", note: "" });
                            setShowModal(true);
                          }}
                          style={{
                            border: "1px solid #3c7c59",
                            color: "#3c7c59",
                            borderRadius: "20px",
                            padding: "4px 12px",
                            fontSize: "0.85rem",
                          }}
                        >
                          Send Offer
                        </button>
                        <button
                          className="btn"
                          onClick={() => {
                            setModalType("reject");
                            setSelectedRequestId(req.id);
                            setFormData({ budget: "", deadline: "", note: "" });
                            setShowModal(true);
                          }}
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

                    {req.status === "pending" && (
                      <span className="small text-muted">
                        Waiting for client confirmation…
                      </span>
                    )}

                    {req.status === "inprogress" && (
                      <button
                        className="btn"
                        onClick={() => {
                          setModalType("complete");
                          setSelectedRequestId(req.id);
                          setFormData({ budget: "", deadline: "", note: "" });
                          setShowModal(true);
                        }}
                        style={{
                          border: "1px solid #9370DB",
                          color: "#9370DB",
                          borderRadius: "20px",
                          padding: "4px 12px",
                          fontSize: "0.85rem",
                        }}
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
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
          onClick={(e) => {
            if (e.target.classList.contains("modal-overlay")) setShowModal(false);
          }}
        >
          <div
            className="modal-content p-4 rounded-3 shadow"
            style={{ backgroundColor: "#f9f7f2", width: "90%", maxWidth: "420px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="fw-bold mb-3 text-center" style={{ color: "#3a0b0b" }}>
              {modalType === "accept"
                ? "Send Offer"
                : modalType === "reject"
                ? "Reject Request"
                : "Mark as Completed"}
            </h5>

            {modalType === "accept" && (
              <>
                <div className="mb-3 text-start">
                  <label className="form-label fw-semibold" style={{ color: "#3a0b0b" }}>
                    Budget (SAR)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                    placeholder="Enter price in SAR"
                  />
                </div>

                <div className="mb-3 text-start">
                  <label className="form-label fw-semibold" style={{ color: "#3a0b0b" }}>
                    Deadline
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3 text-start">
                  <label className="form-label fw-semibold" style={{ color: "#3a0b0b" }}>
                    Note (optional)
                  </label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={formData.note}
                    onChange={(e) =>
                      setFormData({ ...formData, note: e.target.value })
                    }
                    placeholder="Add a note to the client (optional)"
                  />
                </div>
              </>
            )}

            {(modalType === "reject" || modalType === "complete") && (
              <div className="mb-3 text-start">
                <label className="form-label fw-semibold" style={{ color: "#3a0b0b" }}>
                  Note (optional)
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                  placeholder={
                    modalType === "reject"
                      ? "Add a short note to the client (optional)"
                      : "Add a thank-you note or any final details (optional)"
                  }
                />
              </div>
            )}

            <div className="d-flex justify-content-end gap-3 mt-4">
              <button
                className="btn btn-outline-secondary"
                onClick={async () => {
                  const ok = await alertConfirm("Cancel this action?", {
                    title: "Confirm",
                    confirmText: "Yes",
                    cancelText: "No",
                  });
                  if (ok) setShowModal(false);
                }}
                style={{ borderRadius: "20px", padding: "6px 16px" }}
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
                onClick={handleSubmit}
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
