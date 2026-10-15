import { FiGrid, FiFeather, FiMapPin, FiTag, FiCheckCircle, FiClock, FiTrendingUp, FiBarChart2, FiSettings } from "react-icons/fi";
export const navigation = {
  portalLabel: "MAO Portal",
  topbarTitle: "Municipal Agriculture Office",
  userInitials: "MAO",
  userLabel: "MAO Personnel",
  sections: [
    { label: "Overview", items: [{ label: "MAO Dashboard", path: "/dashboard", icon: FiGrid }] },
    { label: "Agricultural Management", items: [
      { label: "Crop Management", path: "/crop-management", icon: FiFeather },
      { label: "Market Management", path: "/market-management", icon: FiMapPin },
      { label: "Crop Prices", path: "/crop-prices", icon: FiTag },
      { label: "Price Validation", path: "/price-validation", icon: FiCheckCircle },
    ]},
    { label: "Monitoring", items: [
      { label: "Historical Records", path: "/historical-records", icon: FiClock },
      { label: "Forecast Information", path: "/forecast-information", icon: FiTrendingUp },
    ]},
    { label: "Reports", items: [{ label: "Reports & Analytics", path: "/reports-analytics", icon: FiBarChart2 }] },
    { label: "Account", items: [{ label: "Settings", path: "/settings", icon: FiSettings }] },
  ],
};
