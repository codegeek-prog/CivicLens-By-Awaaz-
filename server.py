#!/usr/bin/env python3
"""
CivicLens - Server with Gemini AI Triage & Routing Table
Serves static assets and provides POST /api/analyze-complaint
"""

import os
import sys
import json
import base64
import urllib.request
import urllib.error
import ssl
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

PORT = int(os.environ.get("PORT", 8000))
GEMINI_MODEL = "gemini-2.5-flash"

# Read .env file if present
def load_env_file():
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_path):
        try:
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        os.environ.setdefault(k.strip(), v.strip())
        except Exception as e:
            print(f"Error reading .env: {e}")

load_env_file()

# Official CivicLens Routing Table:
# - Roads -> Roads & Buildings
# - Waste -> Sanitation
# - Water -> Water Board
# - Electricity -> Electricity Department
# - Trees -> Parks & Gardens
# - Drainage -> Drainage Department
ROUTING_TABLE = {
    "roads": "Roads & Buildings",
    "waste": "Sanitation",
    "water": "Water Board",
    "electricity": "Electricity Department",
    "trees": "Parks & Gardens",
    "drainage": "Drainage Department"
}

def analyze_with_gemini(text, photo_b64=None, language_hint="en", category_hint=None):
    """
    Calls Gemini API with the complaint text and optional photo.
    Returns structured JSON with:
      - detected_language
      - english_translation
      - category
      - severity
      - severity_reason
      - department (assigned via routing table)
      - unclear_notes
    """
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        print("[CivicLens Server] GEMINI_API_KEY not set. Using rule-based triage with Routing Table.")
        return rule_based_triage(text, category_hint, language_hint)

    system_instruction = (
        "You are an expert civic triage AI assistant for CivicLens, a city complaint app for residents in India.\n"
        "Analyze the resident's complaint text (and photo if provided).\n"
        "The text may be in English, Hindi, Telugu, Tamil, Bengali, Marathi, or another Indian language.\n\n"
        "Categories must strictly be one of: 'roads', 'waste', 'water', 'electricity', 'trees', 'drainage'.\n"
        "Severity must strictly be one of: 'Low', 'Medium', 'High', 'Critical'.\n\n"
        "Severity Rules:\n"
        "- Live wires, gas leaks, open manholes, flooding, or danger to children or crowds MUST be 'Critical'.\n"
        "- Blocked roads or no water for days MUST be 'High'.\n"
        "- Ordinary damage (standard potholes, uncollected waste, dark street) MUST be 'Medium'.\n"
        "- Cosmetic issues (minor litter, faded mark, small dead branch) MUST be 'Low'.\n"
        "- For vague complaints, choose the best category and note what is unclear in unclear_notes.\n\n"
        "Official Routing Table for Departments:\n"
        "- roads -> Roads & Buildings\n"
        "- waste -> Sanitation\n"
        "- water -> Water Board\n"
        "- electricity -> Electricity Department\n"
        "- trees -> Parks & Gardens\n"
        "- drainage -> Drainage Department\n\n"
        "Return valid JSON matching this schema:\n"
        "{\n"
        "  \"detected_language\": \"Hindi\" | \"Telugu\" | \"Tamil\" | \"Bengali\" | \"Marathi\" | \"English\" | string,\n"
        "  \"english_translation\": string (accurate English translation),\n"
        "  \"category\": \"roads\" | \"waste\" | \"water\" | \"electricity\" | \"trees\" | \"drainage\",\n"
        "  \"severity\": \"Low\" | \"Medium\" | \"High\" | \"Critical\",\n"
        "  \"severity_reason\": string (one-line reason for severity based on rules),\n"
        "  \"department\": \"Roads & Buildings\" | \"Sanitation\" | \"Water Board\" | \"Electricity Department\" | \"Parks & Gardens\" | \"Drainage Department\",\n"
        "  \"unclear_notes\": string or null\n"
        "}"
    )

    user_prompt = f"Resident Complaint Text: {text or '[No text provided, see photo or category]'}\nSelected Category Hint: {category_hint or 'None'}\nLanguage hint: {language_hint}"

    parts = [{"text": user_prompt}]

    if photo_b64 and "," in photo_b64:
        try:
            header, encoded = photo_b64.split(",", 1)
            mime_type = "image/jpeg"
            if "image/png" in header:
                mime_type = "image/png"
            elif "image/webp" in header:
                mime_type = "image/webp"
            parts.append({
                "inlineData": {
                    "mimeType": mime_type,
                    "data": encoded
                }
            })
        except Exception as e:
            print(f"Error parsing photo base64: {e}")

    payload = {
        "systemInstruction": {
            "parts": [{"text": system_instruction}]
        },
        "contents": [
            {
                "parts": parts
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.1
        }
    }

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={api_key}"
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )

    ctx = ssl.create_default_context()

    try:
        with urllib.request.urlopen(req, context=ctx, timeout=4) as response:
            resp_body = response.read().decode("utf-8")
            data = json.loads(resp_body)
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
            result = json.loads(raw_text)

            cat = result.get("category", category_hint or "roads").lower()
            if cat not in ROUTING_TABLE:
                cat = "roads"
            result["category"] = cat
            # Strictly enforce routing table
            result["department"] = ROUTING_TABLE.get(cat, "Roads & Buildings")
            return result

    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8", errors="ignore")
        print(f"[CivicLens Server] Gemini API HTTP Error {e.code}: {err_msg}")
        return rule_based_triage(text, category_hint, language_hint, fallback_note=f"Gemini API ({e.code}): {err_msg[:80]}")
    except Exception as e:
        print(f"[CivicLens Server] Gemini API call exception: {e}")
        return rule_based_triage(text, category_hint, language_hint, fallback_note=str(e))

