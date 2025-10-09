// src/components/Button.jsx
import React from "react";
import "./Button.css"; 

const Button = ({ text, type = "filled", onClick }) => {
  return (
    <button
      className={`btn ${type === "filled" ? "btn-filled" : "btn-outline"}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
