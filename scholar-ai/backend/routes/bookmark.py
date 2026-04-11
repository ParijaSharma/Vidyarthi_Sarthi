from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from db import db 

bookmark_bp = Blueprint('bookmark', __name__)

@bookmark_bp.route('/all/<user_id>', methods=['GET', 'OPTIONS'])
def get_bookmarks(user_id):
    if request.method == "OPTIONS":
        return jsonify({"message": "OK"}), 200

    print("USER ID RECEIVED:", user_id)

    try:
        bookmarks = list(db.bookmarks.find({"user_id": user_id}))

        for bookmark in bookmarks:
            bookmark['_id'] = str(bookmark['_id'])

        return jsonify(bookmarks), 200

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": "Failed"}), 500

@bookmark_bp.route('/add', methods=['POST', 'OPTIONS'])
def add_bookmark():

    # 🔥 HANDLE PREFLIGHT
    if request.method == "OPTIONS":
        return jsonify({"message": "Preflight OK"}), 200

    try:
        data = request.json
        print("DATA RECEIVED:", data)  # 🔥 DEBUG

        if not data.get('title') or not data.get('user_id'):
            return jsonify({"error": "Missing required fields"}), 400

        # 🔥 PREVENT DUPLICATES
        existing = db.bookmarks.find_one({
            "user_id": data.get("user_id"),
            "scholarship_id": data.get("scholarship_id")
        })

        if existing:
            return jsonify({"message": "Already saved"}), 200

        new_bookmark = {
            "user_id": data.get("user_id"),
            "scholarship_id": data.get("scholarship_id"),
            "title": data.get("title"),
            "amount": data.get("amount", "N/A"),
            "award": data.get("award", "Not specified"),
            "eligibility": data.get("eligibility", "Not specified"),
            "apply_link": data.get("apply_link", "")
        }

        result = db.bookmarks.insert_one(new_bookmark)

        return jsonify({
            "message": "Bookmark saved",
            "_id": str(result.inserted_id)
        }), 201

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": "Failed"}), 500

@bookmark_bp.route('/delete/<bookmark_id>', methods=['DELETE'])
def delete_bookmark(bookmark_id):
    try:
        result = db.bookmarks.delete_one({"_id": ObjectId(bookmark_id)})

        if result.deleted_count == 0:
            return jsonify({"error": "Not found"}), 404

        return jsonify({"message": "Deleted"}), 200

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": "Failed"}), 500