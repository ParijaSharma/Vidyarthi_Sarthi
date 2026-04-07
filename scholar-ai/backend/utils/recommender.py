from sklearn.metrics.pairwise import cosine_similarity
from utils.data_loader import load_data
from utils.model import build_model
import re
import random
import math
data = load_data()
vectorizer, X = build_model(data)


# ---------------------- HELPERS ----------------------

def extract_amount_score(text):
    if not text:
        return 0
    text = text.lower().replace(",", "").replace("₹", "")
    numbers = re.findall(r"\d+", text)
    if not numbers:
        return 0

    amount = int(numbers[0])

    if "lakh" in text:
        return amount * 100000
    elif "crore" in text:
        return amount * 10000000
    elif "thousand" in text:
        return amount * 1000

    return amount


def extract_ease_score(s):
    score = 0
    eligibility = " ".join(s.get("eligibility", [])).lower()
    levels = [lvl.lower() for lvl in s.get("level", [])]
    fields = [f.lower() for f in s.get("field", [])]
    gender = s.get("gender", "").lower()

    # Easy conditions
    if "any" in eligibility or "students pursuing" in eligibility:
        score += 2
    if "ug or pg" in eligibility or "students pursuing" in eligibility:
        score += 2
    if "class" in eligibility or "school" in eligibility:
        score += 2
    if len(levels) > 1:
        score += 1
    if "any" in fields:
        score += 1

    # Hard conditions
    if "90%" in eligibility or "85%" in eligibility or "merit" in eligibility:
        score -= 2
    if "income" in eligibility or "below" in eligibility:
        score -= 1
    if "phd" in levels or "research" in eligibility:
        score -= 2
    if len(fields) == 1 and "any" not in fields:
        score -= 1
    if gender != "any":
        score -= 1

    return score


def is_loan(s):
    return "loan" in s.get("title", "").lower() or "loan" in s.get("description", "").lower()


def get_high_reward(data, indices, top_n=5):
    filtered = [i for i in indices if not is_loan(data[i])]
    return sorted(
        filtered,
        key=lambda i: extract_amount_score(data[i].get("award", "")),
        reverse=True
    )[:top_n]


def get_safe_options(data, indices, top_n=5):
    return sorted(
        indices,
        key=lambda i: extract_ease_score(data[i]),
        reverse=True
    )[:top_n]


def format_eligibility(elig):
    if isinstance(elig, list):
        return ", ".join(elig[:2])
    elif isinstance(elig, str):
        return elig
    return "Check details"


# ---------------------- REASON GENERATOR ----------------------

def generate_reason(s, user_profile):
    if not user_profile:
        return "Recommended for you"
    reasons = []

    fields = [f.lower() for f in s.get("field", [])]
    gender = s.get("gender", "").lower()

    if user_profile.get("field") and user_profile["field"] in fields:
        reasons.append(f"matches your field ({user_profile['field']})")

    if gender != "any" and gender == user_profile.get("gender", "").lower():
        reasons.append("eligible based on your gender")

    if user_profile.get("location_pref") == "india" and s.get("location") in ["india", "any"]:
        reasons.append("available in India")

    amount = extract_amount_score(s.get("award", ""))

    if amount >= 100000:
        reasons.append("high reward scholarship")
    elif amount >= 20000:
        reasons.append("good financial support")

    ease = extract_ease_score(s)

    if ease >= 3:
        reasons.append("easy eligibility")
    elif ease <= -1:
        reasons.append("competitive selection")

    if not reasons:
        return "Recommended based on your profile"

    return " + ".join(reasons[:2]).capitalize()


# ---------------------- BUILD RESULTS ----------------------

def format_title(title):
    if not title:
        return ""

    acronyms = {"drdo", "iit", "ai", "ml", "ugc", "csir", "icmr", "cfees","jncasr"}

    words = title.split()
    formatted = []

    for w in words:
        if w.lower() in acronyms:
            formatted.append(w.upper())
        else:
            formatted.append(w.capitalize())

    return " ".join(formatted)

