import { useState } from "react";
import {ArrowLeft, Microscope, Globe, Landmark, Briefcase, Rocket } from "lucide-react";
import { useEffect } from "react";
export default function QuestionForm({ questionData, step, total, onNext,onBack,savedAnswers }) {
    const [selected, setSelected] = useState(savedAnswers || null);
        useEffect(() => {
        setSelected(savedAnswers || null);
        }, [savedAnswers]);
        
        if (!questionData) {
            return null;
        }
    return (
        <div className=" flex flex-col bg-white rounded-2xl shadow-md p-6 mt-8 w-3/4 ">
            {/* Top section */}
            <div className=" flex justify-between text-sm text-gray-400 mb-4">
                <button
                onClick={onBack}
                disabled={step === 0}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
                >
                <ArrowLeft size={18} />
                Back
                </button>
                <span>
                    Step {step + 1} of {total}
                </span>
            </div>
            
            {/* Question */}
            <h2 className="text-xl font-semibold text-gray-800 mb-5">
                {questionData.question}
            </h2>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
                {questionData.options.map((option, index) => {
                   const iconMap = {
                    academic_level: [Microscope, Globe, Landmark, Briefcase],
                    stream: [Microscope, Landmark, Globe, Briefcase, Rocket, Microscope],
                    performance: [Rocket, Briefcase, Globe, Landmark],
                    income: [Landmark, Briefcase, Globe],
                    special_category: [Rocket, Globe, Landmark, Briefcase, Microscope],
                    aspiration: [Microscope, Globe, Landmark, Briefcase, Rocket],
                };
                const icons = iconMap[questionData.id] || [];
                const IconComponent = icons[index % icons.length] || Rocket;
                    return (
                        <button
                            key={index}
                            onClick={()=> setSelected(option)}
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl border transition-all duration-200
                            ${
                                selected === option
                                ? "bg-indigo-600 text-white border-indigo-600 scale-[1.02]"
                                : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                            }`}
                            >
                            <IconComponent size={20} />
                            {option}
                        </button>
                    );
            })}
            </div>

            {/* Continue Button */}
            <button
            disabled={!selected}
            onClick={() => onNext(selected)}
            className={`mt-8 w-full py-3 rounded-xl font-medium transition-all
            ${
                selected
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
            Save & Continue →
        </button>
        </div>
    );
}