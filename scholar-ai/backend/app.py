from flask import Flask
from flask_cors import CORS
from routes.recommend import recommended_bp
from routes.bookmark import bookmark_bp
from routes.auth import auth_bp
from routes.ocr import ocr_bp
app = Flask(__name__)

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