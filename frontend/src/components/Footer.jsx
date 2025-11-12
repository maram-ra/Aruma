import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Footer() {
  return (
    <footer
      className="text-white mt-5 py-4"
      style={{
        backgroundColor: "#7d769c",
      }}
    >
      <div className="container">
        <div className="row justify-content-center text-center gy-3">
          <div className="col-12 col-sm-6 col-md-3">
            <a href="#" className="text-white text-decoration-none d-block">
              About Us
            </a>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <a href="#" className="text-white text-decoration-none d-block">
              Terms of Service
            </a>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <a href="#" className="text-white text-decoration-none d-block">
              Privacy Policy
            </a>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <a href="#" className="text-white text-decoration-none d-block">
              Contact
            </a>
          </div>
        </div>

        <hr className="border-light my-3" />

        <div className="text-center small">
          © {new Date().getFullYear()} Aruma — All rights reserved.
        </div>
      </div>
    </footer>
  );
}
