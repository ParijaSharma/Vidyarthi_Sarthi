import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import ScholarshipSection from '../components/ScholarshipSection';
import { GraduationCap, FileText, Trophy, Clock } from "lucide-react";

export default function Dashboard() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen w-full bg-gray-50 text-gray-900 overflow-hidden">

            {/* Sidebar controlled by state */}
            <Sidebar isOpen={isSidebarOpen} />    

            {/* Right Side Content Container */}
            <div className='flex flex-col flex-1 min-w-0'>
                <Topbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

                {/* ONLY THIS PART SCROLLS NOW */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold">Welcome back, Sarah!</h1>
                            <p className="text-gray-500 text-sm mt-1">Here's what's happening with your scholarships today.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10" >
                            <StatCard
                                title="Total Scholarships"
                                value="120"
                                icon={<GraduationCap size={22}/>}
                                color="bg-indigo-600 text-white"
                            />
                            <StatCard
                                title="Applications Submitted"
                                value="45"
                                icon={<FileText size={22}/>}
                                color="bg-emerald-600 text-white"
                            />
                            <StatCard
                                title="Scholarships Won"
                                value="10"
                                icon={<Trophy size={22}/>}
                                color="bg-amber-500 text-white"
                            />
                            <StatCard
                                title="Pending Applications"
                                value="5"
                                icon={<Clock size={22}/>}
                                color="bg-rose-500 text-white"
                            />
                        </div>
                        
                        <div>
                            <ScholarshipSection/>
                        </div>

                    </div>
                </main>
            </div>

        </div>
    );
}