import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import CropManagement from "./pages/CropManagement";
import MarketManagement from "./pages/MarketManagement";
import PriceValidation from "./pages/PriceValidation";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/crop-management" element={<CropManagement />} />
      <Route path="/market-management" element={<MarketManagement />} />
      <Route path="/price-validation" element={<PriceValidation />} />
    </Routes>
  );
}