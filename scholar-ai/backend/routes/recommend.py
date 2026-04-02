from flask import Blueprint, request,jsonify
from utils.recommender import recommend

recommended_bp = Blueprint("recommend",__name__)
@recommended_bp.route("/recommend", methods=["POST"])
def get_recommendations():
    data = request.get_json()

    user_profile= data.get("user_profile")
    user_input = data.get("user_input")
    results = recommend(
        user_profile=user_profile,
        user_input=user_input
    )
    
    return jsonify(results)