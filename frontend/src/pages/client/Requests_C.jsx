import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { alertSuccess, alertError, alertInfo, alertConfirm } from "../../components/ArumaAlert";

export default function Requests_C() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "";

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/v1/requests/client/${clientId}/requests`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch requests");
        const data = await res.json();
        setRequests(data.requests || []);
      } catch (err) {
        console.error("Error fetching client requests:", err);
        await alertError("Failed to load requests.\nPlease try again later.");
      }
    };
    if (clientId && token) fetchRequests();
  }, [clientId, token]);

  // Confirm contract
  const handleConfirmContract = async (contractId) => {
    const ok = await alertConfirm(
      "Do you confirm the workshop details shared by the artisan?",
      { title: "Confirm", confirmText: "Yes", cancelText: "No" }
    );
    if (!ok) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/v1/contracts/${contractId}/confirm`,
        { method: "PUT", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to confirm contract");
      await alertSuccess("Workshop confirmed successfully! 🌿");
      window.location.reload();
    } catch (err) {
      console.error(err);
      await alertError("Error confirming contract.\nPlease try again later.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "#d4a017";
      case "accepted": return "#9370DB";
      case "completed": return "#3c7c59";
      case "rejected": return "#a13a3a";
      default: return "#6c757d";
    }
  };

  const filteredRequests =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const getCount = (state) =>
    state === "all" ? requests.length : requests.filter((r) => r.status === state).length;

  return (
    <div className="requests-page">
      <Navbar />

      {/* ===== Header ===== */}
      <section className="container py-5 mt-5">
        <h6 className="fw-bold mb-2 page-title" style={{ color: "#3a0b0b", fontSize: "1.2rem" }}>
          Welcome back{userName ? `, ${userName}` : ""}!
        </h6>
        <p className="small page-sub" style={{ color: "#5c4b45", maxWidth: "480px" }}>
          Track your requests, follow artisan updates, and confirm your workshop details once approved.
        </p>
      </section>

      <div className="container" style={{ borderBottom: "1px solid #cbbeb3", opacity: 0.5, marginBottom: "2rem" }} />

      {/* ===== Filters ===== */}
      <section className="container text-center mb-4">
        <div className="d-flex flex-wrap justify-content-center gap-3 filter-wrap">
          {["all", "pending", "accepted", "completed", "rejected"].map((state) => (
            <button
              key={state}
              onClick={() => setFilter(state)}
              className={`btn ${filter === state ? "btn-dark" : "btn-outline-dark"} filter-btn`}
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
        <h5 className="fw-bold mb-5" style={{ color: "#3a0b0b", fontSize: "1.25rem" }}>
          Your Requests
          <div style={{ width: "50px", height: "2px", backgroundColor: "#cbbeb3", margin: "10px auto 0", opacity: 0.8 }} />
        </h5>

        {filteredRequests.length === 0 ? (
          <p className="text-muted">No requests yet. Your submitted requests will appear here.</p>
        ) : (
          <div className="row justify-content-center">
            {filteredRequests.map((req) => (
              <div key={req._id} className="col-12 col-sm-10 col-md-8 mb-4 d-flex justify-content-center">
                <div className="border rounded-3 p-4 shadow-sm w-100 request-card" style={{ backgroundColor: "#f1efe8" }}>
                  <div className="d-flex justify-content-between align-items-center mb-3 request-card-head">
                    <div className="text-start">
                      <h6 className="fw-semibold mb-1" style={{ color: "#3a0b0b" }}>
                        {req.requestType || "Request"}
                      </h6>
                      <small className="text-muted">Artisan: {req.artisanName || "Unknown"}</small>
                    </div>
                    <small className="text-muted">{req.date || "—"}</small>
                  </div>

                  <p className="small text-start req-message" style={{ color: "#5c4b45", lineHeight: "1.6" }}>
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

                    {req.status === "accepted" && req.contractId && (
                      <button
                        className="btn"
                        onClick={() => handleConfirmContract(req.contractId)}
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

                    {req.status === "in progress" && req.artisanPhone && (
                      <a
                        href={`https://wa.me/${req.artisanPhone}?text=${encodeURIComponent(
                          `Hi ${req.artisanName || ""}! I’m confirming our workshop from Aruma 🌿`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn whats-btn"
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

      <Footer />

      {/* ===== Responsive styles (desktop unchanged) ===== */}
      <style>{`
        /* تحسين القراءة قليلاً على الديسكتوب دون تغيير التصميم */
        @media (min-width: 992px){
          .req-message{ max-width: 70ch; }
        }

        /* تابلت وما دون (≤ 991.98px) */
        @media (max-width: 991.98px){
          .page-title{ font-size: clamp(1.05rem, 2.2vw, 1.2rem) !important; }
          .page-sub{ max-width: 60ch !important; font-size: clamp(.92rem, 1.9vw, 1rem) !important; }

          .filter-wrap{ gap: .5rem !important; }
          .filter-btn{ padding: 6px 14px !important; font-size: .9rem !important; }

          .request-card{ padding: 1.25rem !important; }
          .request-card-head{ gap: .75rem; }
        }

        /* جوال صغير (≤ 575.98px) */
        @media (max-width: 575.98px){
          .page-title{ font-size: 1.05rem !important; }
          .page-sub{ padding-inline: .5rem; line-height: 1.6; }

          /* البطاقات بعرض مناسب وهوامش داخلية مريحة */
          .request-card{ padding: 1rem !important; }
          .req-message{ font-size: .95rem; }

          /* الأزرار أكبر قليلًا للمس */
          .request-card .btn{ padding: 6px 14px !important; font-size: .9rem !important; }

          /* لو في زر واتساب، خلّيه يمتد بالعرض */
          .whats-btn{ width: 100%; text-align: center; }
        }

        /* احترام تقليل الحركة */
        @media (prefers-reduced-motion: reduce){
          *{ transition: none !important; animation: none !important; }
        }
      `}</style>
    </div>
  );
}
