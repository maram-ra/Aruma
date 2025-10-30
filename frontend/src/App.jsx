import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginRegister from "./pages/LoginRegister";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<LoginRegister />} />
      </Routes>
    </BrowserRouter>
  );
}
