from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List
import fitz  # PyMuPDF for reading PDFs
import json
import os

# 1. Initialize the App
app = FastAPI()

# 2. Fix CORS so React can actually talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# INTERNSHIP RECOMMENDER API (REAL JSON DATA)
# ---------------------------------------------------------

# Define what the incoming data from React looks like
class InternshipProfile(BaseModel):
    academic_status: str = None
    domain: str = None
    work_mode: str = None
    availability: str = None
    stipend_expectations: str = None

# Helper function to load your JSON database
def load_internships():
    # Make sure your internships.json is inside a folder named 'data'
    path = os.path.join("data", "internships.json")
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

@app.post("/api/internships/recommend")
async def recommend_internships(profile: InternshipProfile):
    all_internships = load_internships()
    scored_results = []

    # If the JSON file is missing, send a fallback so the app doesn't crash
    if not all_internships:
        return {"best_matches": [], "high_reward": [], "safe_options": []}

    for item in all_internships:
        score = 0
        reasons = []

        # 1. Domain/Category Match (Heavy Weight)
        if profile.domain and profile.domain.lower() in item.get('category', '').lower():
            score += 50
            reasons.append(f"Strong match for {profile.domain}.")
        
        # 2. Academic Year Match (Medium Weight)
        # If the internship says "Any", it's a match for everyone
        min_year = item.get('min_year', '')
        if min_year == "Any" or (profile.academic_status and profile.academic_status.lower() == min_year.lower()):
            score += 30
            reasons.append("Perfect for your academic year.")

        # 3. Work Mode / Location Match (Light Weight)
        if profile.work_mode:
            user_mode = profile.work_mode.lower()
            job_loc = item.get('location', '').lower()
            if user_mode == "any" or user_mode in job_loc or job_loc == "hybrid":
                score += 20
                reasons.append(f"Fits your {profile.work_mode} preference.")

        # Only keep internships if they score at least a 30 (Filters out total mismatches)
        if score >= 30:
            # Combine the reasons into one nice string
            final_reason = " ".join(reasons) if reasons else f"Good match for {item.get('category')}."
            
            scored_results.append({
                "title": item.get('title'),
                "award": item.get('stipend'),
                "eligibility": item.get('min_year'),
                "reason": final_reason,
                "score": float(score),
                "link": item.get('link', '#')
            })

    # Sort the array by highest score first
    scored_results.sort(key=lambda x: x['score'], reverse=True)

    # Split into categories exactly like Parija's dashboard expects
    return {
        "best_matches": [s for s in scored_results if s['score'] >= 80],
        "high_reward": [s for s in scored_results if 50 <= s['score'] < 80],
        "safe_options": [s for s in scored_results if 30 <= s['score'] < 50]
    }


# ---------------------------------------------------------
# RESUME SCANNER API
# ---------------------------------------------------------

@app.post("/scan")
async def scan_resume(file: UploadFile = File(...)):
    try:
        # Read the file the user uploaded
        file_bytes = await file.read()
        
        text = ""
        # If it's a PDF, extract the text using PyMuPDF
        if file.filename.endswith(".pdf"):
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page in doc:
                text += page.get_text()
        else:
            text = "Could not parse file. Please upload a PDF."

        # Check if the resume is empty
        if len(text.strip()) == 0:
            return {"suggestions": ["Bro, this PDF is completely empty or just images. The ATS scanners won't be able to read this!"]}

        # ---------------------------------------------------------
        # Mock feedback based on text length (Replace with real AI later)
        # ---------------------------------------------------------
        mock_feedback = [
            "🟢 ATS Check: PDF text extracted successfully.",
            f"📄 Word Count: Your resume has about {len(text.split())} words.",
            "💡 Action Verb Check: Try starting more bullet points with strong verbs like 'Engineered', 'Designed', or 'Led'.",
            "📊 Metrics Check: We noticed a lack of numbers. Quantify your achievements (e.g., 'improved speed by 20%').",
            "🔗 Link Check: Ensure your GitHub and LinkedIn URLs are clickable and up to date."
        ]
        
        return {"suggestions": mock_feedback}

    except Exception as e:
        # If anything breaks, tell React exactly what happened safely
        return {"suggestions": [f"Backend Error: Something went wrong processing the file -> {str(e)}"]}