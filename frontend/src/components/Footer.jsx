import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Footer() {
  return (
    <footer
      className="text-white text-center mt-5 pt-4 pb-3"
      style={{
        backgroundColor: "#7d769c",
        width: "100%",
      }}
    >
      {/* روابط الفوتر */}
      <div className="d-flex flex-wrap justify-content-center gap-4 mb-3 small">
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

      {/* خط فاصل */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.3)",
          width: "85%",
          margin: "0 auto 10px auto",
        }}
      ></div>

    
    </footer>
  );
}
