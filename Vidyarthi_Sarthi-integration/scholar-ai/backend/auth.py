from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from pymongo import MongoClient
import uuid

auth_bp = Blueprint("auth", __name__)
bcrypt = Bcrypt()

client = MongoClient("mongodb://localhost:27017/")
db = client["scholarship_ocr"]
users = db["users"]

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json

    email = data.get("email")
    password = data.get("password")
    name = data.get("fullName")

    if users.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    user_id = str(uuid.uuid4())
    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")

    users.insert_one({
        "user_id": user_id,
        "name": name,
        "email": email,
        "password": hashed_pw
    })

    return jsonify({"message": "User registered successfully"})

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    user = users.find_one({"email": email})

    if not user or not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=user["user_id"])

    return jsonify({
        "token": token,
        "user_id": user["user_id"]
    })