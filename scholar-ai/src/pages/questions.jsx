import { useState } from "react";
import QuestionForm from "../components/QuestionForm";
import { data } from "react-router-dom";
import { PiStudent } from "react-icons/pi";
//import { useNavigate } from "react-router-dom";
export default function Questions({onComplete}) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    // const navigate = useNavigate();

   const questions = [
    {
        id: "academic_level",
        question: "What is your current academic level?",
        options: ["Class 9–10", "Class 11–12", "Undergraduate", "Postgraduate"],
        description: "Determines basic eligibility for school vs. college schemes."
    },
    {
        id: "stream",
        question: "What is your primary field of study?",
        options: ["Science (PCM/PCB)", "Commerce", "Arts/Humanities", "Engineering/Tech", "Medical/Healthcare", "Management"],
    },
    {
        id: "performance",
        question: "What was your score in the last qualifying exam?",
        options: ["Above 90%", "80% – 90%", "70% – 80%", "Below 70%"],
    },
    {
        id: "income", 
        question: "What is your annual family income?",
        options: ["Below ₹2.5 Lakhs", "₹2.5 – 6 Lakhs", "Above ₹6 Lakhs"],
        hint: "Many Government scholarships have a ₹2.5L cutoff."
    },
    {
        id: "special_category", 
        question: "Do you belong to any of these categories?",
        options: ["Single Girl Child", "Minority Community", "Specially Abled (PwD)", "Wards of Armed Forces", "None"],
        isMultiSelect: true 
    },
    {
        id: "aspiration", 
        question: "What is your career goal?",
        options: ["Research/PhD", "Study Abroad", "Civil Services", "Corporate/Tech", "Entrepreneurship"],
    }
    ];

    const handleNext = (value) => {
        const updatedAnswers = {
            ...answers,
            [questions[step].id]: value
        };
        setAnswers(updatedAnswers);

        if(step < questions.length - 1){
            setStep(step + 1);
        }else{
            console.log("All answers:", updatedAnswers);
            const userProfile = buildUserProfile(updatedAnswers);
            const userInput = buildUserInput(updatedAnswers);

            localStorage.setItem("user_profile", JSON.stringify(userProfile));
            localStorage.setItem("user_input", userInput);
            // localStorage.setItem("scholarship_answers", JSON.stringify(updatedAnswers));
            // localStorage.setItem("user_profile", JSON.stringify(userProfile));
            fetch("http://localhost:5000/recommend", {
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
            localStorage.setItem("user_profile", JSON.stringify(userProfile));
            if (onComplete) {
                onComplete(data);
            }
            
        });
        }
    };

    const handleBack = () => {
        if(step > 0){
            setStep(step - 1);
        }
    };
    function buildUserProfile(answers) {
        return {
            level:
            answers.academic_level === "Undergraduate" ? "undergraduate" :
            answers.academic_level === "Postgraduate" ? "postgraduate" :
            "school",
            field:
            answers.stream.includes("Engineering") ? "engineering" :
            answers.stream.includes("Medical") ? "medical" :
            answers.stream.includes("Science") ? "science" :
            answers.stream.toLowerCase(),

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
    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-5xl font-bold
            bg-gradient-to-br from-[#0b1220] via-[#2b6959] to-[#214f3c]
            bg-clip-text text-transparent mb-4">
            Let’s personalize your <span className="text-yellow-500">scholarship</span> feed
            </h1>
            <p className="text-gray-500 mt-2">
            Answer 5 quick questions to discover scholarships curated just for you.
            </p>
            <QuestionForm 
                questionData={questions[step]}
                step={step}
                total={questions.length}
                onNext={handleNext }
                onBack={handleBack}
                savedAnswers={answers[questions[step].id]}
            />
                        
        </div>

    );
}