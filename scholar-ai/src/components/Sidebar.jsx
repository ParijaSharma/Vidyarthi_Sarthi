import {
  LayoutDashboard, User, FileText, Bell, Settings, GraduationCap, Sparkles
} from "lucide-react";
import React from "react";

export default function Sidebar({ isOpen }) {
    return (
        <aside className={`${isOpen ? 'w-64' : 'w-20'} h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shrink-0 shadow-lg`}>
            
            {/* LOGO AREA */}
            <div className="flex items-center h-20 gap-3 px-5 border-b border-gray-200 shrink-0">
                <div className="min-w-[40px] h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-md">
                    <GraduationCap className="text-white" size={20}/>
                </div>

                {isOpen && (
                    <div className="overflow-hidden whitespace-nowrap">
                        <h1 className="text-lg font-bold text-gray-900 leading-tight">Vidyarthi Sarthi</h1>
                        <p className="text-xs text-gray-500">Student Portal</p>
                    </div>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 no-scrollbar">
                <SidebarItem icon={<LayoutDashboard size={20}/>} label="Overview" isOpen={isOpen} />
                <SidebarItem icon={<User size={20}/>} label="Profile" isOpen={isOpen} />    
                <SidebarItem icon={<Sparkles size={20}/>} label="AI chat" isOpen={isOpen} />    
                <SidebarItem icon={<FileText size={20}/>} label="Applications" isOpen={isOpen} />
                <SidebarItem icon={<Bell size={20}/>} label="Notifications" isOpen={isOpen} />
                <SidebarItem icon={<Settings size={20}/>} label="Settings" isOpen={isOpen} />
                <SidebarItem icon={<GraduationCap size={20}/>} label="Scholarships" isOpen={isOpen} />
            </nav>
            
        </aside>
    );
}

function SidebarItem({icon, label, isOpen}) {
    return (
        <div className={`flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 cursor-pointer hover:bg-yellow-50 hover:text-yellow-600 transition-all duration-200 ${!isOpen && 'justify-center'}`} title={!isOpen ? label : ''}>
            {icon}
            {isOpen && <span className="font-medium whitespace-nowrap">{label}</span>}
        </div>
    );
}