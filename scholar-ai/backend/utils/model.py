from sklearn.feature_extraction.text import TfidfVectorizer
def build_model(data):
    texts = [s["combined_text"] for s in data]
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(texts)
    return vectorizer, X
