import React, { useState } from 'react';
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout() {
    // We bring in your state management so the hamburger menu actually works
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
            
            {/* Your dynamic sidebar now gets the correct props! */}
            <Sidebar 
                isOpen={isSidebarOpen} 
                toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
            />

            {/* Main Content Area (No more hardcoded ml-64!) */}
            <div className="flex flex-col flex-1 min-w-0">
                
                {/* Topbar gets the toggle function so the menu button works */}
                <Topbar 
                    toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
                />

                {/* Scroll ONLY the main content area */}
                <main className="flex-1 overflow-y-auto">
                    {/* This Outlet is where dashboard.jsx and chat.jsx render */}
                    <Outlet />
                </main>
                
            </div>
            
        </div>
    );
}