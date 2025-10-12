import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Marketplace() {
  const navigate = useNavigate();

  const handleLoginClick = () => navigate("/login?type=client");

  return (
    <div style={{ backgroundColor: "#f5f5ee", color: "#3a0b0b" }}>
      {/* ===== Navbar ===== */}
      <nav
        className="navbar navbar-expand-lg py-3"
        style={{ backgroundColor: "#f5f5ee" }}
      >
        <div className="container d-flex justify-content-between align-items-center">
          {/* Left Links */}
          <div className="d-flex gap-3">
            <Link
              to="/"
              className="text-decoration-none text-dark  fw-normal"
            >
              Home
            </Link>
          
          <a href="/Requests" className="Requests-link">Profile</a>

          </div>

          {/* Logo Center */}
          <a href="#" className="navbar-brand m-0">
            <img src="./logo.png" alt="Aruma Logo" width="65" />
          </a>

          {/* Login Button */}
          <a
            onClick={handleLoginClick}
            className="text-decoration-none text-dark small fw-semibold"
            href="#"
          >
            Login
          </a>
        </div>
      </nav>

      {/* ===== Hero Section ===== */}
      <section
      className="container text-center"
      style={{
        paddingTop: "16rem",
        paddingBottom: "16rem",
      }}
>

        <h1 className="fw-bold mb-3" style={{ color: "#3a0b0b" }}>
          Discover unique handmade creations
        </h1>
        <p className="text-muted mb-5" style={{ maxWidth: "600px", margin: "0 auto" }}>
          book workshops, and connect directly with talented makers - all in one
          place.
        </p>
      </section>



 {/* ===== Explore Section ===== */}
<section className="container py-5 text-center">
  <h5 className="fw-bold mb-4" style={{ color: "#3a0b0b" }}>
   Explore
  </h5>

  <div
    className="row justify-content-center"
    style={{
      columnGap: "20px",
      rowGap: "25px", 
    }}
  >
    {[
      { img: "/images/work1.jpg", title: "Lapis Stud" },
      { img: "/images/work2.jpg", title: "Vintage Fetish Bear Necklace" },
      { img: "/images/work3.jpg", title: "Lapis Stud" },
      { img: "/images/work4.jpg", title: "Vintage Turquoise Ring" },
      { img: "/images/work5.jpg", title: "Misawa Mini Hoop Earrings - Pair" },
      { img: "/images/work6.jpg", title: "Bonnie Bracelet" },
    ].map((work, index) => (
      <div
        className="col-12 col-sm-4 col-md-3 d-flex justify-content-center"
        key={index}
      >
        <div className="d-flex flex-column align-items-center">
          <img
            src={work.img}
            alt={work.title}
            className="img-fluid mb-2"
            style={{
              width: "90%", 
              borderRadius: "0px",
              objectFit: "cover",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
         <small
  className="mt-1 fw-medium"
  style={{ color: "#3a0b0b", fontSize: "0.85rem", fontStyle: "normal" }}
>
  {work.title}
</small>

        </div>
      </div>
    ))}
  </div>
</section>



     {/* ===== Footer ===== */}
<footer
  className="text-white text-center py-4"
  style={{ backgroundColor: "#7d769c", marginTop: "5rem" }}
>
  <div className="container small d-flex justify-content-center gap-4 flex-wrap">
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