def build_results(data, score_map, indices, user_profile):
    return [
        {
            "title": format_title(data[i]["title"]),
            "link": data[i]["link"],
            "score": round(score_map.get(i, 0), 1),
            "reason": generate_reason(data[i], user_profile),
            "award": data[i].get("award", "Not specified"),
            "eligibility": format_eligibility(data[i].get("eligibility")),
            "description": data[i].get("description", "")
        }
        for i in indices
    ]


# ---------------------- MAIN FUNCTION ----------------------

def recommend(user_profile=None, user_input=None, top_n=5, page=1,limit=10,filter_type="live"):
    user_profile = user_profile or {}
    # -------- Input --------
    if user_input is None and user_profile:
        user_input = f"{user_profile.get('gender','')} {user_profile.get('field','')} {user_profile.get('level','')} scholarship"
    if user_input is None:
        user_input = "scholarship"

    user_vec = vectorizer.transform([user_input])
    scores = cosine_similarity(user_vec, X)[0]

    # -------- Filtering --------
    filtered_indices = []

    for i, s in enumerate(data):
        if user_profile:

            if filter_type == "live":
                if not s.get("isLive", False):
                    continue

            elif filter_type == "upcoming":
                if not s.get("isUpcoming", False):
                    continue

            elif filter_type == "always":
    
                if s.get("isUpcoming", False):
                    continue
                                    
            if user_profile.get("gender"):
                if s.get("gender", "").lower() not in [user_profile["gender"].lower(), "any"]:
                    continue

            if user_profile.get("location_pref") == "india":
                if s.get("location", "").lower() not in ["india", "any"]:
                    continue

            if user_profile.get("level"):
                if user_profile["level"] not in [lvl.lower() for lvl in s.get("level", [])]:
                    continue

            if user_profile.get("field"):
                if "any" not in [f.lower() for f in s.get("field", [])]:
                    if user_profile["field"] not in [f.lower() for f in s.get("field", [])]:
                        continue

        filtered_indices.append(i)

    # -------- Profile Score --------
    def profile_score(s, user):
        if not user:
            return 0

        score = 0

        if user.get("field") and user.get("field") in [f.lower() for f in s.get("field", [])]:
            score += 2

        if s.get("gender", "").lower() == user.get("gender", "").lower():
            score += 1

        return score

    # -------- Scoring --------
    filtered_scores = []

    for i in filtered_indices:
        p = profile_score(data[i], user_profile)

        amount = extract_amount_score(data[i].get("award", ""))
        amount_score = min(amount / 100000, 1)

        ease_raw = extract_ease_score(data[i])
        ease_score = max(min(ease_raw / 5, 1), -1)

        final = (
            0.6 * scores[i] +
            0.2 * p +
            0.1 * ease_score +
            0.1 * amount_score
        )

        # Boosts
        if p >= 2:
            final += 0.05

        if amount > 200000:
            final += 0.05

        # Small randomness (diversity)
        final += random.uniform(0, 0.01)

        # Cap score
        final = min(final, 1.5)

        filtered_scores.append((i, final))

    # -------- Edge Case --------
    if not filtered_scores:
        return {
            "best_matches": [],
            "high_reward": [],
            "safe_options": []
        }

    # -------- Sorting --------
    filtered_scores.sort(key=lambda x: x[1], reverse=True)

    sorted_indices = [i for i, _ in filtered_scores]
    best_indices = sorted_indices[:top_n]

    high_reward_indices = get_high_reward(data, sorted_indices, top_n)
    safe_indices = get_safe_options(data, sorted_indices, top_n)

    # -------- Normalization --------

    values = [score for _, score in filtered_scores]
    min_v = min(values)
    max_v = max(values)

    normalized_map = {}

    for i, score in filtered_scores:
        if max_v == min_v:
            norm = 60
        else:
            scaled = (score - min_v) / (max_v - min_v)
            norm = 40 + (scaled * 55)   # range → 40 to 95
            if scaled > 0.8:
                norm += 3
        normalized_map[i] = round(norm, 1)
    # -------- Return --------
    return {
        "best_matches": build_results(data, normalized_map, best_indices, user_profile),
        "high_reward": build_results(data, normalized_map, high_reward_indices, user_profile),
        "safe_options": build_results(data, normalized_map, safe_indices, user_profile)
    }