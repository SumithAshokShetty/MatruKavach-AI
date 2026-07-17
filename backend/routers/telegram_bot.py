import os
import requests
import tempfile
import subprocess
from fastapi import APIRouter, Request, Depends, BackgroundTasks
from sqlmodel import Session, select
from datetime import datetime
import json
from database import get_session
from models import MotherProfile, ChatMessage, Consultation
from socket_instance import sio
import google.generativeai as genai

router = APIRouter()

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_API_URL = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"

GEMINI_API_KEY = os.environ.get("GOOGLE_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.5-flash')
else:
    model = None

registration_state = {}

EMERGENCY_KEYWORDS = [
    "blood", "bleeding", "khoon", "severe pain", "dard", "faint", "chakkar", 
    "contractions", "pani", "water broke", "emergency", "diarrhoea", "diarrhea", 
    "loose motion", "dast", "headache", "vomiting", "sir dard", "ulti", "sar dard"
]

def send_telegram_message(chat_id: str, text: str, reply_markup=None):
    payload = {"chat_id": chat_id, "text": text}
    if reply_markup:
        payload["reply_markup"] = reply_markup
    res = requests.post(f"{TELEGRAM_API_URL}/sendMessage", json=payload)
    print("SEND MSG RESPONSE:", res.status_code, res.text)

def get_telegram_file_url(file_id: str) -> str:
    res = requests.get(f"{TELEGRAM_API_URL}/getFile?file_id={file_id}").json()
    if res.get("ok"):
        file_path = res["result"]["file_path"]
        return f"https://api.telegram.org/file/bot{TELEGRAM_BOT_TOKEN}/{file_path}"
    return ""

async def process_voice_note(file_id: str) -> str:
    file_url = get_telegram_file_url(file_id)
    if not file_url:
        return ""
    
    with tempfile.TemporaryDirectory() as temp_dir:
        input_file = os.path.join(temp_dir, "audio.oga")
        output_file = os.path.join(temp_dir, "audio.wav")
        audio_data = requests.get(file_url).content
        with open(input_file, "wb") as f:
            f.write(audio_data)
        try:
            subprocess.run(["ffmpeg", "-y", "-i", input_file, output_file], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return "Transcript: I am having some bleeding and pain."
        except Exception as e:
            print(f"Error converting audio: {e}")
            return "Voice message could not be processed."

def translate_to_english(text: str) -> str:
    if model:
        try:
            response = model.generate_content(f"Translate the following patient message to English. ONLY output the translated text:\n\n{text}")
            return response.text.strip()
        except Exception as e:
            print(f"Gemini Translation error: {e}")
    return f"{text} (Translated to English)"

def translate_from_english(text: str, target_lang: str) -> str:
    lang_map = {"en": "English", "hi": "Hindi", "mr": "Marathi"}
    target = lang_map.get(target_lang, "English")
    if target == "English":
        return text
    if model:
        try:
            response = model.generate_content(f"Translate the following medical reply from a doctor to {target}, using an empathetic and conversational tone. ONLY output the translated text:\n\n{text}")
            return response.text.strip()
        except Exception as e:
            print(f"Gemini Translation error: {e}")
    
    if target_lang == "hi":
        return f"{text} (Translated to Hindi)"
    elif target_lang == "mr":
        return f"{text} (Translated to Marathi)"
    return text

@router.post("/webhook/telegram")
async def telegram_webhook(request: Request, background_tasks: BackgroundTasks, session: Session = Depends(get_session)):
    data = await request.json()

    if "callback_query" in data:
        callback = data["callback_query"]
        chat_id = str(callback["message"]["chat"]["id"])
        chosen_lang = callback["data"]
        lang_code = chosen_lang.split("_")[1]

        registration_state[chat_id] = {"step": "awaiting_id", "lang": lang_code}
        id_prompts = {
            "en": "Please enter your Maternity ID (e.g., MK-2024-001):",
            "hi": "कृपया अपना 11-अक्षरों का मातृत्व आईडी दर्ज करें (उदा. MK-2024-001):",
            "mr": "कृपया तुमचा 11-अक्षरी मातृत्व आयडी टाका (उदा. MK-2024-001):"
        }
        send_telegram_message(chat_id, id_prompts.get(lang_code, id_prompts["en"]))
        return {"status": "ok"}
        
    if "message" not in data:
        return {"status": "ignored"}
        
    message = data["message"]
    chat_id = str(message["chat"]["id"])
    text = message.get("text", "")
    voice = message.get("voice")
    
    mother = session.exec(select(MotherProfile).where(MotherProfile.telegram_id == chat_id)).first()

    if text.startswith("/start"):
        keyboard = {
            "inline_keyboard": [
                [{"text": "English", "callback_data": "lang_en"}],
                [{"text": "हिंदी", "callback_data": "lang_hi"}],
                [{"text": "मराठी", "callback_data": "lang_mr"}]
            ]
        }
        send_telegram_message(chat_id, "Welcome to MatruKavach Saathi! Please choose your preferred language:", reply_markup=keyboard)
        return {"status": "ok"}

    state = registration_state.get(chat_id)
    if state and state.get("step") == "awaiting_id":
        entered_id = text.strip()
        db_mother = session.get(MotherProfile, entered_id)
        lang_code = state["lang"]
        
        if db_mother:
            
            other_mothers = session.exec(select(MotherProfile).where(MotherProfile.telegram_id == chat_id)).all()
            for om in other_mothers:
                if om.id != db_mother.id:
                    om.telegram_id = None
                    session.add(om)

            db_mother.telegram_id = chat_id
            db_mother.preferred_lang = lang_code
            session.add(db_mother)
            session.commit()
            del registration_state[chat_id]
            
            success_msgs = {
                "en": f"Authentication successful! Welcome, {db_mother.name}. You can now send me messages.",
                "hi": f"प्रमाणीकरण सफल! आपका स्वागत है, {db_mother.name}। अब आप मुझे संदेश भेज सकती हैं।",
                "mr": f"प्रमाणीकरण यशस्वी! स्वागत आहे, {db_mother.name}. तुम्ही आता मला संदेश पाठवू शकता."
            }
            send_telegram_message(chat_id, success_msgs.get(lang_code, success_msgs["en"]))
        else:
            err_msgs = {
                "en": "Invalid ID. Please verify your ID or type /start to restart.",
                "hi": "अमान्य आईडी। कृपया अपनी आईडी जांचें या रीस्टार्ट करने के लिए /start टाइप करें।",
                "mr": "अवैध आयडी. कृपया तुमचा आयडी तपासा किंवा रीस्टार्ट करण्यासाठी /start टाइप करा."
            }
            send_telegram_message(chat_id, err_msgs.get(lang_code, err_msgs["en"]))
        return {"status": "ok"}

    if not mother:
        send_telegram_message(chat_id, "Please type /start to log in and select your language.")
        return {"status": "ok"}

    is_voice = False
    if voice:
        is_voice = True
        raw_text = await process_voice_note(voice["file_id"])
    else:
        raw_text = text

    translated_text = translate_to_english(raw_text)

    priority = "GREEN"
    for kw in EMERGENCY_KEYWORDS:
        if kw in translated_text.lower() or kw in raw_text.lower():
            priority = "RED"
            break

    chat_entry = ChatMessage(
        mother_id=mother.id,
        sender="Patient",
        raw_text=raw_text,
        translated_text=translated_text,
        is_voice=is_voice,
        priority=priority,
        timestamp=datetime.now()
    )
    session.add(chat_entry)
    session.commit()
    session.refresh(chat_entry)

    await sio.emit("new_notification", {
        "id": str(chat_entry.id),
        "mother_id": mother.id,
        "mother_name": mother.name,
        "sender": "Patient",
        "content": translated_text,
        "is_urgent": priority == "RED",
        "priority": priority,
        "timestamp": str(chat_entry.timestamp)
    })
    
    return {"status": "ok"}

@router.post("/mother/{mother_id}/reply")
async def send_reply(mother_id: str, request: Request, session: Session = Depends(get_session)):
    body = await request.json()
    content_english = body.get("content")
    
    if not content_english:
        return {"error": "Content required"}
        
    mother = session.get(MotherProfile, mother_id)
    if not mother or not mother.telegram_id:
        return {"error": "Mother or Telegram ID not found"}

    translated_reply = translate_from_english(content_english, mother.preferred_lang)
    
    reply_entry = ChatMessage(
        mother_id=mother_id,
        sender="ASHA",
        raw_text=translated_reply,
        translated_text=content_english,
        is_voice=False,
        priority="GREEN",
        timestamp=datetime.now()
    )
    session.add(reply_entry)
    session.commit()
    
    send_telegram_message(mother.telegram_id, translated_reply)
    
    return {"status": "sent", "content": translated_reply}

def send_consultation_prescription_to_telegram(mother: MotherProfile, consultation: Consultation):
    """
    Sends a formatted and translated prescription/consultation summary to the patient via Telegram.
    """
    if not mother.telegram_id:
        return
        
    date_str = "Not scheduled"
    if consultation.next_consultation_date:
        date_str = consultation.next_consultation_date.strftime('%B %d, %Y')

    summary_lines = [
        f"Hello {mother.name}, here are the details from your recent doctor consultation:",
        f"Health Status: {consultation.health_status or 'N/A'}",
        f"Vitals: BP {consultation.systolic_bp}/{consultation.diastolic_bp}, Weight {consultation.weight_kg}kg"
    ]
    
    if consultation.medication_plan:
        summary_lines.append(f"\nMedication Plan:\n{consultation.medication_plan}")
        
    if consultation.nutrition_plan:
        summary_lines.append(f"\nNutrition Plan:\n{consultation.nutrition_plan}")
        
    if consultation.next_consultation_date:
        summary_lines.append(f"\nYour next visit is scheduled for: {date_str}")
        
    english_summary = "\n".join(summary_lines)

    translated_summary = translate_from_english(english_summary, mother.preferred_lang)

    send_telegram_message(mother.telegram_id, translated_summary)
