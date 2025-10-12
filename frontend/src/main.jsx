import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import { UserProvider } from "./context/UserContext";



import UserType from "./pages/UserType";
import Login from "./pages/Login";
import Marketplace from "./pages/client/Marketplace";
import Register from "./pages/Register"; 
import ArtisanProfile from "./pages/client/ArtisanProfile";
import Requests from './pages/client/Requests';




ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<UserType />} />
          <Route path="/usertype" element={<UserType />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/artisan/profile" element={<ArtisanProfile />} />
          <Route path="/Requests" element={<Requests />} />

        </Routes>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
