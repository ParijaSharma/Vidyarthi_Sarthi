import React, { useState, useEffect } from 'react';
import { X, Edit2, User, Check, GraduationCap, Briefcase } from 'lucide-react';

export default function ProfileModal({ onClose }) {
    const [answers, setAnswers] = useState({});
    const [profileType, setProfileType] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    
    // States for editing the main fields
    const [editField, setEditField] = useState('');
    const [editAspiration, setEditAspiration] = useState('');

    const [currentPath, setCurrentPath] = useState(
      localStorage.getItem("currentPath") || "Scholarships"
    );

    useEffect(() => {
        const internshipData = localStorage.getItem('internship_answers');
        const scholarshipData = localStorage.getItem('scholarship_answers');

        if (internshipData) {
            const parsed = JSON.parse(internshipData);
            setProfileType('Internship');
            setAnswers(parsed);
            setEditField(parsed.domain || '');
            setEditAspiration(parsed.stipend_expectations || '');
        } else if (scholarshipData) {
            const parsed = JSON.parse(scholarshipData);
            setProfileType('Scholarship');
            setAnswers(parsed);
            setEditField(parsed.stream || '');
            setEditAspiration(parsed.aspiration || '');
        }
    }, []);

    // Format keys like "academic_level" -> "Academic Level"
    const formatKey = (key) => {
        if (key === 'primary_goal') return null; // We already show the profile type at the top
        return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const renderValue = (val) => {
        if (Array.isArray(val)) return val.join(', ');
        return val || 'Not specified';
    };

    const handleSave = () => {
        // Update the answers object
        let updatedAnswers = { ...answers };
        
        if (profileType === 'Internship') {
            updatedAnswers.domain = editField;
            updatedAnswers.stipend_expectations = editAspiration;
            localStorage.setItem('internship_answers', JSON.stringify(updatedAnswers));
        } else {
            updatedAnswers.stream = editField;
            updatedAnswers.aspiration = editAspiration;
            localStorage.setItem('scholarship_answers', JSON.stringify(updatedAnswers));
            
            // Also update user_profile for the recommender payload
            const oldProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
            localStorage.setItem('user_profile', JSON.stringify({
                ...oldProfile,
                field: editField.toLowerCase(),
                aspiration: editAspiration.toLowerCase()
            }));
        }
        
        setAnswers(updatedAnswers);
        setIsEditing(false);
        // Force reload so dashboards update with new data nga
        window.location.reload();
    };
    const switchPath = (path) => {
    localStorage.setItem("currentPath", path);
    setCurrentPath(path);

    if (path === "Internships") {
        window.location.href = "/internship-dashboard";
    } else {
        window.location.href = "/dashboard";
    }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg text-white ${profileType === 'Internship' ? 'bg-indigo-600' : 'bg-yellow-500'}`}>
                            {profileType === 'Internship' ? <Briefcase size={20} /> : <GraduationCap size={20} />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{profileType} Track</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {!isEditing ? (
                            <button 
                                onClick={() => setIsEditing(true)} 
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition"
                            >
                                <Edit2 size={14} /> Edit
                            </button>
                        ) : (
                            <button 
                                onClick={handleSave} 
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-sm font-medium transition"
                            >
                                <Check size={14} /> Save
                            </button>
                        )}
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors ml-2">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Body Content - Scrollable */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {/*  Track Switch Toggle */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium mb-3 uppercase tracking-wider">
                        Switch Track
                    </p>

                    <div className="flex gap-3">
                        <button
                        onClick={() => switchPath("Scholarships")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all
                            ${currentPath === "Scholarships"
                            ? "bg-yellow-400 text-black shadow-md"
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                        <GraduationCap size={16} />
                        Scholarships
                        </button>

                        <button
                        onClick={() => switchPath("Internships")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all
                            ${currentPath === "Internships"
                            ? "bg-indigo-500 text-white shadow-md"
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                        <Briefcase size={16} />
                        Internships
                        </button>
                    </div>
                    </div>
                    
                    {isEditing && (
                        <div className="mb-8 p-5 bg-blue-50/50 rounded-xl border border-blue-100 space-y-4">
                            <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wider mb-2">Quick Edit</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {profileType === 'Internship' ? 'Primary Domain' : 'Field of Study / Stream'}
                                </label>
                                <input 
                                    type="text" 
                                    value={editField} 
                                    onChange={(e) => setEditField(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {profileType === 'Internship' ? 'Stipend Expectations' : 'Career Aspiration'}
                                </label>
                                <input 
                                    type="text" 
                                    value={editAspiration} 
                                    onChange={(e) => setEditAspiration(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                                />
                            </div>
                        </div>
                    )}

                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">All Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        {Object.entries(answers).map(([key, value]) => {
                            const formattedKey = formatKey(key);
                            if (!formattedKey) return null;
                            
                            // Highlight the fields that are being edited
                            const isEditedField = isEditing && (
                                (profileType === 'Internship' && (key === 'domain' || key === 'stipend_expectations')) ||
                                (profileType === 'Scholarship' && (key === 'stream' || key === 'aspiration'))
                            );

                            return (
                                <div key={key} className={`bg-gray-50 rounded-lg p-3 border ${isEditedField ? 'border-blue-300 bg-blue-50/30' : 'border-gray-100'}`}>
                                    <p className="text-xs text-gray-400 font-medium mb-1">{formattedKey}</p>
                                    <p className="text-sm text-gray-800 font-semibold">
                                        {isEditedField ? (key === 'domain' || key === 'stream' ? editField : editAspiration) : renderValue(value)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}