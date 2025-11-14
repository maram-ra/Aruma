// src/components/ProfileLoader.jsx
import React from "react";
import Lottie from "lottie-react";
import trailLoading from "../assets/trail-loading.json";

export default function ProfileLoader() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center w-100"
      style={{ minHeight: "100vh" }} // خليها 100vh لو تبينه بالنص تمامًا
    >
      <Lottie
        animationData={trailLoading}
        loop
        style={{ width: 160, height: 160 }}
      />
    </div>
  );
}
