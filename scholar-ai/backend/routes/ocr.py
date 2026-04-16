from flask import Blueprint, request, jsonify
import pytesseract
import os
import cv2
import re
import uuid
import numpy as np

# Tesseract path (Windows)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

ocr_bp = Blueprint("ocr", __name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def preprocess_image(filepath):
    img = cv2.imread(filepath)
    if img is None:
        return None

    # 1. Scaling up helps Tesseract read smaller fonts
    img = cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

    # 2. Grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 3. Denoising (Better than heavy Blur for text)
    denoised = cv2.fastNlMeansDenoising(gray, h=10)

    # 4. Thresholding (Otsu's Binarization often works better for clean scans)
    _, thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    return thresh

def clean_ocr_text(text):
    # Keep alphanumeric, common Indian currency symbols, and basic punctuation
    text = re.sub(r'[^\w₹,\n:.\- ]', '', text)
    # Remove extra whitespace
    text = re.sub(r' +', ' ', text)
    return text.strip()

def extract_data(text):
    data = {"doc_type": "unknown", "income": None, "name": None, "aadhaar_found": False}
    lower_text = text.lower()

    #  Document type detection
    if "income" in lower_text or "certificate" in lower_text:
        data["doc_type"] = "income"
    if "government of india" in lower_text or "aadhaar" in lower_text or "unique identification" in lower_text:
        data["doc_type"] = "aadhar"

    # Aadhaar Number Detection (Redacted for output, but flag found)
    # Pattern for XXXX XXXX XXXX
    aadhaar_pattern = r'\b\d{4}\s\d{4}\s\d{4}\b'
    if re.search(aadhaar_pattern, text):
        data["aadhaar_found"] = True

    # Income extraction
    income_patterns = [
        r'(?:Rs|INR|₹)\.?\s?(\d{1,3}(?:,\d{3})+)', # ₹ 2,50,000
        r'\b\d{5,7}\b'                             # 250000
    ]

    for pattern in income_patterns:
        match = re.search(pattern, text)
        if match:
            data["income"] = match.group()
            break

    # Name extraction (looking for common labels)
    lines = text.split("\n")
    for i, line in enumerate(lines):
        clean_line = line.strip()
        if "name" in clean_line.lower():
            # Attempt to take the string after ":" or the next line
            if ":" in clean_line:
                data["name"] = clean_line.split(":")[-1].strip()
            elif i + 1 < len(lines):
                data["name"] = lines[i+1].strip()
            break

    return data

def get_confidence(img):
    ocr_data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
    conf_values = [float(x) for x in ocr_data['conf'] if x != '-1']
    return sum(conf_values) / len(conf_values) if conf_values else 0

def verify(data, confidence):
    try:
        income_str = data.get("income", "")
        doc_type = data.get("doc_type", "unknown")
        
        # Clean income string to integer
        income_val = 0
        if income_str:
            numeric_income = re.sub(r'[^\d]', '', income_str)
            income_val = int(numeric_income) if numeric_income else 0

        score = 0
        # Logic: If it's a known doc and we have high confidence, boost score
        if doc_type != "unknown": score += 2
        if confidence > 70: score += 2
        if 0 < income_val < 800000: score += 2 # Common EWS threshold
        
        if score >= 4:
            return True, "Highly Eligible"
        elif score >= 2:
            return True, "Possibly Eligible"
        return False, "Verification failed or low data quality"

    except Exception as e:
        return False, f"Error: {str(e)}"

@ocr_bp.route("/ocr-upload", methods=["POST"])
def ocr_upload():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "Empty filename"}), 400

        filename = f"{uuid.uuid4()}_{file.filename}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        processed_img = preprocess_image(filepath)
        if processed_img is None:
            return jsonify({"error": "Processing failed"}), 400

        # PSM 3 is 'Fully automatic page segmentation, but no OSD'
        custom_config = r'--oem 3 --psm 3'
        raw_text = pytesseract.image_to_string(processed_img, config=custom_config)
        
        clean_text = clean_ocr_text(raw_text)
        print(f"OCR RAW TEXT:\n{raw_text}\n")
        print(f"OCR CLEAN TEXT:\n{clean_text}\n")
        data = extract_data(clean_text)
        conf_score = get_confidence(processed_img)

        eligible, reason = verify(data, conf_score)

        return jsonify({
            "status": "success",
            "data": data,
            "confidence": round(conf_score, 2),
            "eligible": eligible,
            "reason": reason,
            "text_preview": clean_text[:200] # Return a snippet for debugging
        }), 200

    except Exception as e:
        print(f"OCR ERROR: {e}")
        return jsonify({"error": str(e)}), 500