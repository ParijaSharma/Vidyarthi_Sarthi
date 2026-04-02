import React, { use } from 'react';
import  StatCard from '../components/StatCard';
import ScholarshipSection from '../components/ScholarshipSection';
import { GraduationCap, FileText, Trophy, Clock } from "lucide-react";
import Questions from "./questions";
import { useState , useEffect} from "react";

export default function Dashboard() {
    //const [isPersonalized, setIsPersonalized] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [userInput, setUserInput] = useState("");
    useEffect(() => {
        const savedProfile = localStorage.getItem("user_profile");
        const savedInput = localStorage.getItem("user_input");
        if(savedProfile){
            setUserProfile(JSON.parse(savedProfile));
        }    
        if(savedInput){
            setUserInput(savedInput);
        }           
    }, []);

    // useEffect(() => {
    //     const savedProfile = localStorage.getItem("user_profile");
    //     if(savedProfile){
    //         setUserProfile(JSON.parse(savedProfile));
    //     }
    // }, []);

    useEffect(() => {
        if(userProfile){
            fetch("http://localhost:5000/recommend", {
                method: "POST",
                headers: {  "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_profile: userProfile,
                    user_input : userInput
                }),
            })
            .then(res => res.json())
            .then(data => setRecommendations(data))
            .catch(err => console.error("Error fetching recommendations:", err));
            }
        },[userProfile]);

    return (
        <>
     
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
                        <ScholarshipSection 
                        data={recommendations}
                        userProfile={userProfile} 
                        />
                </div>
                 </>
                )}
                </>
    );
}