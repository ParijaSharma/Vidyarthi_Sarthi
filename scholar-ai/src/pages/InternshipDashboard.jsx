import React, { useState, useEffect } from 'react';

import Sidebar from '../components/Sidebar';

import Topbar from '../components/Topbar';

import StatCard from '../components/StatCard';

import ResumeScanner from '../components/ResumeScanner';

import InternshipSection from '../components/InternshipSection';

import { Briefcase, FileText, Trophy, Clock } from "lucide-react";

import { useNavigate } from "react-router-dom";



export default function InternshipDashboard() {

    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const [recommendations, setRecommendations] = useState(null);

    const navigate = useNavigate();



    useEffect(() => {

        // Kick out scholarship users

        const scholarshipProfile = localStorage.getItem("scholarship_answers");

        const internshipProfile = localStorage.getItem("internship_answers");

       

        if (scholarshipProfile && !internshipProfile) {

            navigate("/dashboard", { replace: true });

            return;

        }



        // Fetch Internship AI Data from your FastAPI backend

        if (internshipProfile) {

            const parsedProfile = JSON.parse(internshipProfile);

           

            fetch("http://localhost:8000/api/internships/recommend", {

                method: "POST",

                headers: { "Content-Type": "application/json" },

                body: JSON.stringify(parsedProfile)

            })

            .then(res => res.json())

            .then(data => {

                console.log("FastAPI Internship Data:", data);

                setRecommendations(data);

            })

            .catch(err => console.error("Error fetching internships:", err));

        }

    }, [navigate]);



    return (

        <div className="flex h-screen w-full bg-gray-50 text-gray-900 overflow-hidden">

            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />    



            <div className='flex flex-col flex-1 min-w-0'>

                <Topbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />



                <main className="flex-1 overflow-y-auto p-6 md:p-8">

                    <div className="max-w-7xl mx-auto">

                        <div className="mb-8">

                            <h1 className="text-3xl font-bold">Welcome back!</h1>

                            <p className="text-gray-500 text-sm mt-1">Here's what's happening with your internship hunt today.</p>

                        </div>



                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10" >

                            <StatCard title="Total Internships" value="340" icon={<Briefcase size={22}/>} color="bg-indigo-600 text-white" />

                            <StatCard title="Applications Sent" value="24" icon={<FileText size={22}/>} color="bg-emerald-600 text-white" />

                            <StatCard title="Offers Received" value="2" icon={<Trophy size={22}/>} color="bg-amber-500 text-white" />

                            <StatCard title="Pending Interviews" value="4" icon={<Clock size={22}/>} color="bg-rose-500 text-white" />

                        </div>

                       

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                           

                            {/* Left Side: Internships */}

                            <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">

                                <InternshipSection

                                    data={recommendations}

                                    userProfile={JSON.parse(localStorage.getItem("internship_answers") || "{}")}

                                />

                            </div>



                            {/* Right Side: Resume Scanner */}

                            <div className="lg:col-span-1 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">

                                <ResumeScanner />

                            </div>



                        </div>

                    </div>

                </main>

            </div>

        </div>

    );

}