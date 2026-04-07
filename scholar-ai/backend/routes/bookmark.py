from flask import Blueprint, request, jsonify
bookmark_bp = Blueprint("bookmark", __name__)

bookmarks = []

@bookmark_bp.route("/save", methods=["POST"])
def save_scholarship():
    data = request.json
    title = data.get("title")

    # prevent duplicates
    exists = any(b["title"] == title for b in bookmarks)

    if exists:
        return jsonify({"message": "Already saved"}), 200

    bookmarks.append(data)
    return jsonify({"message": "Saved successfully"}), 200

@bookmark_bp.route("/all", methods=["GET"])
def get_all_bookmarks():
    return jsonify(bookmarks), 200