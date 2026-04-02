import json 
def load_data():
    with open ("data/scholarships_api.json","r",encoding="utf-8") as f:
        return json.load(f)