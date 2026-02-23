import { useState } from "react";
import QuestionForm from "../components/QuestionForm";
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
            localStorage.setItem("scholarship_answers", JSON.stringify(updatedAnswers));
            if (onComplete) {
                onComplete(updatedAnswers);
            }
            // navigate("/dashboard");
        }
    };
    const handleBack = () => {
        if(step > 0){
            setStep(step - 1);
        }
    };
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