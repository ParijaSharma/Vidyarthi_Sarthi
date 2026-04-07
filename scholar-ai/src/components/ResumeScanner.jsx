import React, { useState } from 'react';

const ResumeScanner = () => {
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = async () => {
    if (!file) return;
    setIsLoading(true);
    
    // Pack the file into FormData so FastAPI can read it
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Make the request to your local FastAPI server
      const response = await fetch('http://localhost:8000/scan', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server crashed or isn't running. Status: ${response.status}`);
      }

      const data = await response.json();
      
      // LOG THE DATA so we know exactly wtv the AI is spitting out
      console.log("Raw FastAPI response:", data);
      
      // Update the state safely
      setFeedback(data.suggestions || data); 
      
    } catch (error) {
      console.error("Error scanning resume:", error);
      // Give yourself a visual error on the screen if the backend fails
      setFeedback([`Backend Error: ${error.message}. Is your FastAPI server running?`]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">AI Resume Scanner</h2>
      
      {/* Upload Section */}
      <div className="mb-8 flex gap-4 items-center">
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])}
          className="file-input file-input-bordered w-full max-w-xs text-gray-900 bg-white border-gray-300"
        />
        <button 
          onClick={handleScan}
          disabled={isLoading || !file}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Scanning...' : 'Scan Resume'}
        </button>
      </div>

      {/* Feedback Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Feedback:</h3>

        {isLoading ? (
          <p className="text-gray-600 font-medium">AI is analyzing your resume, hold up gng...</p>
        ) : Array.isArray(feedback) && feedback.length > 0 ? (
          // If it's a valid array, map it safely with light theme styling
          <div className="space-y-4">
            {feedback.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-800">{item}</p>
              </div>
            ))}
          </div>
        ) : feedback && typeof feedback === 'object' && !Array.isArray(feedback) ? (
          // Safety catch: If backend sent an object instead of an array
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-800">
            <p className="font-bold mb-1">Yo, check the console.</p>
            <p>The AI returned an object, not an array. If your backend sends `{"{"} suggestions: [...] {"}"}`, you need to update your state with `setFeedback(data.suggestions)` instead of just `setFeedback(data)`.</p>
          </div>
        ) : (
          // Default empty state
          <p className="text-gray-500">Upload a resume and hit scan to get AI feedback.</p>
        )}
      </div>
    </div>
  );
};

export default ResumeScanner;