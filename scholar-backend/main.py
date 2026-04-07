from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF
import requests
import json

app = FastAPI()

# Make sure this CORS block is here so React doesn't get blocked
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/scan")
async def scan_resume(file: UploadFile = File(...)):
    # 1. Read the PDF file in memory
    content = await file.read()
    
    text = ""
    try:
        with fitz.open(stream=content, filetype="pdf") as doc:
            for page in doc:
                text += page.get_text()
    except Exception as e:
        return [{"type": "bad", "text": "Could not read the PDF file."}]
            
    # 2. Craft the prompt for Ollama
    # We restrict it to JSON format so the frontend doesn't break
    prompt = f"""
    Analyze this resume text for a student applying for internships.
    Provide exactly 4 points of feedback (mix of positive and negative).
    Return ONLY a JSON array of objects. Each object must have 'type' (either 'good' or 'bad') and 'text' (the feedback string).
    
    Resume Text: {text[:3000]}
    """
    
    # 3. Call your local Ollama AI
    try:
        res = requests.post("http://localhost:11434/api/generate", json={
            "model": "llama3", # change to phi3 if you downloaded that instead
            "prompt": prompt,
            "format": "json",
            "stream": False
        })
        
        data = res.json()
        feedback_array = json.loads(data['response'])
        return feedback_array
        
    except Exception as e:
        print(e)
        return [{"type": "bad", "text": "Failed to connect to local AI. Is Ollama running?"}]


OLLAMA_URL = "http://localhost:11434/api/generate"

@app.post("/scan")
async def scan_resume(file: UploadFile = File(...)):
    # 1. Check if it's a PDF
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported right now.")

    # 2. Extract text using PyMuPDF (fitz)
    try:
        content = await file.read()
        doc = fitz.open(stream=content, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
    except Exception as e:
        print("PDF Error:", e)
        raise HTTPException(status_code=500, detail="Failed to read the PDF file.")

    # 3. Send the text to Ollama
    # We strictly tell it to return a JSON array so your React map() function doesn't crash again
    prompt = f"""
    You are an expert tech recruiter. Review the following resume text. Provide exactly 3 concise, actionable bullet points of constructive feedback to improve it.
    You MUST return ONLY a raw JSON array of strings. Do not use markdown blocks like ```json.
    Example format: ["Feedback 1", "Feedback 2", "Feedback 3"]
    
    Resume text:
    {text[:3000]} 
    """

    try:
        response = requests.post(OLLAMA_URL, json={
            "model": "llama3", 
            "prompt": prompt,
            "stream": False
        })
        response.raise_for_status()
        
        # Get the raw text from Ollama
        result_text = response.json().get("response", "")
        
        # BULLETPROOF JSON EXTRACTION: Find the first '[' and last ']'
        start_idx = result_text.find('[')
        end_idx = result_text.rfind(']')

        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            # Slices out only the array part, ignoring the AI's yapping
            json_str = result_text[start_idx : end_idx + 1]
            suggestions = json.loads(json_str)
        else:
            # Fallback: If Llama3 completely failed to make an array, just wrap its raw text in a list so React doesn't crash
            print("AI failed to return an array. Raw output:", result_text)
            suggestions = [result_text.strip()]

        return {"suggestions": suggestions}

    except Exception as e:
        print("Ollama Error:", e)
        raise HTTPException(status_code=500, detail="AI processing failed. Check backend terminal")