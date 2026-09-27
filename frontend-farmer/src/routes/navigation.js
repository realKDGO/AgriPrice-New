import {
  House,
  Tags,
  ChartNoAxesCombined,
  Store,
  Grid2X2,
  Calculator,
  FileChartColumn,
  UserRound,
  Settings,
  HelpCircle,
  LayoutDashboard,
  Sprout,
  ShieldCheck,
  History,
  Users,
  UserCog,
  KeyRound,
  ScrollText,
  Activity,
  Shield,
  Database,
} from "lucide-react";
export const farmerNav = [
  ["", "Home", House],
  ["prices", "Crop Prices", Tags],
  ["forecast", "Forecast", ChartNoAxesCombined],
  ["markets", "Market Recommendation", Store],
  ["more", "More", Grid2X2],
];
export const toolsNav = [
  ["profit", "Profit Estimation", Calculator],
  ["reports", "Reports & Analytics", FileChartColumn],
];
export const accountNav = [["settings", "Settings", Settings]];
export const maoNav = [
  ["", "Dashboard", LayoutDashboard],
  ["crops", "Crop Management", Sprout],
  ["markets", "Market Management", Store],
  ["prices", "Crop Prices", Tags],
  ["validation", "Price Validation", ShieldCheck],
  ["history", "Historical Records", History],
  ["forecast", "Forecast Information", ChartNoAxesCombined],
  ["reports", "Reports & Analytics", FileChartColumn],
  ["settings", "Settings", Settings],
];
export const adminNav = [
  ["", "Dashboard", LayoutDashboard],
  ["users", "User Accounts", Users],
  ["mao-accounts", "MAO Accounts", UserCog],
  ["activity", "Audit Logs", ScrollText],
  ["access", "Roles & Access", KeyRound],
  ["reports", "Technical Reports", FileChartColumn],
  ["contacts", "Contact Inbox", UserRound],
  ["monitoring", "System Monitoring", Activity],
  ["security", "Security", Shield],
  ["backups", "Backup & Recovery", Database],
  ["settings", "System Settings", Settings],
];
