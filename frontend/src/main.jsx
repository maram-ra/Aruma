import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { UserProvider } from "./context/UserContext";
import 'bootstrap/dist/css/bootstrap.min.css';



import UserType from "./pages/UserType";
import Login from "./pages/Login";
import Marketplace from "./pages/Marketplace";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<UserType />} />
          <Route path="/login" element={<Login />} />
          <Route path="/marketplace" element={<Marketplace />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
