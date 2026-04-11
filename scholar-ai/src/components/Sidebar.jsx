import { LayoutDashboard, Settings, GraduationCap, Sparkles, Briefcase, ChevronLeft, ChevronRight, Bookmark } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen, toggleSidebar, isDark }) {
    const location = useLocation();
    
    // Check user type from local storage
    const hasScholarship = localStorage.getItem("scholarship_answers");
    const hasInternship = localStorage.getItem("internship_answers");
    const isInternshipUser = hasInternship && !hasScholarship;

    // Dynamic theme classes bro
    const bgClass = isDark ? "bg-[#0b1220]/50 backdrop-blur-xl border-white/10" : "bg-white border-gray-200";
    const textMainClass = isDark ? "text-white" : "text-gray-900";
    const textSubClass = isDark ? "text-white/50" : "text-gray-500";
    const borderClass = isDark ? "border-white/10" : "border-gray-200";

    return (
        <aside className={`${isOpen ? 'w-64' : 'w-20'} h-screen ${bgClass} border-r flex flex-col transition-all duration-300 shrink-0 shadow-lg z-20 relative`}>
            
            <div className={`flex items-center h-20 gap-3 px-5 border-b ${borderClass} shrink-0 justify-between`}>
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="min-w-[40px] h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-md shrink-0">
                        <GraduationCap className="text-white" size={20}/>
                    </div>
                    {isOpen && (
                        <div className="overflow-hidden whitespace-nowrap">
                            <h1 className={`text-lg font-bold ${textMainClass} leading-tight`}>Vidyarthi Sarthi</h1>
                            <p className={`text-xs ${textSubClass}`}>Student Portal</p>
                        </div>
                    )}
                </div>
                
                {/* Close Button inside the sidebar */}
                {isOpen && toggleSidebar && (
                   <button onClick={toggleSidebar} className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-white/10 text-white/70' : 'hover:bg-gray-100 text-gray-500'} transition-colors shrink-0`}>
                       <ChevronLeft size={20} />
                   </button>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 no-scrollbar">
                {isInternshipUser ? (
                    <SidebarItem icon={<Briefcase size={20}/>} label="Internships" path="/internship-dashboard" isOpen={isOpen} isActive={location.pathname === '/internship-dashboard'} isDark={isDark} />
                ) : (
                    <SidebarItem icon={<LayoutDashboard size={20}/>} label="Scholarships" path="/dashboard" isOpen={isOpen} isActive={location.pathname === '/dashboard'} isDark={isDark} />
                )}
                
                <SidebarItem icon={<Sparkles size={20}/>} label="AI chat" path="/chat" isOpen={isOpen} isActive={location.pathname === '/chat'} isDark={isDark} />    
                <SidebarItem icon={<Settings size={20}/>} label="Settings" path="#" isOpen={isOpen} isDark={isDark} />
                <SidebarItem icon={<Bookmark size={20}/>} label= "Bookmarks" path="/dashboard/bookmarks" isOpen={isOpen} isActive={location.pathname === '/bookmarks'} isDark={isDark} />
            </nav>

            {/* Open button at bottom when closed */}
            {!isOpen && toggleSidebar && (
                <div className={`p-4 border-t ${borderClass} flex justify-center`}>
                    <button onClick={toggleSidebar} className={`p-2 rounded-xl ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} transition-colors`}>
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
            
        </aside>
    );
}

function SidebarItem({icon, label, path, isOpen, isActive, isDark}) {
    let activeClass = "";
    let inactiveClass = "";

    // Adapting the hover and active states for both light and dark modes
    if (isDark) {
        activeClass = "bg-white/15 text-yellow-400 font-medium shadow-[0_0_10px_rgba(250,204,21,0.1)]";
        inactiveClass = "text-white/50 hover:bg-white/5 hover:text-white/90";
    } else {
        activeClass = "bg-yellow-50 text-yellow-600 font-medium";
        inactiveClass = "text-gray-500 hover:bg-gray-50 hover:text-gray-900";
    }

    return (
        <Link to={path} className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 ${!isOpen && 'justify-center'} ${isActive ? activeClass : inactiveClass}`} title={!isOpen ? label : ''}>
            {icon}
            {isOpen && <span className="whitespace-nowrap">{label}</span>}
        </Link>
    );
}