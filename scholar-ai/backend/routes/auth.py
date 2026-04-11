from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId

auth_bp = Blueprint('auth', __name__)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["vidyarthi_sarthi"]
users = db["users"]

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    
    # Check if user already exists
    if users.find_one({"email": data.get("email")}):
        return jsonify({"error": "Email already exists bro"}), 400

    hashed_password = generate_password_hash(data.get("password"))
    
    new_user = {
        "fullName": data.get("fullName", ""),
        "email": data.get("email"),
        "password": hashed_password,
        "pincode": data.get("pincode", ""),
        "city": data.get("city", ""),
        "state": data.get("state", ""),
        "education": data.get("education", ""),
        "needsSetup": True,  # True because it's their first time
        "userPath": None,
        "preferences": {}
    }
    
    result = users.insert_one(new_user)
    # Also returning fullName and email here just to be safe during registration
    return jsonify({
        "message": "User registered", 
        "userId": str(result.inserted_id), 
        "fullName": data.get("fullName", ""),
        "email": data.get("email", ""),
        "needsSetup": True
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = users.find_one({"email": data.get("email")})
    
    if not user or not check_password_hash(user["password"], data.get("password")):
        return jsonify({"error": "Invalid credentials"}), 401
        
    return jsonify({
        "message": "Login successful", 
        "userId": str(user["_id"]),
        "fullName": user.get("fullName", "Guest User"), # <--- FIXED: Now sending the name
        "email": user.get("email", ""),                 # <--- FIXED: Now sending the email
        "needsSetup": user.get("needsSetup", True),
        "userPath": user.get("userPath"),
        "preferences": user.get("preferences", {})
    }), 200

@auth_bp.route('/save-preferences', methods=['POST'])
def save_preferences():
    data = request.json
    user_id = data.get("userId")
    
    if not user_id:
        return jsonify({"error": "Missing userId"}), 400
        
    users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {
            "needsSetup": False,  # They answered the questions now
            "userPath": data.get("userPath"),
            "preferences": data.get("answers")
        }}
    )
    return jsonify({"message": "Preferences saved"}), 200