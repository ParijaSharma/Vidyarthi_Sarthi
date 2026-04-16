from sklearn.metrics.pairwise import cosine_similarity
from utils.data_loader import load_data
from utils.model import build_model
import re
import random
import math
data = load_data()
vectorizer, X = build_model(data)

SYNONYMS = {
    "postgraduate": ["pg", "masters", "mtech", "msc", "mba", "ma", "mcom"],
    "undergraduate": ["ug", "btech", "be", "bsc", "bba", "ba", "bcom", "mbbs"],
    "phd": ["research", "doctoral", "fellowship", "jrf", "srf"],
    "school": ["class 10", "class 12", "ssc", "hsc", "secondary", "intermediate"],
    "pwd": ["disabled", "specially abled", "handicapped", "divyangjan"],
    "engineering": ["btech", "be", "mtech", "technical", "it"],
    "medical": ["mbbs", "bds", "ayush", "nursing", "pharmacy"]
}

def diversify_results(indices, data, top_n):
    selected = []
    seen_types = set()

    for i in indices:
        s = data[i]

        tags = []

        # classify
        if "phd" in str(s.get("level", "")).lower():
            tags.append("phd")

        if extract_amount_score(s.get("award", "")) > 100000:
            tags.append("high_reward")

        if extract_ease_score(s) > 2:
            tags.append("easy")

        if any(word in str(s.get("eligibility", "")).lower() for word in ["pwd","disabled"]):
            tags.append("pwd")

        # ensure diversity
        if any(tag not in seen_types for tag in tags):
            selected.append(i)
            seen_types.update(tags)

        if len(selected) >= top_n:
            break

    # fallback fill
    if len(selected) < top_n:
        for i in indices:
            if i not in selected:
                selected.append(i)
            if len(selected) >= top_n:
                break

    return selected

def match_with_synonyms(user_val, data_options):
    if not user_val or not data_options:
        return False

    user_val = user_val.lower().strip()
    # If the scholarship is open to everyone
    if "any" in [opt.lower() for opt in data_options]:
        return True

    # Standardize common variations (e.g., B.Tech -> btech)
    user_val_clean = re.sub(r'[^a-z0-9]', '', user_val)

    for opt in data_options:
        opt_clean = re.sub(r'[^a-z0-9]', '', opt.lower())
        
        # 1. Direct or Substring Match (e.g., "btech" in "btech engineering")
        if user_val_clean in opt_clean or opt_clean in user_val_clean:
            return True

        # 2. Synonym lookup
        for category, keywords in SYNONYMS.items():
            if user_val_clean == category or user_val_clean in keywords:
                if any(k in opt_clean for k in keywords) or category in opt_clean:
                    return True
    return False
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

    if match_with_synonyms(user_profile.get("field"), fields):
        reasons.append(f"matches your field ({user_profile['field']})")

    if gender != "any" and gender == user_profile.get("gender", "").lower():
        reasons.append("eligible based on your gender")

    if user_profile.get("location_pref") == "india" and s.get("location") in ["india", "any"]:
        reasons.append("available in India")

    if match_with_synonyms(user_profile.get("aspiration"), [s.get("description","").lower()]):
            reasons.append("supports your research/phd goal")

    if match_with_synonyms(user_profile.get("categories"), [str(s.get("eligibility","")).lower()]):
            reasons.append("eligible under your category")
           
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
def normalize(x):
    return x.lower().strip() if isinstance(x, str) else x

def recommend(user_profile=None, user_input=None, top_n=5, page=1,limit=10,filter_type="live"):
    user_profile = {k: normalize(v) for k, v in (user_profile or {}).items()}
    # -------- Input --------
    if user_input is None and user_profile:
        user_input = user_input = f"""
        {user_profile.get('field','')}
        {user_profile.get('level','')}
        {user_profile.get('aspiration','')}
        {user_profile.get('categories','')}
        scholarship
        """
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
                if not s.get("isAlways", False):
                    continue
                                               

        filtered_indices.append(i)

    # -------- Profile Score --------
    def profile_score(s, user):
        if not user: return 0
        score = 0
        
        # Field Matching
        fields = [f.lower() for f in s.get("field", [])]
        if match_with_synonyms(user.get("field"), fields):
            # Give more points for a SPECIFIC match than a GENERAL "Any" match
            score += 4 if "any" not in fields else 2

        # Level Matching
        levels = [l.lower() for l in s.get("level", [])]
        if match_with_synonyms(user.get("level"), levels):
            score += 3

        # Gender Check (Crucial for Women-only scholarships)
        user_gender = user.get("gender", "").lower()
        scholarship_gender = s.get("gender", "any").lower()
        if scholarship_gender != "any":
            if user_gender == scholarship_gender:
                score += 5  # High priority because these are very specific
            else:
                score -= 10 # Hard penalty if gender doesn't match

        return score

    # -------- Scoring --------
    filtered_scores = []

    for i in filtered_indices:
        p = profile_score(data[i], user_profile)
        p=min(p/10,1)
        amount = extract_amount_score(data[i].get("award", ""))
        amount_score = min(amount / 100000, 1)

        ease_raw = extract_ease_score(data[i])
        ease_score = max(min(ease_raw / 5, 1), -1)

        final = (
            0.4 * scores[i] +
            0.4 * p +
            0.1 * ease_score +
            0.1 * amount_score
        )

        # Boosts
        if p >= 0.5:
            final += 0.05
       

        if amount > 200000:
            final += 0.05

        # Small randomness (diversity)
        final += random.uniform(0, 0.002)

        # Cap score
        final = min(final, 1.5)

        filtered_scores.append((i, final))

    # -------- Edge Case --------
    if not filtered_scores:
        filtered_scores = [(i, scores[i]) for i in range(len(data))]

    # -------- Sorting --------
    filtered_scores.sort(key=lambda x: x[1], reverse=True)

    sorted_indices = [i for i, _ in filtered_scores]
    best_indices = diversify_results(sorted_indices, data, top_n)

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