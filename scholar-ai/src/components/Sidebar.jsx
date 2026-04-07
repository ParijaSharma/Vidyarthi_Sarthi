import React from "react";
import {
  LayoutDashboard,
  User,
  FileText,
  Bell,
  Settings,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 px-4 py-4 fixed left-0 top-0 shadow-sm">

      {/* LOGO */}
      <div className="flex items-center gap-3 mb-6 border-b pb-5">
        <div className="w-10 h-10 rounded-xl 
                        bg-gradient-to-br from-yellow-300 to-yellow-500
                        flex items-center justify-center shadow-md">
          <GraduationCap className="text-white" size={20} />
        </div>

        <div>
          <h1 className="text-lg font-bold">Vidyarthi Sarthi</h1>
          <p className="text-xs text-gray-400">Student Portal</p>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="space-y-2.5">

        <SidebarItem
          icon={<LayoutDashboard size={18} />}
          label="Overview"
          path="/dashboard"
        />

        <SidebarItem
          icon={<User size={18} />}
          label="Profile"
          path="/dashboard/profile"
        />

        <SidebarItem
          icon={<Sparkles size={18} />}
          label="AI chat"
          path="/dashboard/chat"
        />

        <SidebarItem
          icon={<FileText size={18} />}
          label="Applications"
          path="/dashboard/applications"
        />

        <SidebarItem
          icon={<Bell size={18} />}
          label="Notifications"
          path="/dashboard/notifications"
        />

        <SidebarItem
          icon={<Settings size={18} />}
          label="Settings"
          path="/dashboard/settings"
        />

        <SidebarItem
          icon={<GraduationCap size={18} />}
          label="Scholarships"
          path="/dashboard/saved"
        />

      </nav>
    </aside>
  );
}

function SidebarItem({ icon, label, path }) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300
        ${
          isActive
            ? "bg-yellow-400 text-black shadow-md"
            : "text-gray-600 hover:bg-yellow-100 hover:text-black"
        }`
      }
    >
      {icon}
      <span className="font-medium">{label}</span>
    </NavLink>
  );
}