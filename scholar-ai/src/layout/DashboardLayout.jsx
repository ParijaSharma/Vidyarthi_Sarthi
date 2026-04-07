import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="ml-64 flex flex-col flex-1">

        {/* Fixed Navbar */}
        <div className="h-16 flex-shrink-0 bg-white border-b z-10">
          <Topbar />
        </div>

        {/* Scroll ONLY this */}
        <div className="flex-1 overflow-y-auto p-1">
          <Outlet />
        </div>

      </div>
    </div>
  );
}