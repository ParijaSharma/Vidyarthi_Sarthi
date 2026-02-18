import {

  LayoutDashboard,
  User,
  FileText,
  Bell,
  Settings,
  GraduationCap,
  Sparkles
} from "lucide-react";

import React from "react";

export default function Sidebar() {
    return (
        <aside className="w-64 min-h-screen bg-white shadow-lg p-6">
            
            {/* LOGO AREA */}
            <div className="flex items-center gap-3 mb-8 border-b w-full pb-3">
                <div className="w-10 h-10 rounded-xl 
                                bg-gradient-to-br from-yellow-300 to-yellow-500
                                flex items-center justify-center shadow-md">
                    <GraduationCap className="text-white" size={20}/>
                </div>

                <div>
                    <h1 className="text-lg font-bold">Vidyarthi Sarthi</h1>
                    <p className="text-xs text-gray-400">Student Portal</p>
                </div>
            </div>

            <nav className="space-y-3">
                <SidebarItem icon={<LayoutDashboard size={18}/>} label="Overview" />
                <SidebarItem icon={<User size={18}/>} label="Profile" />    
                <SidebarItem icon={<Sparkles size={18}/>} label="AI chat" />    
                <SidebarItem icon={<FileText size={18}/>} label="Applications" />
                <SidebarItem icon={<Bell size={18}/>} label="Notifications" />
                <SidebarItem icon={<Settings size={18}/>} label="Settings" />
                <SidebarItem icon={<GraduationCap size={18}/>} label="Scholarships" />
            </nav>
            
        </aside>
    );
}
function SidebarItem({icon,label}) {
    return (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl 
               text-gray-500 cursor-pointer
               hover:bg-yellow-50 hover:text-yellow-600
               transition-all duration-200">
            {icon}
            <span className="font-medium">{label}</span>
        </div>
    );
    
}