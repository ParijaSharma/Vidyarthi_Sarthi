import { Bell, Search, Menu } from "lucide-react";

export default function Topbar({ toggleSidebar }) {
    return (
        <header className="w-full h-20 flex items-center justify-between px-6 border-b border-gray-200 bg-white shrink-0">
            
            {/* Left Side: Menu Toggle & Search */}
            <div className="flex items-center gap-4 flex-1">
                <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
                    <Menu size={24} />
                </button>
                
                <div className="relative w-full max-w-md">
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

                {/* Vertical Divider */}
                <div className="h-8 w-px bg-gray-200"></div>

                {/* Profile */}
                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-gray-800">Sarah Johnson</p>
                        <p className="text-xs text-gray-500">Premium Member</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-semibold shadow-md">
                        SJ
                    </div>
                </div>
            </div>
        </header>
    )
}