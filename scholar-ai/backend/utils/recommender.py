from sklearn.metrics.pairwise import cosine_similarity
from utils.data_loader import load_data
from utils.model import build_model
import re
data = load_data()
vectorizer, X = build_model(data)


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

def extract_keywords(text):
    words = text.lower().split()
    
    keywords = [
        w for w in words
        if w not in ENGLISH_STOP_WORDS
        and w.isalpha()
        and len(w) > 2
    ]
    
    return list(set(keywords))

def extract_ease_score(s):
    score = 0
    eligibility = " ".join(s.get("eligibility", [])).lower()
    levels = [ lvl.lower() for lvl in s.get("level",[])]
    fields = [f.lower() for f in s.get("field",[])]
    gender = s.get("gender","").lower()

    if "any" in eligibility or "students pursuing" in eligibility:
        score+=2
    if "ug or pg" in eligibility or "students pursuing" in eligibility:
        score += 2
    if "class" in eligibility or "school" in eligibility:
        score += 2
    if len(levels) > 1:
        score += 1
    if "any" in fields:
        score += 1

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
    return "loan" in s.get("title","").lower() or "loan" in s.get("description", "").lower()

def get_high_reward(data,indices,top_n=5):
    filtered= [i for i in indices if not is_loan(data[i])]
    sorted_list = sorted(
        filtered,
        key=lambda i: extract_amount_score(data[i].get("award", "")),
        reverse=True
    )
    return sorted_list[:top_n]

def get_safe_options(data, indices, top_n=5):
    sorted_list = sorted(
        indices,
        key=lambda i: extract_ease_score(data[i]),
        reverse=True
    )
    return sorted_list[:top_n]

def format_eligibility(elig):
    if isinstance(elig, list):
        return ", ".join(elig[:2])   # take first 2 points
    elif isinstance(elig, str):
        return elig
    return "Check details"

def build_results(data, scores, indices,user_profile):
    return [
        {
            "title": data[i]["title"],
            "link": data[i]["link"],
            "score": float(scores[i]),
            "reason": generate_reason(data[i], user_profile),
            "award": data[i].get("award", "Not specified"),
            "eligibility": format_eligibility(data[i].get("eligibility")),
            "description": data[i].get("description", "")
        }
        for i in indices
    ]
    
def generate_reason(s, user_profile):
    reasons = []
    eligibility = " ".join(s.get("eligibility", [])).lower()

    fields = [f.lower() for f in s.get("field",[])]
    gender = s.get("gender","").lower()

    if user_profile.get("field") and user_profile["field"] in fields:
        reasons.append(f"matches your field ({user_profile['field']})")

    if gender != "any" and gender == user_profile.get("gender"):
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
    

def recommend(user_profile=None, user_input=None, top_n=5):

    if user_input is None and user_profile:
        user_input = f"{user_profile.get('gender','')} {user_profile.get('field','')} {user_profile.get('level','')} scholarship"
    if user_input is None:
        user_input = "scholarship"

    user_vec = vectorizer.transform([user_input])
    scores = cosine_similarity(user_vec,X)[0]
    
    filtered_indices = [];
    for i, s in enumerate(data):
        if user_profile:
    
            if user_profile.get("gender"):
                if s.get("gender", "").lower() not in [user_profile["gender"], "any"]:
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


    def profile_score(s,user):
        if not user :
            return 0
        score = 0 

        if user.get("field") in [f.lower() for f in s.get("field", [])]:
            score += 2

        if s.get("gender") == user.get("gender"):
            score += 1

        return score

    filtered_scores = []

    for i in filtered_indices:
        p = profile_score(data[i], user_profile)
        final = 0.7 * scores[i] + 0.3 * p
        filtered_scores.append((i, final))
    
    filtered_scores.sort(key=lambda x: x[1], reverse=True)
    
    sorted_indices = [i for i, _ in filtered_scores]

    best_indices = [i for i, _ in filtered_scores[:top_n]]
    high_reward_indices = get_high_reward(data, sorted_indices,top_n)
    safe_indices = get_safe_options(data, sorted_indices, top_n)
    print("Total data:", len(data))
    print("Filtered indices:", len(filtered_indices))
    return {
        "best_matches": build_results(data, scores, best_indices, user_profile),
        "high_reward": build_results(data, scores, high_reward_indices, user_profile),
        "safe_options": build_results(data, scores, safe_indices, user_profile)
    }

   