def rule_based_triage(text, category_hint=None, language_hint="en", fallback_note=None):
    """
    Deterministic rule-based triage applying:
    1. Category classification
    2. Routing table assignment:
       - Roads -> Roads & Buildings
       - Waste -> Sanitation
       - Water -> Water Board
       - Electricity -> Electricity Department
       - Trees -> Parks & Gardens
       - Drainage -> Drainage Department
    3. Severity evaluation
    """
    lower = (text or "").lower().strip()

    # Determine category
    category = "roads"
    if category_hint in ["roads", "waste", "water", "electricity", "trees", "drainage"]:
        category = category_hint
    elif category_hint == "road": category = "roads"
    elif category_hint == "garbage": category = "waste"
    elif category_hint == "tree": category = "trees"
    elif category_hint == "drain": category = "drainage"
    else:
        if any(w in lower for w in ["wire", "light", "current", "shock", "बिजली", "करंट", "तार", "వెలుగు", "மின்சாரம்"]):
            category = "electricity"
        elif any(w in lower for w in ["water", "leak", "pipe", "drinking", "पानी", "जल", "నీరు", "தண்ணீர்", "पाणी"]):
            category = "water"
        elif any(w in lower for w in ["garbage", "waste", "trash", "dump", "कचरा", "सफाई", "చెత్త", "குப்பை", "আবর্জনা"]):
            category = "waste"
        elif any(w in lower for w in ["drain", "sewer", "manhole", "gutter", "नाली", "सीवर", "కాలువ", "வடிகால்", "নর্দমা", "गटार"]):
            category = "drainage"
        elif any(w in lower for w in ["tree", "branch", "leaf", "पेड़", "झाड़", "చెట్టు", "மரம்", "গাছ", "झाड"]):
            category = "trees"
        else:
            category = "roads"

    # Assign Department strictly from routing table
    department = ROUTING_TABLE.get(category, "Roads & Buildings")

    # Determine language
    lang_names = {
        "hi": "Hindi",
        "te": "Telugu",
        "ta": "Tamil",
        "bn": "Bengali",
        "mr": "Marathi",
        "en": "English"
    }
    detected_language = lang_names.get(language_hint, "English")

    has_devanagari = any('\u0900' <= ch <= '\u097F' for ch in lower)
    has_telugu = any('\u0C00' <= ch <= '\u0C7F' for ch in lower)
    has_tamil = any('\u0B80' <= ch <= '\u0BFF' for ch in lower)
    has_bengali = any('\u0980' <= ch <= '\u09FF' for ch in lower)

    if has_devanagari:
        detected_language = "Marathi" if language_hint == "mr" else "Hindi"
    elif has_telugu:
        detected_language = "Telugu"
    elif has_tamil:
        detected_language = "Tamil"
    elif has_bengali:
        detected_language = "Bengali"

    # Evaluate Severity
    severity = "Medium"
    severity_reason = "Ordinary damage requiring municipal field maintenance."
    unclear_notes = None

    is_critical = any(kw in lower for kw in [
        "live wire", "open wire", "wire sparking", "sparking", "spark", "electric shock", "gas", "gas leak",
        "open manhole", "manhole", "flood", "flooding", "waterlogging",
        "child", "children", "kid", "school", "crowd", "market", "urgent", "danger",
        "खुला तार", "करंट", "मैनहोल", "बाढ़", "बच्चे", "खतरा", "गंभीर", "स्कूल", "चिंगारी",
        "పిల్లలు", "ప్రమాదం", "నిప్పురవ్వలు", "పొగలు", "ట్రాన్స్‌ఫార్మర్", "విద్యుత్ తీగ",
        "குழந்தைகள்", "বিপদ", "लहान मुले", "उघडा मॅनहोल"
    ])

    has_water_disruption = any(w in lower for w in ["water", "पानी", "నీరు", "குடிநீர்", "জল", "पाणी"]) and any(d in lower for d in ["day", "days", "दिन", "రోజులు", "நாட்களாக", "দিন"])
    has_blocked_road = any(b in lower for b in [
        "blocked road", "road blocked", "completely blocked", "road closed",
        "रास्ता बंद", "सड़क बंद", "पूरी तरह बंद",
        "రోడ్డు నిలిచిపోయింది", "ట్రాఫిక్ నిలిచిపోయింది", "రహదారి మూసివేయబడింది",
        "சாலை அடைப்பு", "রাস্তা বন্ধ"
    ])

    is_high = has_water_disruption or has_blocked_road or any(kw in lower for kw in [
        "no water", "पानी नहीं आ रहा", "నీరు రావడం లేదు", "చుక్క నీరు", "heavy pothole", "massive crater"
    ])

    is_low = any(kw in lower for kw in [
        "small branch", "dry branch", "dry small", "small dry", "dry leaf", "dry leaves", "fallen branch",
        "cosmetic", "faded", "paint", "dirty spot", "minor", "small litter",
        "सूखी टहनी", "छोटी टहनी", "छोटा", "रंग", "చిన్న కొమ్మ", "ఎండిన", "சிறிய"
    ])

    has_civic_entity = any(k in lower for k in [
        "तार", "गड्ढा", "कचरा", "कूड़ा", "नाली", "सीवर", "मैनहोल", "पानी", "पेड़", "बिजली",
        "పైపు", "గుంత", "వైర్", "చెత్త", "కాలువ", "నీరు", "చెట్టు", "డ్రైనేజీ",
        "pothole", "wire", "pipe", "drain", "garbage", "waste", "water", "tree", "spark", "flood", "leak"
    ])

    is_vague = (len(lower) < 12 or any(p in lower for p in [
        "परेशानी है", "जल्दी ठीक", "मदद करो", "खराब है", "సమస్య ఉంది", "సరిచేయండి", "బాగు చేయండి",
        "help me", "fix it", "please fix", "please help", "something broken", "problem", "solve this"
    ])) and not has_civic_entity

    if is_critical:
        severity = "Critical"
        severity_reason = "Imminent public safety hazard (open wire, gas, open manhole, flood, or risk to children/crowds)."
    elif is_high:
        severity = "High"
        severity_reason = "Major civic disruption (blocked traffic roadway or multi-day water supply failure)."
    elif is_low:
        severity = "Low"
        severity_reason = "Minor cosmetic issue with negligible functional or safety impact."
    else:
        severity = "Medium"
        severity_reason = "Ordinary infrastructure damage requiring municipal field maintenance."

    if is_vague:
        unclear_notes = "Complaint description is very brief. Please provide exact street address or specific problem details."

    category_titles = {
        "roads": "Road & Pothole issue",
        "waste": "Garbage and solid waste accumulation",
        "water": "Water supply interruption",
        "electricity": "Streetlight or power disruption",
        "trees": "Tree branch or canopy obstruction",
        "drainage": "Drainage or sewer overflow"
    }

    if lower and len(lower) > 3:
        if detected_language == "English":
            english_translation = text.strip()
        else:
            english_translation = f"{category_titles[category]}: Resident reported '{text.strip()}'."
    else:
        english_translation = f"{category_titles[category]} reported at specified location."

    return {
        "detected_language": detected_language,
        "english_translation": english_translation,
        "category": category,
        "severity": severity,
        "severity_reason": severity_reason,
        "department": department,
        "unclear_notes": unclear_notes
    }

class CivicLensHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/api/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            has_key = bool(os.environ.get("GEMINI_API_KEY"))
            payload = json.dumps({
                "status": "ok",
                "gemini_configured": has_key,
                "model": GEMINI_MODEL,
                "routing_table": ROUTING_TABLE
            })
            self.wfile.write(payload.encode("utf-8"))
            return

        return super().do_GET()

    def do_POST(self):
        if self.path == "/api/analyze-complaint":
            content_length = int(self.headers.get("Content-Length", 0))
            body_bytes = self.rfile.read(content_length)

            try:
                data = json.loads(body_bytes.decode("utf-8"))
            except Exception:
                data = {}

            text = data.get("text", "")
            photo_b64 = data.get("photo", None)
            language = data.get("language", "en")
            category = data.get("category", None)

            analysis = analyze_with_gemini(
                text=text,
                photo_b64=photo_b64,
                language_hint=language,
                category_hint=category
            )

            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(analysis, ensure_ascii=False).encode("utf-8"))
            return

        self.send_error(404, "Endpoint Not Found")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server_address = ("", PORT)
    httpd = ThreadingHTTPServer(server_address, CivicLensHandler)
    has_key = bool(os.environ.get("GEMINI_API_KEY"))
    print("==================================================")
    print(f"CivicLens Server running at http://localhost:{PORT}")
    print(f"Routing Table Active: {len(ROUTING_TABLE)} departments mapped")
    print(f"Gemini API Key configured: {has_key}")
    print("==================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping CivicLens Server...")
        httpd.server_close()

if __name__ == "__main__":
    main()
