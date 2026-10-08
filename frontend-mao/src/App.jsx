import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import CropManagement from "./pages/CropManagement";
import MarketManagement from "./pages/MarketManagement";
import PriceManagement from "./pages/PriceManagement";
import PriceValidation from "./pages/PriceValidation";
import HistoricalRecords from "./pages/HistoricalRecords";
import ForecastInformation from "./pages/ForecastInformation";
import ReportsAnalytics from "./pages/ReportsAnalytics";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/crop-management" element={<CropManagement />} />
      <Route path="/market-management" element={<MarketManagement />} />
      <Route path="/crop-prices" element={<PriceManagement />} />
      <Route path="/price-validation" element={<PriceValidation />} />
      <Route path="/historical-records" element={<HistoricalRecords />} />
      <Route path="/forecast-information" element={<ForecastInformation />} />
      <Route path="/reports-analytics" element={<ReportsAnalytics />} />
    </Routes>
  );
}