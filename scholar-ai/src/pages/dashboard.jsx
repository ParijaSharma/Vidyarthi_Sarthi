import React, { useState, useEffect } from 'react';

import StatCard from '../components/StatCard';

import ScholarshipSection from '../components/ScholarshipSection';

import { GraduationCap, FileText, Bookmark, Clock, User } from "lucide-react";

import Questions from "./questions";

import { useNavigate } from "react-router-dom";



export default function Dashboard() {

    const [userProfile, setUserProfile] = useState(null);

    const [recommendations, setRecommendations] = useState(null);

    const [userInput, setUserInput] = useState("");

    const [filterType, setFilterType] = useState("live");

    const [savedCount, setSavedCount] = useState(0);



    const navigate = useNavigate();



    // 🔥 LOAD USER PROFILE

    useEffect(() => {

        const internshipProfile = localStorage.getItem("internship_answers");


        if (internshipProfile) {

            navigate("/internship-dashboard", { replace: true });

            return;

        }



        const savedProfile = localStorage.getItem("user_profile");

        const savedInput = localStorage.getItem("user_input");



        if (savedProfile) {

            setUserProfile(JSON.parse(savedProfile));

        }


        if (savedInput) {

            setUserInput(savedInput);

        }

    }, [navigate]);



    // 🔥 FETCH RECOMMENDATIONS

    useEffect(() => {

        if (userProfile) {

            console.log("Sending profile:", userProfile); // DEBUG



            fetch("http://localhost:5000/api/recommend", {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(userProfile)

            })

                .then(res => res.json())

                .then(data => {


                    setRecommendations(data);

                })

                .catch(err => console.error("Error fetching recommendations:", err));

        }

    }, [userProfile, filterType]);



    // 🔥 FETCH BOOKMARK COUNT (REAL-TIME FUNCTION)
    const fetchSavedCount = async () => {
        try {
            const userId = localStorage.getItem("userId"); // ✅ FIXED

            if (!userId) return;

            const res = await fetch(`http://localhost:5000/api/bookmark/all/${userId}`);
            const data = await res.json();

            if (Array.isArray(data)) {
                setSavedCount(data.length);
            } else if (data.bookmarks) {
                setSavedCount(data.bookmarks.length);
            }

        } catch (err) {
            console.error("Error fetching bookmarks:", err);
    //  FETCH BOOKMARK COUNT

    useEffect(() => {

        const userId = localStorage.getItem("user_id");



        if (userId) {

            fetch(`http://localhost:5000/api/bookmark/all/${userId}`)

                .then(res => res.json())

                .then(data => {

                    if (Array.isArray(data)) {

                        setSavedCount(data.length);

                    }

                })

                .catch(err => console.error(err));

        }

    };

    // 🔥 INITIAL LOAD
    useEffect(() => {
        fetchSavedCount();
    }, []);




   

    return (

        <>

            {!userProfile ? (

                <Questions onComplete={(profile) => {


                    localStorage.setItem("user_profile", JSON.stringify(profile));

                    setUserProfile(profile);

                }} />

            ) : (

                <div className="flex-1 bg-gray-50 min-h-screen">

                    <div className="max-w-7xl mx-auto px-6 py-6">


                        <h1 className="text-3xl px-4 py-4 font-bold text-gray-800">

                            <span className="flex items-center gap-2">

                                <User className="w-10 h-10 rounded-full p-2 text-white

                                    bg-gradient-to-br from-yellow-300 to-yellow-500

                                    flex items-center justify-center shadow-md"/>

                                Welcome back!

                            </span>

                        </h1>


                       

                        <p className="text-gray-500 mt-2">

                            Showing scholarships for <b>{userProfile.field}</b> students

                            aiming for <b>{userProfile.aspiration}</b>.

                        </p>

                        {/* 🔥 STAT CARDS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5 mx-4">


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

                                title="Saved Scholarships"

                                value={savedCount} // ✅ DYNAMIC

                                icon={<Bookmark size={22} />}

                                color="bg-amber-500 text-white"

                            />


                            <StatCard

                                title="Pending Applications"

                                value="5"

                                icon={<Clock size={22}/>}

                                color="bg-rose-500 text-white"

                            />


                        </div>

                        {/* 🔥 PASS REFRESH FUNCTION */}
                        <div className="mt-4 px-2">

                            <ScholarshipSection

                                data={recommendations}

                                userProfile={userProfile}

                                filterType={filterType}

                                setFilterType={setFilterType}

                                refreshSavedCount={fetchSavedCount} // 🔥 IMPORTANT
                            />

                        </div>


                    </div>

                </div>

            )}

        </>

    );

}