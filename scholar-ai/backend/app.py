from flask import Flask
from routes.recommend import recommended_bp
from routes.bookmark import bookmark_bp
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "http://localhost:5174"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

app.register_blueprint(recommended_bp, url_prefix="/api")
app.register_blueprint(bookmark_bp, url_prefix="/api/bookmark")
if __name__ == "__main__":
    app.run(debug=True)