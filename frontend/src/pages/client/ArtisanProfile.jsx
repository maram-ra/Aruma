import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ArtisanProfile.css";
import WorkGallery from "../../components/WorkGallery";


export default function ArtisanProfile() {
  return (
    <div className="artisan-profile" style={{ backgroundColor: "#f5f5ee" }}>
      {/* ===== Navbar ===== */}
      <nav
        className="navbar navbar-expand-lg py-3"
        style={{ backgroundColor: "#f5f5ee" }}
      >
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex gap-3">
            <a href="#" className="text-decoration-none text-dark small">
              Home
            </a>
            <a href="#" className="text-decoration-none text-dark small">
              Account
            </a>
          </div>

          <a href="#" className="navbar-brand m-0">
            <img src="/logo.png" alt="Aruma Logo" width="50" />
          </a>

          <a
            href="#"
            className="text-decoration-none fw-semibold small text-dark"
          >
            Login
          </a>
        </div>
      </nav>

      {/* ===== Profile Section ===== */}
<section className="container py-5">
  <div className="row align-items-center justify-content-between">
    {/* Left side */}
    <div className="col-md-8 d-flex align-items-center" style={{ gap: "1.2rem" }}>
      {/* Avatar */}
      <div
        className="rounded-circle bg-secondary flex-shrink-0"
        style={{ width: "70px", height: "70px", opacity: "0.2" }}
      ></div>

      {/* Text section */}
      <div>
        <h6 className="fw-bold mb-2 text-lowercase" style={{ color: "#3a0b0b" }}>
          sara
        </h6>

              <p className="mb-2">
          <span className="badge small fw-normal me-2" style={{ backgroundColor: "#e3e4e1", color: "#3a0b0b" }}>Products</span>
          <span className="badge small fw-normal me-2" style={{ backgroundColor: "#e3e4e1", color: "#3a0b0b" }}>Workshops</span>
          <span className="badge small fw-normal" style={{ backgroundColor: "#e3e4e1", color: "#3a0b0b" }}>Live Show</span>
        </p>


        <p className="small mb-0" style={{ color: "#3a0b0b", lineHeight: "1.6" }}>
          Crafting unique, handmade jewelry pieces with a sustainable touch.
        </p>
      </div>
    </div>

    {/* Right side button */}
    <div className="col-md-4 text-md-end mt-4 mt-md-0">
      <button
        className="btn fw-semibold px-4 py-2"
        style={{
          backgroundColor: "#4b1e1e",
          color: "white",
          borderRadius: "12px",
          fontSize: "0.9rem",
        }}
      >
        Send Request
      </button>
    </div>
  </div>
</section>

{/* ===== My Work ===== */}

<WorkGallery />




{/* ===== Completed Requests ===== */}
<section className="container py-5 text-center">
  <h5 className="fw-bold mb-4" style={{ color: "#3a0b0b" }}>
    Completed Requests
  </h5>

  <div className="row justify-content-center">
    {[
      { title: "Necklace Order", date: "Completed August 2025" },
      { title: "Jewelry Workshop", date: "Completed July 2025" },
      { title: "Silver Rings", date: "Completed June 2025" },
    ].map((item, index) => (
      <div
        key={index}
        className="col-12 col-sm-10 col-md-8 mb-4 d-flex justify-content-center"
      >
        <div
          className="d-flex align-items-center justify-content-start border rounded-3 p-4 bg-white shadow-sm w-100"
          style={{
            backgroundColor: "#f9f8f4",
            borderColor: "#eee",
            minHeight: "100px",
            transition: "all 0.3s ease",
          }}
        >
          {/* Icon */}
          <div
            className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
            style={{
              width: "55px",
              height: "55px",
              backgroundColor: "#eeeae3",
            }}
          >
            <i
              className="bi bi-person"
              style={{ color: "#3a0b0b", fontSize: "1.6rem" }}
            ></i>
          </div>

          {/* Text */}
          <div className="text-start">
            <h6
              className="fw-semibold mb-1"
              style={{ color: "#3a0b0b", fontSize: "1rem" }}
            >
              {item.title}
            </h6>
            <small className="text-muted" style={{ fontSize: "0.9rem" }}>
              {item.date}
            </small>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>


      {/* ===== Footer ===== */}
      <footer
        style={{ backgroundColor: "#7d769c" }}
        className="text-white py-4 mt-5"
      >
        <div className="container d-flex justify-content-center gap-4 flex-wrap small">
          <a href="#" className="text-white text-decoration-none">
            About Us
          </a>
          <a href="#" className="text-white text-decoration-none">
            Terms of Service
          </a>
          <a href="#" className="text-white text-decoration-none">
            Privacy Policy
          </a>
          <a href="#" className="text-white text-decoration-none">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}
