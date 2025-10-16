import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toast } from "bootstrap";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Requests_A() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      client: "Layla_Artworks",
      type: "Custom Pottery Set",
      message:
        "Layla would like to collaborate on a limited-edition pottery set for her boutique. Beige matte glaze preferred.",
      date: "Sep 28, 2025",
      status: "pending",
    },
    {
      id: 2,
      client: "Rawan_Studio",
      type: "Workshop Collaboration",
      message:
        "Rawan is organizing a weekend pottery workshop and would love you to host the session for 10 participants.",
      date: "Sep 20, 2025",
      status: "approved",
    },
    {
      id: 3,
      client: "Hanan.Design",
      type: "Live Show Request",
      message:
        "Hanan invited you for a 30-minute live show at Riyadh Season featuring artisan talks.",
      date: "Aug 30, 2025",
      status: "rejected",
    },
    {
      id: 4,
      client: "Mona_ClaySpace",
      type: "Product Order",
      message:
        "Mona ordered 12 handmade espresso cups with engraved initials for her new café.",
      date: "Jul 14, 2025",
      status: "completed",
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [toastInfo, setToastInfo] = useState(null);
  const toastRef = useRef(null);

  useEffect(() => {
    if (toastInfo && toastRef.current) {
      const toast = new Toast(toastRef.current);
      toast.show();
    }
  }, [toastInfo]);

  const sortedRequests = [...requests].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const filteredRequests = sortedRequests.filter((r) =>
    filter === "all" ? true : r.status === filter
  );

  const getCount = (status) =>
    status === "all"
      ? requests.length
      : requests.filter((r) => r.status === status).length;

  const handleUpdate = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    const client = requests.find((r) => r.id === id)?.client;
    setToastInfo({
      message:
        newStatus === "approved"
          ? `Request from ${client} approved ✅`
          : `Request from ${client} rejected ❌`,
      color: newStatus === "approved" ? "#3c7c59" : "#a13a3a",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#d4a017";
      case "approved":
        return "#3c7c59";
      case "rejected":
        return "#a13a3a";
      case "completed":
        return "#6c757d";
      default:
        return "#6c757d";
    }
  };

  return (
    <div className="requests-page" style={{ backgroundColor: "#f5f5ee" }}>
      <Navbar />

      {/* ===== Toast ===== */}
      <div
        className="toast-container position-fixed top-0 end-0 p-3"
        style={{ zIndex: 1100 }}
      >
        <div
          ref={toastRef}
          className="toast align-items-center text-white border-0"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style={{
            backgroundColor: toastInfo?.color || "#3a0b0b",
            minWidth: "280px",
            borderRadius: "10px",
          }}
        >
          <div className="d-flex">
            <div className="toast-body">{toastInfo?.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
            ></button>
          </div>
        </div>
      </div>

      {/* ===== Header ===== */}
      <section className="container py-5 mt-5">
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
          Manage your client requests, approve new collaborations, or update
          project statuses — all from one dashboard.
        </p>
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
          {["all", "pending", "approved", "completed", "rejected"].map(
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

      {/* ===== Requests ===== */}
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

        <div className="row justify-content-center">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="col-12 col-sm-10 col-md-8 mb-4 d-flex justify-content-center"
            >
              <div
                className="d-flex flex-column border rounded-3 p-4 bg-white shadow-sm w-100"
                style={{
                  backgroundColor: "#f9f8f4",
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
                      {req.type}
                    </h6>
                    <small className="text-muted" style={{ fontSize: "0.9rem" }}>
                      From: {req.client}
                    </small>
                  </div>
                  <small className="text-muted" style={{ fontSize: "0.9rem" }}>
                    {req.date}
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
                    {["pending", "approved", "rejected", "completed"].map(
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

                  {req.status === "pending" && (
                    <div className="d-flex gap-2">
                      <button
                        className="btn"
                        style={{
                          border: "1px solid #3c7c59",
                          color: "#3c7c59",
                          borderRadius: "20px",
                          padding: "4px 12px",
                          fontSize: "0.85rem",
                        }}
                        onClick={() => handleUpdate(req.id, "approved")}
                      >
                        Accept
                      </button>
                      <button
                        className="btn"
                        style={{
                          border: "1px solid #a13a3a",
                          color: "#a13a3a",
                          borderRadius: "20px",
                          padding: "4px 12px",
                          fontSize: "0.85rem",
                        }}
                        onClick={() => handleUpdate(req.id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
