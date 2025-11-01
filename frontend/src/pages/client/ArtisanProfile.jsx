import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

/* ===================== Elegant Alert Dialog (Aruma Style) ===================== */
const theme = {
  primary: "#3a0b0b",
  beige: "#f9f7f2",
  border: "#cbbeb3",
  success: "#3c7c59",
  error: "#a13a3a",
  text: "#5c4b45",
};

function showAlert({ type = "info", title = "Message", message = "", confirmText = "OK", cancelText = "Cancel" } = {}) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.35)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      backdropFilter: "blur(2px)",
    });

    const dialog = document.createElement("div");
    Object.assign(dialog.style, {
      backgroundColor: theme.beige,
      borderRadius: "16px",
      padding: "28px 26px 24px",
      width: "90%",
      maxWidth: "420px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
      border: `1px solid ${theme.border}`,
      fontFamily: "inherit",
      textAlign: "center",
      opacity: 0,
      transform: "scale(0.9)",
      transition: "all 0.25s ease",
    });

    const icon = document.createElement("div");
    icon.textContent =
      type === "success" ? "✓" : type === "error" ? "✕" : type === "confirm" ? "⚑" : "ℹ";
    Object.assign(icon.style, {
      fontSize: "28px",
      color:
        type === "success"
          ? theme.success
          : type === "error"
          ? theme.error
          : theme.primary,
      marginBottom: "12px",
    });

    const titleEl = document.createElement("h4");
    titleEl.textContent = title;
    Object.assign(titleEl.style, {
      color: theme.primary,
      fontWeight: 700,
      fontSize: "1.15rem",
      margin: "0 0 8px",
    });

    const msgEl = document.createElement("p");
    msgEl.textContent = message;
    Object.assign(msgEl.style, {
      color: theme.text,
      lineHeight: 1.6,
      fontSize: "0.95rem",
      margin: "0 0 20px",
      whiteSpace: "pre-wrap",
    });

    const btnWrap = document.createElement("div");
    Object.assign(btnWrap.style, {
      display: "flex",
      justifyContent: type === "confirm" ? "space-between" : "center",
      gap: "12px",
    });

    const confirmBtn = document.createElement("button");
    confirmBtn.textContent =
      type === "success" ? "Great" : type === "error" ? "Close" : confirmText;
    Object.assign(confirmBtn.style, {
      flex: 1,
      borderRadius: "20px",
      border: "none",
      padding: "8px 16px",
      fontWeight: 600,
      backgroundColor:
        type === "error"
          ? theme.error
          : type === "success"
          ? theme.success
          : theme.primary,
      color: "#fff",
      cursor: "pointer",
      transition: "opacity 0.2s",
    });
    confirmBtn.onmouseover = () => (confirmBtn.style.opacity = "0.85");
    confirmBtn.onmouseout = () => (confirmBtn.style.opacity = "1");

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = cancelText;
    Object.assign(cancelBtn.style, {
      flex: 1,
      borderRadius: "20px",
      border: `1px solid ${theme.border}`,
      padding: "8px 16px",
      fontWeight: 500,
      backgroundColor: "transparent",
      color: theme.primary,
      cursor: "pointer",
      display: type === "confirm" ? "block" : "none",
    });

    const close = (result) => {
      dialog.style.opacity = "0";
      dialog.style.transform = "scale(0.9)";
      setTimeout(() => {
        overlay.remove();
        resolve(result);
      }, 200);
    };

    confirmBtn.onclick = () => close(true);
    cancelBtn.onclick = () => close(false);

    btnWrap.appendChild(cancelBtn);
    btnWrap.appendChild(confirmBtn);

    dialog.appendChild(icon);
    dialog.appendChild(titleEl);
    dialog.appendChild(msgEl);
    dialog.appendChild(btnWrap);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    setTimeout(() => {
      dialog.style.opacity = "1";
      dialog.style.transform = "scale(1)";
    }, 10);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close(false);
    });
    window.addEventListener("keydown", (e) => e.key === "Escape" && close(false));
  });
}

const alertSuccess = (msg, opts) => showAlert({ type: "success", message: msg, title: "Success", ...opts });
const alertError = (msg, opts) => showAlert({ type: "error", message: msg, title: "Error", ...opts });
const alertInfo = (msg, opts) => showAlert({ type: "info", message: msg, title: "Notice", ...opts });
const alertConfirm = (msg, opts) => showAlert({ type: "confirm", message: msg, title: "Confirm", ...opts });
/* ============================================================================ */

