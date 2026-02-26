import React from 'react';
// import  Sidebar from '../components/Sidebar';
// import  Topbar from '../components/Topbar';
import  StatCard from '../components/StatCard';
import ScholarshipSection from '../components/ScholarshipSection';
import { GraduationCap, FileText, Trophy, Clock } from "lucide-react";
import Questions from "./questions";
import { useState , useEffect} from "react";
// import { Outlet } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
export default function Dashboard() {
    //const [isPersonalized, setIsPersonalized] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    //const navigate = useNavigate();

    useEffect(() => {
    const savedProfile = localStorage.getItem("scholarship_answers");

        if(!savedProfile){
        //     navigate("/questions");
        // } else {
            setUserProfile(JSON.parse(savedProfile));
        }
    }, []);

    // const handlePersonalizationComplete = (ans) => {
    //     setUserProfile(ans);
    //     setIsPersonalized(true);
    // };

    return (
        <>
           
            {/* side bar */}
            {/* <div className="flex min-h-screen bg-gray-100 border-r border-gray-200">
            <Sidebar/>    
            </div> */}

            {/* searchbar and notifications */}
            {/* <div className='flex flex-col w-full'>
              <Topbar/> */}

                {!userProfile ? (
                    <Questions  onComplete={(profile) => setUserProfile(profile)} />
                ):(
                 <>
                    <h1 
                    className="text-3xl px-4 py-4 font-bold text-gray-800">
                        {userProfile 
                        ?`Welcome back!`
                        : "Welcome back, Sarah!"}
                    
                    </h1>
                    
                    <p className="text-gray-500 px-4 mt-1">
                        Showing scholarships for <b>{userProfile.stream}</b> students
                        aiming for <b>{userProfile.aspiration}</b>.
                    </p>

                {/* main informaton area */}
                <div className="grid grid-cols-4 gap-5 mt-5 ml-4 mr-4" >
                    <StatCard
                        title="Total Scholarships"
                        value="120"
                        icon={<GraduationCap size={22}/>}
                        color="bg-blue-600 text-white"
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
                        <ScholarshipSection userProfile={userProfile} />
                </div>
                 </>
                )}
                </>
    );
}