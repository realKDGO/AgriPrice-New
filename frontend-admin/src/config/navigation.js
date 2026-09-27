import { FiGrid, FiUsers, FiBriefcase, FiFileText, FiActivity, FiShield, FiDatabase, FiSettings } from "react-icons/fi";
export const navigation = {
  portalLabel: "Admin Portal",
  topbarTitle: "Administration",
  userInitials: "AU",
  userLabel: "Administrator",
  sections: [
    { label: "Overview", items: [{ label: "Admin Dashboard", path: "/", icon: FiGrid }] },
    { label: "Account Management", items: [
      { label: "User Accounts", path: "/users", icon: FiUsers },
      { label: "MAO Accounts", path: "/mao-accounts", icon: FiBriefcase },
    ]},
    { label: "System", items: [
      { label: "Audit Logs", path: "/activity", icon: FiFileText },
      { label: "System Monitoring", path: "/monitoring", icon: FiActivity },
      { label: "Security", path: "/security", icon: FiShield },
      { label: "Backup & Recovery", path: "/backups", icon: FiDatabase },
      { label: "System Settings", path: "/settings", icon: FiSettings },
    ]},
  ],
};
