import React, { useState, useEffect } from 'react';
import { Bell, Search, Menu, LogOut, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileModal from './ProfileModal';

export default function Topbar({ toggleSidebar }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    
    // New states for dynamic user info
    const [userName, setUserName] = useState("Guest User");
    const [userEmail, setUserEmail] = useState("guest@example.com");
    const [initials, setInitials] = useState("GU");

    const navigate = useNavigate();

    // Fetch user info when the Topbar loads
    useEffect(() => {
        // Grab wtv name and email your backend sent during login
        const storedName = localStorage.getItem("userName");
        const storedEmail = localStorage.getItem("userEmail");

        if (storedName) {
            setUserName(storedName);
            
            // Calculate initials (e.g., "Naivedya" -> "N", "Naivedya S" -> "NS")
            const nameParts = storedName.trim().split(" ");
            const init = nameParts.length > 1 
                ? nameParts[0][0] + nameParts[nameParts.length - 1][0] 
                : nameParts[0][0];
            setInitials(init.toUpperCase());
        }
        if (storedEmail) {
            setUserEmail(storedEmail);
        }
    }, []);

    const handleLogout = () => {
        // Clear EVERYTHING so the next nga doesn't see old data
        localStorage.clear(); 
        navigate('/');
    };

    return (
        <>
        <header className="w-full h-20 flex items-center justify-between px-6 border-b border-gray-200 bg-white shrink-0 relative z-30">
            {/* Left Side: Menu Toggle & Search */}
            <div className="flex items-center gap-4 flex-1">
                <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
                    <Menu size={24} />
                </button>
                
                <div className="relative w-full max-w-md hidden sm:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                    <input
                        type="text"
                        placeholder="Search Category and Skills"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors"
                    />
                </div>
            </div>

            {/* Right Side: Notifications, Profile */}
            <div className="flex items-center gap-6">

                {/* Notifications */}
                <div className="relative flex items-center justify-center">
                    <Bell size={24} className="text-gray-600 cursor-pointer hover:text-gray-900 transition" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </div>

                <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

                {/* Profile Section */}
                <div className="relative">
                    <div 
                        className="flex items-center gap-3 cursor-pointer select-none group"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                        {/* DYNAMIC NAME AND EMAIL HERE */}
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-medium text-gray-800 group-hover:text-yellow-600 transition-colors">
                                {userName}
                            </p>
                            <p className="text-xs text-gray-500 max-w-[120px] truncate">
                                {userEmail}
                            </p>
                        </div>
                        {/* DYNAMIC INITIALS HERE */}
                        <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-semibold shadow-md group-hover:ring-2 group-hover:ring-offset-2 group-hover:ring-teal-500 transition-all">
                            {initials}
                        </div>
                    </div>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 overflow-hidden z-50">
                            <button 
                                onClick={() => {
                                    setIsProfileModalOpen(true);
                                    setIsProfileOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <User size={16} /> My Profile
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <Settings size={16} /> Account Settings
                            </button>
                            <div className="h-px bg-gray-100 my-1"></div>
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>

        {isProfileModalOpen && (
            <ProfileModal onClose={() => setIsProfileModalOpen(false)} />
        )}
        </>
    )
}