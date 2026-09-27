import { FiGrid, FiFeather, FiMapPin, FiTag, FiCheckCircle, FiClock, FiTrendingUp, FiBarChart2, FiSettings } from "react-icons/fi";
export const navigation = {
  portalLabel: "MAO Portal",
  topbarTitle: "Municipal Agriculture Office",
  userInitials: "MAO",
  userLabel: "MAO Personnel",
  sections: [
    { label: "Overview", items: [{ label: "MAO Dashboard", path: "/", icon: FiGrid }] },
    { label: "Agricultural Management", items: [
      { label: "Crop Management", path: "/crops", icon: FiFeather },
      { label: "Market Management", path: "/markets", icon: FiMapPin },
      { label: "Crop Prices", path: "/prices", icon: FiTag },
      { label: "Price Validation", path: "/validation", icon: FiCheckCircle },
    ]},
    { label: "Monitoring", items: [
      { label: "Historical Records", path: "/history", icon: FiClock },
      { label: "Forecast Information", path: "/forecast", icon: FiTrendingUp },
    ]},
    { label: "Reports", items: [{ label: "Reports & Analytics", path: "/reports", icon: FiBarChart2 }] },
    { label: "Account", items: [{ label: "Settings", path: "/settings", icon: FiSettings }] },
  ],
};
