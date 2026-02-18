import { GraduationCap, FileText, Trophy, Clock } from "lucide-react";

import React from "react";
export default function StatCard({title,value,color,icon}) {
    return(
        <div className={`bg-white p-6 rounded-2xl shadow-md min-h-[110px] flex items-center `}>
            <div className="flex items-center justify-between w-full">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}