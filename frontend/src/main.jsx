import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import UserType from "./pages/UserType";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Marketplace from "./pages/client/Marketplace";
import ArtisanProfile from "./pages/client/ArtisanProfile";
import Requests_A from "./pages/artisan/Requests_A";
import Requests_C from "./pages/client/Requests_C";
import Profile from "./pages/artisan/Profile";
import ForgotPassword from "./pages/ForgotPassword";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserType />} />
        <Route path="/usertype" element={<UserType />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/client/ArtisanProfile" element={<ArtisanProfile />} />
        <Route path="/client/Requests_C" element={<Requests_C />} />
        <Route path="/artisan/Requests_A" element={<Requests_A />} />
        <Route path="/artisan/Profile" element={<Profile />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