/* ======================= Request Modal ======================= */
function RequestModal({ show, onClose, artisan }) {
  const [formData, setFormData] = useState({ type: "", message: "" });
  const token = localStorage.getItem("token");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type) {
      await alertInfo("Please select a service type.", { title: "Missing Field" });
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          artisanId: artisan._id,
          requestType: formData.type,
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        await alertSuccess(`Request sent successfully to ${artisan.name}!`, {
          confirmText: "Great",
        });
        onClose();
        setFormData({ type: "", message: "" });
      } else {
        await alertError(data.detail || "Failed to send request");
      }
    } catch {
      await alertError("Network error.\nPlease try again later.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
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
              Send Request
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                Type of Service <span className="text-danger">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="form-select"
                style={{ borderRadius: "8px", borderColor: "#cbbeb3" }}
              >
                <option value="">Select type</option>
                <option value="product">Product</option>
                <option value="workshop">Workshop</option>
                <option value="live_show">Live Show</option>
              </select>
            </div>

            <div className="mb-4 text-start">
              <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                Message <span className="text-danger">*</span>
              </label>
              <textarea
                name="message"
                rows="3"
                placeholder="Write a short description of your request..."
                value={formData.message}
                onChange={handleChange}
                required
                className="form-control"
                style={{ borderRadius: "8px", borderColor: "#cbbeb3" }}
              ></textarea>
            </div>

            <div className="d-flex justify-content-end gap-3">
              <button type="button" className="btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-main">
                Send Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ======================= Main Artisan Profile ======================= */
export default function ArtisanProfile() {
  const [searchParams] = useSearchParams();
  const [artisan, setArtisan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const artisanId = searchParams.get("id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/v1/artisans/${artisanId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setArtisan(await res.json());
        else await alertError("Failed to load artisan details.");
      } catch (error) {
        console.error("Error fetching artisan:", error);
        await alertError("Network error while loading artisan.");
      }
    };
    if (artisanId) fetchArtisan();
  }, [artisanId, token]);

  if (!artisan)
    return (
      <div className="text-center py-5">
        <p>Loading artisan details...</p>
      </div>
    );

  return (
    <div className="artisan-profile">
      <Navbar />

      <section className="container py-5 mt-5">
        <div className="row align-items-center justify-content-between">
          <div
            className="col-md-8 d-flex align-items-center flex-wrap flex-md-nowrap text-md-start text-center"
            style={{ gap: "1.5rem" }}
          >
            <img
              src={artisan.images?.[0] || "/images/default_profile.png"}
              alt="Profile"
              className="rounded-circle"
              style={{
                width: "90px",
                height: "90px",
                objectFit: "cover",
                border: "1px solid #d3d3d3",
                backgroundColor: "#e7e7e7",
              }}
            />

            <div>
              <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                <h6
                  className="fw-bold mb-0 text-lowercase"
                  style={{
                    color: "#3a0b0b",
                    fontSize: "1.15rem",
                    letterSpacing: "0.3px",
                  }}
                >
                  {artisan.name}
                </h6>
              </div>

              <p className="services-list mb-2">
                {artisan.offersProduct && <span className="service-badge">Products</span>}
                {artisan.offersWorkshop && <span className="service-badge">Workshops</span>}
                {artisan.offersLiveShow && <span className="service-badge">Live Show</span>}
              </p>

              <p
                className="small mb-0"
                style={{
                  color: "#6f4e37",
                  lineHeight: "1.8",
                  maxWidth: "420px",
                  fontSize: "0.95rem",
                  marginTop: "8px",
                }}
              >
                {artisan.bio && artisan.bio.trim() !== ""
                  ? artisan.bio
                  : "No bio yet — every craft tells a story waiting to be shared."}
              </p>
            </div>
          </div>

          <div className="col-md-4 mt-4 mt-md-0 d-flex justify-content-md-end justify-content-center">
            <button className="btn-outline" onClick={() => setShowModal(true)}>
              Send Request
            </button>
          </div>
        </div>
      </section>

      <div
        className="container"
        style={{
          borderBottom: "1px solid #cbbeb3",
          opacity: "0.5",
          marginBottom: "2rem",
        }}
      ></div>

      <section className="container py-5 text-center">
        <h5
          className="fw-bold mb-5"
          style={{
            color: "#3a0b0b",
            fontSize: "1.25rem",
            letterSpacing: "0.5px",
          }}
        >
          My Work
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

        {artisan.images?.slice(1)?.length ? (
          <div className="row justify-content-center" style={{ rowGap: "60px" }}>
            {artisan.images.slice(1).map((img, i) => (
              <div key={i} className="col-12 col-sm-6 col-md-4 d-flex flex-column align-items-center">
                <div
                  className="overflow-hidden"
                  style={{
                    borderRadius: "10px",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                  }}
                >
                  <img
                    src={img}
                    alt={`Work ${i + 1}`}
                    style={{
                      width: "100%",
                      maxWidth: "340px",
                      height: "420px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <h6 className="fw-semibold mt-3 mb-1" style={{ color: "#3a0b0b" }}>
                  Artwork {i + 1}
                </h6>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No work images uploaded yet.</p>
        )}
      </section>

      <Footer />

      <RequestModal show={showModal} onClose={() => setShowModal(false)} artisan={artisan} />
    </div>
  );
}
