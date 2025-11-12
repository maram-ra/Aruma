import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Footer() {
  return (
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
  );
}
