from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS
from pydoc import text
import re
import requests
import json
import time

url = "https://api.buddy4study.com/api/v1.0/ssms/scholarship/"

headers = {
    "accept": "application/json",
    "content-type": "application/json",
    "origin": "https://www.buddy4study.com",
    "referer": "https://www.buddy4study.com/",
    "user-agent": "Mozilla/5.0",
    "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJyZWFkIiwid3JpdGUiLCJ0cnVzdCJdLCJleHAiOjE4MDAzNDYwMjMsImF1dGhvcml0aWVzIjpbIlVTRVIiXSwianRpIjoiN2JlNDJmMDUtMDg2Yi00MDM1LWJhNzYtOTRmMGRjYjQ0YTdjIiwiY2xpZW50X2lkIjoiYjRzIn0.va17Fw-LutOkDVJVjbY42wNJNxcshIGRFUAHBNW-BZI"
}

all_scholarships = []

modes = ["OPEN", "CLOSED", "ALWAYS_OPEN"]

def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    text = text.replace("m sc", "msc")
    text = text.replace("b tech", "btech")
    text = text.replace("puruing", "pursuing")
    return text.strip()

def get_high_reward(data,indices,top_n=5):
    sorted_list = sorted(
        indices,
        key=lambda i: data[i].get("award", ""),
        reverse=True
    )
    return sorted_list[:top_n]


def extract_features(text):
    text = text.lower() if text else ""

    levels = []

    if any(x in text for x in ["class 9", "class 10", "9th", "10th"]):
        levels.append("class_9_10")

    if any(x in text for x in ["class 11", "class 12", "11th", "12th"]):
        levels.append("class_11_12")

    if any(x in text for x in ["undergraduate", "ug", "bachelor", "bachelors", "b.sc", "btech", "b.e"]):
        levels.append("undergraduate")

    if any(x in text for x in [
    "postgraduate", "pg", "master", "masters",
    "m.sc", "msc", "mba", "mtech",
    "graduate degree", "graduation degree"
    ]):
        levels.append("postgraduate")

    if any(x in text for x in ["phd", "doctorate", "postdoc", "post-doctoral"]):
        levels.append("phd")
    
    if "class 1" in text and "pg" in text:
        levels = ["class_9_10", "class_11_12", "undergraduate", "postgraduate"]

    if not levels:
        levels=[]

    gender = "female" if any(x in text for x in ["girl", "girls", "women", "female"]) else "any"

    if any(x in text for x in [
    "abroad", "international", "overseas",
    "usa", "uk", "london", "singapore"
    ]):
        location = "abroad"
    elif "india" in text:
        location = "india"
    else:
        location = "any"

    field = []
    if any(x in text for x in ["stem", "science", "technology"]):
        field.append("STEM")

    if any(x in text for x in ["engineering", "btech", "mtech"]):
        field.append("Engineering")

    if any(x in text for x in ["medical", "mbbs", "bds", "health"]):
        field.append("Medical")

    if any(x in text for x in ["management", "mba", "business"]):
        field.append("Management")

    if not field:
        field.append("any")

    return list(set(levels)), gender, location, list(set(field))

for mode in modes:

    page = 0

    while True:

        payload = {
            "page": page,
            "length": 100,
            "rules": [],
            "mode": mode,
            "sortOrder": "DEADLINE"
        }

        response = requests.post(url, headers=headers, json=payload)

        try:
            data = response.json()
        except:
            print("Response not JSON:", response.text)
            break

        scholarships = data.get("scholarships", [])

        if not scholarships:
            break


        for s in scholarships:
            if not s.get("scholarshipMultilinguals"):
                continue

            info = s["scholarshipMultilinguals"][0]

            eligibility_text = clean_text(info.get("applicableFor", ""))
            text = f"{s.get("scholarshipName")} {eligibility_text} {info.get("purposeAward")}"
            levels , gender,location,field = extract_features(text)
            
            combined_text = f"""
            {text}
            {' '.join([l for l in levels if l != 'any'])}
            {' '.join([f for f in field if f != 'any'])}
            {location if location != 'any' else ''}
            """
            all_scholarships.append({
                "title": clean_text(s.get("scholarshipName")),
                "award": clean_text(info.get("purposeAward")),
                "eligibility": clean_text(eligibility_text),
                "deadline": s.get("deadlineDate"),
                "status": mode,
                "link": f"https://www.buddy4study.com/scholarship/{s['slug']}",

                "level": levels,
                "gender": gender,
                "location": location,
                "field": field,
                "clean_text": text,
                "keywords": extract_keywords(text),
                "combined_text": f"{text} {' '.join([l for l in levels if l!='any'])} {' '.join([f for f in field if f!='any'])} {location if location!='any' else ''}".strip()
            })

        print(f"{mode} page {page} scraped")

        page += 1
        time.sleep(1)

print("Before removing duplicates:", len(all_scholarships))

#Deduplication step
seen = set()
unique_data = []

for s in all_scholarships:
    title = s["title"].strip().lower()   # normalize

    if title not in seen:
        unique_data.append(s)
        seen.add(title)

print("After removing duplicates:", len(unique_data))

with open("scholarships_api.json", "w", encoding="utf-8") as f:
    json.dump(unique_data, f, indent=4, ensure_ascii=False)