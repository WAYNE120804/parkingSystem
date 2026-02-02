import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrincipalPage from "./pages/principalPage.jsx";
import ConfiguracionPage from "./pages/configPage.jsx";
import { UserProvider } from "./context/UserContext.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/entries" element={<PrincipalPage />} />
          <Route path="/config" element={<ConfiguracionPage />} />
          <Route path="*" element={<Navigate to="/entries" replace />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}