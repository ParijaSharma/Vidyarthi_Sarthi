import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import  Sidebar from '../components/Sidebar';
// import  Topbar from '../components/Topbar';
// import  StatCard from '../components/StatCard';
export default function Dashboard() {
    return (
        <div className='flex min-h-screen bg-gray-100'>

            {/* side bar */}
            <div className="flex min-h-screen bg-gray-100">
            <Sidebar/>    
            </div>

            {/* searchbar and notifications */}
            <div className='flex-1 p-6'>
              {/* <Topbar/> */}
          
            {/* main informaton area */}
            <div className="grid grid-cols-4 gap-6 mt-6">
                {/* <StatCard title="Total Scholarships" value="120" icon="fa-solid fa-graduation-cap" />
                <StatCard title="Applications Submitted" value="45" icon="fa-solid fa-file-alt" />
                <StatCard title="Scholarships Won" value="10" icon="fa-solid fa-trophy" />
                <StatCard title="Pending Applications" value="5" icon="fa-solid fa-hourglass-half" /> */}
            </div>
              </div>
        </div>

        
    );
}