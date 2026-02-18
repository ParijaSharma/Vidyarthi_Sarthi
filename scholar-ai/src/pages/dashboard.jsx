import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import  Sidebar from '../components/Sidebar';
import  Topbar from '../components/Topbar';
import  StatCard from '../components/StatCard';
import ScholarshipSection from '../components/ScholarshipSection';
import { GraduationCap, FileText, Trophy, Clock } from "lucide-react";

export default function Dashboard() {
    return (
        <div className='flex min-h-screen bg-gray-100'>

            {/* side bar */}
            <div className="flex min-h-screen bg-gray-100 border-r border-gray-200">
            <Sidebar/>    
            </div>

            {/* searchbar and notifications */}
            <div className='flex flex-col'>
              <Topbar/>

            {/* welcome heading */}
            <div className="mt-6 px-6">
                <h1 className="text-3xl font-bold text-gray-800">Welcome back, Sarah!</h1>
                <p className="text-gray-500 text-sm">Here's what's happening with your scholarships today.</p>
            </div>

            {/* main informaton area */}
            <div className="grid grid-cols-4 gap-5 mt-5 ml-4 mr-4" >
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
              <div className="mt-10 px-6">
                    <ScholarshipSection/>
                </div>
              </div>

        </div>

        
    );
}