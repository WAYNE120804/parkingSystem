import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ActiveEntriesPage from "./pages/ActiveEntriesPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/entries" element={<ActiveEntriesPage />} />
        <Route path="*" element={<Navigate to="/entries" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
