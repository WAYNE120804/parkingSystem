import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import './style.css';

import PrincipalPage from "./pages/principalPage.jsx";
import ConfiguracionPage from "./pages/configPage.jsx";
import MovementsPage from "./pages/movementsPage.jsx";
import PaymentsPage from "./pages/paymentsMovements.jsx";
import LoginPage from "./pages/loginPage.jsx";

import { UserProvider, useAuth } from "./context/UserContext.jsx";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && user.roleUser !== "ADMIN") {
    return <Navigate to="/entries" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/entries"
            element={
              <ProtectedRoute>
                <PrincipalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/config"
            element={
              <ProtectedRoute adminOnly>
                <ConfiguracionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movements"
            element={
              <ProtectedRoute>
                <MovementsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <PaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/entries" replace />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}
