import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      <Sidebar />

      <div className="flex flex-col w-full">
        <Topbar />
        <div className="">
          <Outlet />
        </div>
      </div>

    </div>
  );
}