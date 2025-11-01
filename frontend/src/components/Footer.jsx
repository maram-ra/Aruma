import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Footer() {
  return (
    <footer
      className="text-white mt-5"
      style={{
        backgroundColor: "#7d769c",
        paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))",
      }}
      aria-label="Site footer"
    >
      <div className="container px-3">
        <nav
          className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-2 gap-md-4 py-4 text-center"
          aria-label="Footer navigation"
        >
          {[
            { label: "About Us", href: "#" },
            { label: "Terms of Service", href: "#" },
            { label: "Privacy Policy", href: "#" },
            { label: "Contact", href: "#" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-white text-decoration-none px-3 py-2 rounded-3"
              style={{
                lineHeight: 1.4,
                fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
                transition: "opacity .2s ease, box-shadow .2s ease",
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/* تحسينات تفاعل بسيطة */}
      <style>{`
        footer a:hover { opacity: .85; }
        footer a:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 2px;
          box-shadow: 0 0 0 3px rgba(255,255,255,.25);
        }
        @media (max-width: 576px) {
          footer nav a { width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          footer a { transition: none !important; }
        }
      `}</style>
    </footer>
  );
}
