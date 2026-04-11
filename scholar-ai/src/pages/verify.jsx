import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Verify() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const scholarship = state?.scholarship;

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState("");
  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setStep(2);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/ocr-upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      setStep(3);

      setTimeout(() => {
        setResult(data.eligible);   // from backend
        setReason(data.reason);     //  from backend
        setStep(4);
        setLoading(false);
      }, 800);

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">

      {/* 🔹 Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <span
          onClick={() => navigate("/dashboard")}
          className="hover:underline cursor-pointer"
        >
          Dashboard
        </span>
        <span>›</span>
        <span className="text-gray-700 font-medium">Verification</span>
      </div>

      {/* 🔹 Container */}
     <div className="max-w-3xl mx-auto">

        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-sm">

          {/* 🔹 Title */}
          <h2 className="text-2xl font-bold mb-1">
            {scholarship?.title}
          </h2>

          <p className="text-gray-500 mb-6">
            Verify your eligibility by uploading required documents
          </p>

          {/*  TIMELINE */}
          <div className="flex items-center justify-between mb-8">

            {[
              { id: 1, label: "Upload" },
              { id: 2, label: "OCR" },
              { id: 3, label: "Verify" },
              { id: 4, label: "Result" }
            ].map((item, index) => (

              <div key={item.id} className="flex items-center w-full">

                {/* Circle */}
                <div
                  className={`
                    w-8 h-8 flex items-center justify-center rounded-full text-xs font-semibold z-10
                    ${step > item.id
                      ? "bg-green-500 text-white"
                      : step === item.id
                      ? "bg-indigo-500 text-white animate-pulse"
                      : "bg-gray-200 text-gray-500"}
                  `}
                >
                  {step > item.id ? "✓" : item.id}
                </div>

                {/* Line */}
                {index !== 3 && (
                  <div
                    className={`flex-1 h-1 ${
                      step > item.id ? "bg-green-400" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/*  Status */}
          <p className="text-sm text-gray-500 mb-6">
            {step === 1 && "Upload your document to begin verification"}
            {step === 2 && "Processing document using OCR..."}
            {step === 3 && "Checking eligibility criteria..."}
            {step === 4 && "Verification complete"}
          </p>

          {/*  Required Docs */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Required Documents</h3>
            <ul className="text-gray-600 text-sm list-disc ml-5 space-y-1">
              <li>Income Certificate</li>
              <li>Aadhar Card</li>
            </ul>
          </div>

          {/*  UPLOAD BOX */}
          <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center mb-6 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50/40 transition cursor-pointer">

            <label className="cursor-pointer flex flex-col items-center justify-center">

              <span className="text-4xl mb-2">📄</span>

              <span className="text-indigo-600 font-semibold mb-1">
                Click to upload document
              </span>

              <span className="text-sm text-gray-500">
                JPG, PNG, PDF supported
              </span>

              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const selected = e.target.files[0];
                  setFile(selected);
                  setFileName(selected?.name || "");
                }}
              />

            </label>

            {fileName && (
              <div className="mt-3 text-sm text-gray-700 bg-white px-3 py-1 rounded-lg inline-block shadow-sm">
                📎 {fileName}
              </div>
            )}
          </div>

          {/* 🔹 BUTTON */}
          <button
            onClick={handleUpload}
            className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            {loading ? "Processing..." : "Upload & Verify"}
          </button>

          {/*  RESULT */}
          {result !== null && (
            <div
              className={`mt-6 p-4 rounded-xl text-center font-semibold border ${
                result
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {result
                ? "✅ You are eligible!"
                : "❌ Not eligible based on document"}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}