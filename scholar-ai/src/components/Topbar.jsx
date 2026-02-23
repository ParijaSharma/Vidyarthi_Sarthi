
import {
  Bell,
  Search
} from "lucide-react";
export default function Topbar() {
    return (
        <header className="w-full h-18 flex items-center justify-between px-6 border-b border-gray-300 bg-white">
            <div className="relative w-2/3 mt-3 mb-5">
            <Search className="absolute left-4 top-3 text-gray-400" size={18}/>
            <input
            type="text"
            placeholder="Search Category and Skills"
            className="w-full pl-10 py-3 rounded-xl border 
                     focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
            <div className="flex items-center gap-4 ml-6">
                <div>
                <Bell size={50} className="text-gray-800 cursor-pointer hover:text-gray-900 transition border-r py-3" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </div>

            <div className="flex items-center gap-3">
            <div className="text-right">
                <p className="text-sm font-medium">Sarah Johnson</p>
                <p className="text-xs text-gray-400">Premium Member</p>
            </div>

            <div className="w-10 h-10 rounded-full bg-teal-500 
                            text-white flex items-center justify-center font-semibold">
                SJ
            </div>
            </div>
            </div>
        </header>
    )
}


      