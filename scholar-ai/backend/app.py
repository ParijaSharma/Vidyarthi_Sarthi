from flask import Flask
from flask_cors import CORS
from routes.recommend import recommended_bp
from routes.bookmark import bookmark_bp
from routes.auth import auth_bp
from routes.ocr import ocr_bp
from pydantic import BaseModel
import requests
app = Flask(__name__)
class ChatMessage(BaseModel):
    message: str

# 2. Add the actual route
@app.post("/api/chat")
async def chat_with_ai(req: ChatMessage):
    try:
        # We bounce the request over to your local Ollama server
        response = requests.post("http://localhost:11434/api/generate", json={
            "model": "mistral", # Make sure this matches what you downloaded!
            "prompt": req.message,
            "stream": False # Set to True later if you want typewriter effects
        })
        
        response_data = response.json()
        
        # Send the AI's response back to React
        return {"reply": response_data.get("response", "Error: AI got confused bro.")}
        
    except Exception as e:
        return {"reply": f"Ollama is dead, gng. Did you run 'ollama run mistral'? Error: {str(e)}"}
# Explicitly allow your Vite frontend and required headers
CORS(app, 
     supports_credentials=True, 
     origins=["http://localhost:5173"], 
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
     allow_headers=["Content-Type", "Authorization"])

# Registered blueprints
app.register_blueprint(bookmark_bp, url_prefix="/api/bookmark")
app.register_blueprint(recommended_bp, url_prefix="/api")
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(ocr_bp, url_prefix="/api/ocr")

if __name__ == "__main__":
    app.run(debug=True)