from flask import Blueprint, request, jsonify
import pytesseract
from PIL import Image
import os
import cv2
import re
import pytesseract

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

ocr_bp = Blueprint("ocr", __name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def extract_data(text):
    data = {}

    #  Extract income (₹ or numbers like 2,50,000)
    income_match = re.search(r'(\d{1,2},?\d{3},?\d{3})', text)
    if income_match:
        data["income"] = income_match.group()

    #  Extract name (basic heuristic)
    lines = text.split("\n")
    for line in lines:
        if "name" in line.lower():
            data["name"] = line.strip()
            break

    #  Detect document type
    lower_text = text.lower()

    if "aadhaar" in lower_text or "aadhar" in lower_text:
        data["doc_type"] = "aadhar"
    elif "income certificate" in lower_text:
        data["doc_type"] = "income"
    else:
        data["doc_type"] = "unknown"

    return data


def verify(data):
    try:
        income_str = data.get("income", "").replace(",", "")

        if not income_str:
            return False, "Income not detected"

        income = int(income_str)

        #  Example rule
        if income < 250000:
            return True, "Eligible: Income below ₹2.5L"
        else:
            return False, "Not eligible: Income too high"

    except:
        return False, "Verification failed"


@ocr_bp.route("/ocr-upload", methods=["POST"])
def ocr_upload():
    try:
        file = request.files.get("file")

        if not file:
            return jsonify({"error": "No file uploaded"}), 400

        # Save file
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

      
        img = cv2.imread(filepath)

        if img is None:
            return jsonify({"error": "Invalid image"}), 400

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Noise removal
        gray = cv2.medianBlur(gray, 3)

        # Thresholding
        _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)

        text = pytesseract.image_to_string(thresh)

        data = extract_data(text)

        eligible, reason = verify(data)

 
        confidence = "low"
        if len(text) > 100:
            confidence = "medium"
        if len(text) > 300:
            confidence = "high"

        return jsonify({
            "message": "OCR successful",
            "text": text,
            "data": data,
            "eligible": eligible,
            "reason": reason,
            "confidence": confidence
        }), 200

    except Exception as e:
        print("OCR ERROR:", e)
        return jsonify({"error": "OCR failed"}), 500