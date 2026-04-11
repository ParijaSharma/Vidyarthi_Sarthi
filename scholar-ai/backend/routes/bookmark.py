from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId

# DO THIS NOW:
from db import db 

bookmark_bp = Blueprint('bookmark', __name__)

# ==========================================
# 1. FETCH ALL BOOKMARKS FOR A USER
# Matches your frontend: fetch("http://localhost:5000/api/bookmark/all/demo_user")
# ==========================================
@bookmark_bp.route('/all/<user_id>', methods=['GET'])
def get_bookmarks(user_id):
    try:
        # Find all bookmarks where user_id matches
        bookmarks = list(db.bookmarks.find({"user_id": user_id}))
        
        # MongoDB returns _id as an ObjectId object, we gotta convert it to a string for JSON
        for bookmark in bookmarks:
            bookmark['_id'] = str(bookmark['_id'])
            
        return jsonify(bookmarks), 200
    except Exception as e:
        print(f"Error fetching bookmarks: {e}")
        return jsonify({"error": "Failed to fetch bookmarks"}), 500


# ==========================================
# 2. SAVE/ADD A BOOKMARK
# You'll need this to actually save them in the first place, nga.
# ==========================================
@bookmark_bp.route('/add', methods=['POST'])
def add_bookmark():
    try:
        data = request.json
        
        # Basic validation
        if not data.get('title') or not data.get('user_id'):
            return jsonify({"error": "Missing required fields"}), 400

        # Create the document
        new_bookmark = {
            "user_id": data.get("user_id"),
            "title": data.get("title"),
            "award": data.get("award", "Not specified"),
            "eligibility": data.get("eligibility", "Not specified"),
            "apply_link": data.get("apply_link", "")
        }
        
        # Insert into DB
        result = db.bookmarks.insert_one(new_bookmark)
        
        # Return success with the new ID
        return jsonify({"message": "Bookmark saved", "_id": str(result.inserted_id)}), 201

    except Exception as e:
        print(f"Error saving bookmark: {e}")
        return jsonify({"error": "Failed to save bookmark"}), 500


# ==========================================
# 3. DELETE A BOOKMARK
# Matches your frontend: fetch(`http://localhost:5000/api/bookmark/delete/${id}`)
# ==========================================
@bookmark_bp.route('/delete/<bookmark_id>', methods=['DELETE'])
def delete_bookmark(bookmark_id):
    try:
        # Delete by the specific MongoDB ObjectId
        result = db.bookmarks.delete_one({"_id": ObjectId(bookmark_id)})
        
        if result.deleted_count == 0:
            return jsonify({"error": "Bookmark not found"}), 404
            
        return jsonify({"message": "Bookmark deleted successfully"}), 200
        
    except Exception as e:
        print(f"Error deleting bookmark: {e}")
        return jsonify({"error": "Failed to delete bookmark"}), 500