// src/pages/client/Requests_C.jsx
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

// قاعدة عنوان الـ API (بدون لمس التصميم)
const API =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

// دالة لتنسيق التاريخ والوقت
function formatDateTime(input) {
  if (!input) return "—";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export default function Requests_C() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");

  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "";

  // ===== Fetch Requests =====
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(`${API}/clients/${clientId}/requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch requests");
        const data = await res.json();

        const raw = Array.isArray(data) ? data : data.requests || [];

        // ✅ استخراج الرسالة من جميع الأسماء المحتملة
        const list = raw.map((r) => ({
          id: r._id ?? r.id ?? r.requestId,
          requestType: r.requestType ?? r.type ?? r.request_type ?? "request",
          message:
            r.message ??
            r.description ??
            r.request_desc ??
            r.req_message ??
            r.note ??
            "",
          status:
            r.status ??
            r.status_client ??
            r.statusClient ??
            r.status_artisan ??
            "pending",
          artisanName: r.artisanName ?? r.artisan_name ?? r.artisan ?? "Unknown",
          createdAt: r.createdAt ?? r.created_at ?? r.date ?? "",
          offerBudget: r.offerBudget ?? r.offer_budget ?? null,
          offerDeadline: r.offerDeadline ?? r.offer_deadline ?? null,
          contractId: r.contractId ?? r.contract_id ?? null,
          contractCost: r.contractCost ?? r.contract_cost ?? null,
          contractDate: r.contractDate ?? r.contract_date ?? null,
        }));

        setRequests(list);
      } catch (err) {
        console.error("Error fetching client requests:", err);
        await alertError("Failed to load requests.\nPlease try again later.");
      }
    };

    if (clientId && token) fetchRequests();
  }, [clientId, token]);

  // ===== Confirm offer (creates contract + set inprogress) =====
  const handleConfirmOffer = async (requestId) => {
    const ok = await alertConfirm("Confirm the artisan's offer?", {
      title: "Confirm",
      confirmText: "Confirm",
      cancelText: "Cancel",
    });
    if (!ok) return;

    try {
      const res = await fetch(`${API}/requests/${requestId}/client/accept`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note: "" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Failed to confirm offer");

      await alertSuccess("Offer confirmed! Contract created.");

      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? {
                ...r,
                status: "inprogress",
                contractId: data?.contract?.id ?? r.contractId,
                contractCost:
                  data?.contract?.cost ?? r.contractCost ?? r.offerBudget,
                contractDate:
                  data?.contract?.date ?? r.contractDate ?? r.offerDeadline,
              }
            : r
        )
      );
    } catch (e) {
      await alertError(e.message || "Network error");
    }
  };

  // ===== Reject offer (both sides -> rejected) =====
  const handleRejectOffer = async (requestId) => {
    const ok = await alertConfirm("Are you sure you want to reject this offer?", {
      title: "Reject Offer",
      confirmText: "Reject",
      cancelText: "Cancel",
    });
    if (!ok) return;

    try {
      const res = await fetch(`${API}/requests/${requestId}/client/reject`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note: "" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Failed to reject offer");

      await alertSuccess("Offer rejected.");

      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: "rejected" } : r))
      );
    } catch (e) {
      await alertError(e.message || "Network error");
    }
  };

  // ===== Helpers =====
  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return "#d4a017";
      case "accepted":
        return "#9370DB";
      case "inprogress":
        return "#008080";
      case "completed":
        return "#3c7c59";
      case "rejected":
        return "#a13a3a";
      default:
        return "#6c757d";
    }
  };

  const tabs = ["all", "pending", "accepted", "inprogress", "completed", "rejected"];

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter(
          (r) => (r.status || "").toLowerCase() === filter
        );

  const getCount = (state) =>
    state === "all"
      ? requests.length
      : requests.filter(
          (r) => (r.status || "").toLowerCase() === state
        ).length;

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
        <p className="small" style={{ color: "#5c4b45", maxWidth: "520px" }}>
          Track your requests, confirm offers, and follow up with your artisan.
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

      {/* ===== Filters ===== */}
      <section className="container text-center mb-4">
        <div className="d-flex flex-wrap justify-content-center gap-3">
          {tabs.map((state) => (
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
          ))}
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
            {filteredRequests.map((req) => {
              const price = req.contractCost ?? req.offerBudget;
              const date = req.contractDate ?? req.offerDeadline;

              return (
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
                      <small className="text-muted">
                        {formatDateTime(req.createdAt)}
                      </small>
                    </div>

                    <p
                      className="small text-start"
                      style={{ color: "#5c4b45", lineHeight: "1.6" }}
                    >
                      {req.message?.trim()
                        ? req.message
                        : <em className="text-muted">No message provided.</em>}
                    </p>

                    {price != null && (
                      <p className="small text-start text-muted mb-1">
                        <strong>Price:</strong> {price} SAR
                      </p>
                    )}
                    {date && (
                      <p className="small text-start text-muted mb-3">
                        <strong>Date:</strong> {date}
                      </p>
                    )}

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

                      {(req.status || "").toLowerCase() === "accepted" &&
                        (req.offerBudget != null || req.offerDeadline) && (
                          <div className="d-flex gap-2">
                            <button
                              className="btn"
                              onClick={() => handleConfirmOffer(req.id)}
                              style={{
                                border: "1px solid #3a0b0b",
                                color: "#3a0b0b",
                                borderRadius: "20px",
                                padding: "4px 12px",
                                fontSize: "0.85rem",
                              }}
                            >
                              Confirm
                            </button>
                            <button
                              className="btn"
                              onClick={() => handleRejectOffer(req.id)}
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
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
