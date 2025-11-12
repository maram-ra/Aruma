// src/pages/client/ArtisanProfile.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { alertError, alertSuccess, alertInfo } from "../../components/ArumaAlert";

const API = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

/* -------- Origin (for serving internal/static images) -------- */
const ORIGIN = (() => {
  try {
    const u = new URL(API, window.location.origin);
    return u.toString().replace(/\/api\/v1\/?$/, "").replace(/\/+$/, "");
  } catch {
    return "http://127.0.0.1:8000";
  }
})();
const toImageURL = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${ORIGIN}${p}`;
};

/* ---------- Services pills (client view) ---------- */
function ServicesOffered({ artisan }) {
  const pills = [];
  if (artisan?.offersWorkshop) pills.push({ icon: "easel", text: "Workshops" });
  if (artisan?.offersLiveShow) pills.push({ icon: "broadcast-pin", text: "Live Show" });
  if (artisan?.offersProduct) pills.push({ icon: "bag", text: "Products" });

  if (!pills.length) return null;

  return (
    <div className="d-flex flex-wrap gap-2 mt-3 services-pills">
      {pills.map((p, i) => (
        <span
          key={i}
          className="badge d-inline-flex align-items-center"
          style={{
            background: "#f3efea",
            color: "#3a0b0b",
            borderRadius: "999px",
            fontWeight: 600,
            padding: "0.5rem 0.9rem",
          }}
        >
          <i className={`bi bi-${p.icon} me-2`} />
          {p.text}
        </span>
      ))}
    </div>
  );
}

/* ======================= Send Request Modal ======================= */
function SendRequestModal({ show, onClose, artisan }) {
  const requestTypeOptions = useMemo(() => {
    const opts = [];
    if (artisan?.offersProduct) opts.push({ value: "product", label: "Product" });
    if (artisan?.offersWorkshop) opts.push({ value: "workshop", label: "Workshop" });
    if (artisan?.offersLiveShow) opts.push({ value: "live_show", label: "Live Show" });
    if (opts.length === 0) {
      opts.push(
        { value: "product", label: "Product" },
        { value: "workshop", label: "Workshop" },
        { value: "live_show", label: "Live Show" }
      );
    }
    return opts;
  }, [artisan]);

  const [requestType, setRequestType] = useState("product");
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (show) {
      setRequestType(requestTypeOptions[0]?.value || "product");
      setMessage("");
      setBudget("");
      setDeadline("");
    }
  }, [show, requestTypeOptions]);

  if (!show) return null;

  const submit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const rawType = (
      localStorage.getItem("userType") ||
      localStorage.getItem("role") ||
      localStorage.getItem("accountType") ||
      ""
    ).toLowerCase();

    const isClient = rawType === "client" || window.location.pathname.startsWith("/client");

    if (!token || !isClient) {
      await alertInfo("Please login as a client to send a request.");
      return;
    }

    try {
      const res = await fetch(`${API}/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          artisanId: artisan._id,
          requestType, // product | workshop | live_show
          message,
          offerBudget: budget ? Number(budget) : null,
          offerDeadline: deadline || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Failed to send request");

      await alertSuccess("Your request was sent!");
      onClose();
    } catch (err) {
      await alertError(err.message || "Network error");
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow" style={{ background: "#f5f5ee", borderRadius: 16 }}>
          <div className="d-flex justify-content-between align-items-center p-3">
            <h5 className="fw-bold m-0" style={{ color: "#3a0b0b" }}>
              Send Request to {artisan?.name}
            </h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <form onSubmit={submit} className="px-3 pb-4">
            <div className="mb-3">
              <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                Request Type
              </label>
              <select
                className="form-select"
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
              >
                {requestTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                Message
              </label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Describe what you need…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn" style={{ background: "#3a0b0b", color: "#fff" }}>
                Send Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ======================= Main Client View ======================= */
export default function ArtisanProfile() {
  const [searchParams] = useSearchParams();
  const [artisan, setArtisan] = useState(null);
  const [showSend, setShowSend] = useState(false);

  const artisanId = searchParams.get("id");
  const token = localStorage.getItem("token");

  const rawUserType = (
    localStorage.getItem("userType") ||
    localStorage.getItem("role") ||
    localStorage.getItem("accountType") ||
    ""
  ).toLowerCase();

  const isClient = rawUserType === "client" || window.location.pathname.startsWith("/client");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/artisans/${artisanId}`, {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.detail || "Failed to load artisan");
        setArtisan(data);
      } catch (err) {
        await alertError(err.message || "Network error");
      }
    };
    if (artisanId) load();
  }, [artisanId, token]);

  if (!artisan) {
    return (
      <div className="text-center py-5">
        <p>Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="artisan-profile">
      <Navbar />

      <section className="container py-5 mt-5">
        <div className="row align-items-center justify-content-between hero-row">
          <div
            className="col-md-8 d-flex align-items-center flex-wrap flex-md-nowrap text-md-start text-center profile-left"
            style={{ gap: "1.5rem" }}
          >
            <img
              src={toImageURL(artisan.images?.[0] || artisan.image) || "/images/default_profile.png"}
              alt="Profile"
              className="rounded-circle mx-auto mx-md-0"
              style={{
                width: 90,
                height: 90,
                objectFit: "cover",
                border: "1px solid #d3d3d3",
                backgroundColor: "#e7e7e7",
              }}
            />

            <div className="w-100 w-md-auto">
              <h6 className="fw-bold mb-1" style={{ color: "#3a0b0b", fontSize: "1.15rem" }}>
                {artisan.name}
              </h6>

              <small className="text-muted d-block">{artisan.craftType || ""}</small>

              <p
                className="small mb-0 mt-2 bio"
                style={{ color: "#6f4e37", lineHeight: 1.8, maxWidth: 520 }}
              >
                {artisan.bio?.trim()
                  ? artisan.bio
                  : "No bio yet — every craft tells a story waiting to be shared."}
              </p>

              {/* كبسولات الخدمات */}
              <ServicesOffered artisan={artisan} />
            </div>
          </div>

          <div className="col-md-4 mt-4 mt-md-0 d-flex gap-2 justify-content-md-end justify-content-center profile-actions">
            {isClient && (
              <button
                className="btn send-btn"
                style={{ background: "#3a0b0b", color: "#fff" }}
                onClick={() => setShowSend(true)}
              >
                Send Request
              </button>
            )}
          </div>
        </div>
      </section>

      <div
        className="container"
        style={{ borderBottom: "1px solid #cbbeb3", opacity: 0.5, marginBottom: "2rem" }}
      />

      {/* My Work (centered) */}
      <section
        className="container pb-5 d-flex flex-column align-items-center text-center"
        style={{ maxWidth: 1100 }}
      >
        <h5 className="fw-bold mb-4" style={{ color: "#3a0b0b" }}>
          My Work
          <span className="ms-2 text-muted fw-normal" style={{ fontSize: 14 }}>
            ({artisan.workImages?.length || 0})
          </span>
        </h5>

        {artisan.workImages?.length ? (
          <div className="row g-4 justify-content-center w-100">
            {artisan.workImages.map((u, i) => (
              <div key={i} className="col-12 col-sm-6 col-lg-4 d-flex flex-column align-items-center">
                <div className="position-relative" style={{ width: "100%", maxWidth: 340 }}>
                  <img
                    src={toImageURL(u)}
                    alt={`work-${i}`}
                    style={{ width: "100%", height: 420, objectFit: "cover", borderRadius: 12, display: "block" }}
                  />
                </div>
                <h6 className="fw-semibold mt-3 mb-0" style={{ color: "#3a0b0b" }}>
                  {artisan.workTitles?.[i] || `Artwork ${i + 1}`}
                </h6>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No work images uploaded yet.</p>
        )}
      </section>

      <Footer />

      <SendRequestModal show={showSend} onClose={() => setShowSend(false)} artisan={artisan} />

      {/* ===== Mobile-only centering (desktop unchanged) ===== */}
      <style>{`
        /* شاشات الجوال فقط */
        @media (max-width: 575.98px){
          .artisan-profile .hero-row { text-align: center; }
          .artisan-profile .profile-left { justify-content: center !important; }
          .artisan-profile .services-pills { justify-content: center !important; }
          .artisan-profile .profile-actions { justify-content: center !important; }
          .artisan-profile .send-btn { width: 100%; max-width: 420px; }
          .artisan-profile .bio { margin-left: auto; margin-right: auto; }
        }

        /* حركة أقل */
        @media (prefers-reduced-motion: reduce){
          * { transition: none !important; animation: none !important; }
        }
      `}</style>
    </div>
  );
}
