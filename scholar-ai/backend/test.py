from utils.recommender import recommend

# Sample user profile (simulate your frontend)
user_profile = {
    "level": "undergraduate",
    "field": "engineering",
    "gender": "any",
    "location_pref": "india",
    "priority": "money"
}

results = recommend(user_profile=user_profile)

print("\n=== BEST MATCHES ===")
for r in results["best_matches"]:
    print(r)

print("\n=== HIGH REWARD ===")
for r in results["high_reward"]:
    print(r)

print("\n=== SAFE OPTIONS ===")
for r in results["safe_options"]:
    print(r)