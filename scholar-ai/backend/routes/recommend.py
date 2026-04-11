from flask import Blueprint, request,jsonify
from utils.recommender import recommend

recommended_bp = Blueprint("recommend",__name__)
@recommended_bp.route("/recommend", methods=["GET", "POST"])
def get_recommendations():
    try:
        if request.method == "POST":
            data = request.get_json(silent=True) or {}

            user_profile = data.get("user_profile")
            user_input = data.get("user_input")
            filter_type = data.get("type", "live")
            page = data.get("page", 1)
            limit = data.get("limit", 5)

            import json
            if isinstance(user_profile, str):
                try:
                    user_profile = json.loads(user_profile)
                except:
                    user_profile = {}

        else:
            user_profile = None
            user_input = None
            filter_type = request.args.get("type", "live")
            page = int(request.args.get("page", 1))
            limit = int(request.args.get("limit", 5))

        results = recommend(
            user_profile=user_profile,
            user_input=user_input,
            page=page,
            limit=limit,
            filter_type=filter_type
        )

        return jsonify(results)

    except Exception as e:
        print(" ERROR IN /recommend:", str(e))
        return jsonify({"error": str(e)}), 500