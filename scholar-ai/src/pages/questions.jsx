import { useState } from "react";
import QuestionForm from "../components/QuestionForm";
import { useNavigate } from "react-router-dom";

export default function Questions({onComplete}) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [userPath, setUserPath] = useState(null); 
    const navigate = useNavigate();

    const scholarshipQuestions = [
        { id: "academic_level", question: "What is your current academic level?", options: ["Class 9–10", "Class 11–12", "Undergraduate", "Postgraduate"], description: "Determines basic eligibility for school vs. college schemes." },
        { id: "stream", question: "What is your primary field of study?", options: ["Science (PCM/PCB)", "Commerce", "Arts/Humanities", "Engineering/Tech", "Medical/Healthcare", "Management"] },
        { id: "performance", question: "What was your score in the last qualifying exam?", options: ["Above 90%", "80% – 90%", "70% – 80%", "Below 70%"] },
        { id: "income", question: "What is your annual family income?", options: ["Below ₹2.5 Lakhs", "₹2.5 – 6 Lakhs", "Above ₹6 Lakhs"], hint: "Many Government scholarships have a ₹2.5L cutoff." },
        { id: "special_category", question: "Do you belong to any of these categories?", options: ["Single Girl Child", "Minority Community", "Specially Abled (PwD)", "Wards of Armed Forces", "None"], isMultiSelect: true },
        { id: "aspiration", question: "What is your career goal?", options: ["Research/PhD", "Study Abroad", "Civil Services", "Corporate/Tech", "Entrepreneurship"] }
    ];

    const internshipQuestions = [
        { id: "academic_status", question: "What is your current academic status?", options: ["1st/2nd Year", "Pre-final Year", "Final Year", "Recent Graduate"], description: "Helps match you with early-talent or pre-placement offers." },
        { id: "domain", question: "What is your primary domain of interest?", options: ["Software Development", "Data Science & AI", "UI/UX Design", "Marketing & Sales", "Finance", "Product Management"] },
        { id: "work_mode", question: "What is your preferred work mode?", options: ["Remote", "In-Office", "Hybrid", "Any"] },
        { id: "availability", question: "How soon can you join?", options: ["Immediately", "Within 1 Month", "Next Semester", "Summer Break"], hint: "Companies usually look for immediate joiners for live projects." },
        { id: "stipend_expectations", question: "What are your stipend expectations?", options: ["Paid Only", "Unpaid is fine (for learning)", "Performance Based", "Looking for PPO"] }
    ];

    const initialQuestion = {
        id: "primary_goal",
        question: "What are you primarily looking for?",
        options: ["Scholarships for Studies", "Internships"],
        description: "This helps us set up the right dashboard for you."
    };

    const activeQuestions = userPath === "Scholarships for Studies" 
        ? [initialQuestion, ...scholarshipQuestions] 
        : userPath === "Internships" 
            ? [initialQuestion, ...internshipQuestions]
            : [initialQuestion];

    function buildUserProfile(answers) {
        return {
            level:
            answers.academic_level === "Undergraduate" ? "undergraduate" :
            answers.academic_level === "Postgraduate" ? "postgraduate" :
            "school",
            field:
            answers.stream?.includes("Engineering") ? "engineering" :
            answers.stream?.includes("Medical") ? "medical" :
            answers.stream?.includes("Science") ? "science" :
            answers.stream?.toLowerCase(),

            performance: answers.performance === "Above 90%" ? "high" :
                         answers.performance === "80% – 90%" ? "medium" : "low",
            income: answers.income === "Below ₹2.5 Lakhs" ? "low" : 
                    answers.income === "₹2.5 – 6 Lakhs" ? "medium" : "high",
            categories: answers.special_category || [],
            aspiration: answers.aspiration?.toLowerCase(),    
            
            gender: "any",
            location_pref: "india",
            priority: "balanced"
        };
    }

    function buildUserInput(params) {
        return `
        ${answers.academic_level} student 
        studying ${answers.stream}, 
        aiming for ${answers.aspiration}, 
        with ${answers.performance} performance, 
        family income ${answers.income}, 
        looking for scholarships in India
        `;
    }

    const handleNext = async (value) => {
        const currentQ = activeQuestions[step];
        
        const updatedAnswers = {
            ...answers,
            [currentQ.id]: value
        };
        setAnswers(updatedAnswers);

        if (step === 0) {
            setUserPath(value);
            setStep(1); 
            return;
        }

        if (step < activeQuestions.length - 1) {
            setStep(step + 1);
        } else {
            console.log("All answers:", updatedAnswers);
            
            // Send the completed data to MongoDB using the userId we stored
            const userId = localStorage.getItem("userId");
            if (userId) {
                try {
                    await fetch("http://localhost:5000/api/auth/save-preferences", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            userId: userId,
                            userPath: userPath,
                            answers: updatedAnswers
                        })
                    });
                } catch(err) {
                    console.error("DB update failed bro:", err);
                }
            }
            
            if (userPath === "Internships") {
                localStorage.removeItem("scholarship_answers");
                localStorage.setItem("internship_answers", JSON.stringify(updatedAnswers));
                if (onComplete) onComplete(updatedAnswers);
                navigate("/internship-dashboard"); 
            } else {
                localStorage.removeItem("internship_answers"); 
                
                const userProfile = buildUserProfile(updatedAnswers);
                const userInput = buildUserInput(updatedAnswers);

                localStorage.setItem("user_profile", JSON.stringify(userProfile));
                localStorage.setItem("user_input", userInput);
                localStorage.setItem("scholarship_answers", JSON.stringify(updatedAnswers));

                fetch("http://localhost:5000/api/recommend",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        user_profile: userProfile,
                        user_input: userInput
                     })
                })
                .then(res => res.json())
                .then(data => {
                    console.log("Recommended scholarships:", data);
                    localStorage.setItem("recommended_scholarships", JSON.stringify(data));
                    
                    if (onComplete) {
                        onComplete(data);
                    }
                    navigate("/dashboard"); 
                })
                .catch(err => {
                    console.error("Backend error, but navigating anyway:", err);
                    navigate("/dashboard"); 
                });
            }
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const isInternship = userPath === "Internships";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-5xl font-bold
            bg-gradient-to-br from-[#0b1220] via-[#2b6959] to-[#214f3c]
            bg-clip-text text-transparent mb-4 text-center">
            Let’s personalize your <span className="text-yellow-500">{isInternship ? "internships" : "scholarships"}</span>
            </h1>
            <p className="text-gray-500 mt-2 text-center max-w-lg mb-8">
            Answer a few quick questions to discover opportunities curated just for you.
            </p>
            <QuestionForm 
                questionData={activeQuestions[step]}
                step={step}
                total={activeQuestions.length}
                onNext={handleNext}
                onBack={handleBack}
                savedAnswers={answers[activeQuestions[step]?.id]}
            />
        </div>
    );
}