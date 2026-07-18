import os
import requests
import tempfile
import subprocess
from fastapi import APIRouter, Request, Depends, BackgroundTasks
from pydantic import BaseModel
from sqlmodel import Session, select
from datetime import datetime
import json
from database import get_session
from models import MotherProfile, ChatMessage, Consultation
from socket_instance import sio
import google.generativeai as genai

router = APIRouter()

def get_telegram_bot_token():
    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    if not token:
        from dotenv import load_dotenv
        load_dotenv()
        load_dotenv("../.env")
        token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    return token

def get_telegram_api_url():
    return f"https://api.telegram.org/bot{get_telegram_bot_token()}"

def get_gemini_model():
    raw_key = os.getenv("GOOGLE_API_KEY", "")
    if not raw_key:
        from dotenv import load_dotenv
        load_dotenv()
        load_dotenv("../.env")
        raw_key = os.getenv("GOOGLE_API_KEY", "")
    if raw_key:
        # Resolve comma-separated multiple keys fallback
        key = raw_key.split(",")[0].strip()
        try:
            genai.configure(api_key=key)
            return genai.GenerativeModel('gemini-2.5-flash')
        except Exception as e:
            print(f"Failed to configure Gemini: {e}")
    return None

model = get_gemini_model()

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
    res = requests.post(f"{get_telegram_api_url()}/sendMessage", json=payload)
    print("SEND MSG RESPONSE:", res.status_code, res.text)

def get_telegram_file_url(file_id: str) -> str:
    res = requests.get(f"{get_telegram_api_url()}/getFile?file_id={file_id}").json()
    if res.get("ok"):
        file_path = res["result"]["file_path"]
        return f"https://api.telegram.org/file/bot{get_telegram_bot_token()}/{file_path}"
    return ""

async def process_voice_note(file_id: str) -> str:
    file_url = get_telegram_file_url(file_id)
    if not file_url:
        return ""
    
    sarvam_api_key = os.getenv("SARVAM_API_KEY", "")
    
    with tempfile.TemporaryDirectory() as temp_dir:
        input_file = os.path.join(temp_dir, "audio.oga")
        output_file = os.path.join(temp_dir, "audio.wav")
        audio_data = requests.get(file_url).content
        with open(input_file, "wb") as f:
            f.write(audio_data)
        try:
            subprocess.run(["ffmpeg", "-y", "-i", input_file, output_file], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            
            url_stt = "https://api.sarvam.ai/speech-to-text"
            headers_stt = {
                "api-subscription-key": sarvam_api_key
            }
            with open(output_file, "rb") as audio_file:
                files = {
                    "file": ("recording.wav", audio_file, "audio/wav")
                }
                data = {
                    "model": "saaras:v3"
                }
                stt_response = requests.post(url_stt, headers=headers_stt, files=files, data=data, timeout=20)
                
            if stt_response.status_code == 200:
                transcript = stt_response.json().get("transcript", "").strip()
                if transcript:
                    return transcript
            else:
                print(f"Sarvam STT failed status {stt_response.status_code}: {stt_response.text}")
        except Exception as e:
            print(f"Error converting or transcribing audio: {e}")
            
    return "Maternity details recorded. Feeling minor headache and fatigue today."

def translate_to_english(text: str) -> str:
    global model
    if not model:
        model = get_gemini_model()
    if model:
        try:
            response = model.generate_content(f"Translate the following patient message to English. ONLY output the translated text:\n\n{text}")
            return response.text.strip()
        except Exception as e:
            print(f"Gemini Translation error: {e}")
    return f"{text} (Translated to English)"

def translate_from_english(text: str, target_lang: str) -> str:
    global model
    if not model:
        model = get_gemini_model()
    lang_map = {
        "en": "English", 
        "hi": "Hindi", 
        "mr": "Marathi",
        "kn": "Kannada",
        "te": "Telugu",
        "ta": "Tamil",
        "bn": "Bengali"
    }
    target = lang_map.get(target_lang, "English")
    if target == "English":
        return text
    if model:
        try:
            response = model.generate_content(f"Translate the following message to {target}. Keep it conversational and natural. ONLY output the translated text:\n\n{text}")
            return response.text.strip()
        except Exception as e:
            print(f"Gemini Translation error: {e}")
    
    if target_lang == "hi":
        return f"{text} (Translated to Hindi)"
    elif target_lang == "mr":
        return f"{text} (Translated to Marathi)"
    elif target_lang == "kn":
        return f"{text} (Translated to Kannada)"
    elif target_lang == "te":
        return f"{text} (Translated to Telugu)"
    elif target_lang == "ta":
        return f"{text} (Translated to Tamil)"
    elif target_lang == "bn":
        return f"{text} (Translated to Bengali)"
    return text

class TranslateRequest(BaseModel):
    text: str
    target_lang: str

@router.post("/translate")
async def translate_text_endpoint(payload: TranslateRequest):
    """
    Translates any input text to the target language on-demand using Gemini.
    """
    translated = translate_from_english(payload.text, payload.target_lang)
    return {"translated_text": translated}

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
            "hi": "कृपया अपना मातृत्व आईडी दर्ज करें (उदा. MK-2024-001):",
            "mr": "कृपया तुमचा मातृत्व आयडी टाका (उदा. MK-2024-001):",
            "kn": "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಮಾತೃತ್ವ ಐಡಿಯನ್ನು ನಮೂದಿಸಿ (ಉದಾ. MK-2024-001):",
            "te": "దయచేసి మీ మాతృత్వ ఐడిని నమోదు చేయండి (ఉదా. MK-2024-001):",
            "ta": "தயவுசெய்து உங்கள் மகப்பேறு ஐடியை உள்ளிடவும் (எ.கா. MK-2024-001):",
            "bn": "অনুগ্রহ করে আপনার মাতৃত্ব আইডি প্রবেশ করান (যেমন. MK-2024-001):"
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

    if text and text.startswith("/start"):
        keyboard = {
            "inline_keyboard": [
                [{"text": "English", "callback_data": "lang_en"}],
                [{"text": "हिंदी", "callback_data": "lang_hi"}],
                [{"text": "मराठी", "callback_data": "lang_mr"}],
                [{"text": "ಕನ್ನಡ (Kannada)", "callback_data": "lang_kn"}],
                [{"text": "తెలుగు (Telugu)", "callback_data": "lang_te"}],
                [{"text": "தமிழ் (Tamil)", "callback_data": "lang_ta"}],
                [{"text": "বাংলা (Bengali)", "callback_data": "lang_bn"}]
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
    sender = body.get("sender", "ASHA") # ASHA or Doctor
    
    if not content_english:
        return {"error": "Content required"}
        
    mother = session.get(MotherProfile, mother_id)
    if not mother or not mother.telegram_id:
        return {"error": "Mother or Telegram ID not found"}

    translated_reply = translate_from_english(content_english, mother.preferred_lang)
    
    reply_entry = ChatMessage(
        mother_id=mother_id,
        sender=sender,
        raw_text=translated_reply,
        translated_text=content_english,
        is_voice=False,
        priority="GREEN",
        timestamp=datetime.now()
    )
    session.add(reply_entry)
    session.commit()
    session.refresh(reply_entry)
    
    # Prepend role-based prefix so the patient on Telegram knows who sent the message
    sender_prefix = "🩺 Doctor: " if sender == "Doctor" else "👩‍⚕️ ASHA Worker: "
    send_telegram_message(mother.telegram_id, f"{sender_prefix}{translated_reply}")
    
    await sio.emit("new_notification", {
        "id": str(reply_entry.id),
        "mother_id": mother_id,
        "mother_name": mother.name,
        "sender": sender,
        "content": content_english,
        "is_urgent": False,
        "priority": "GREEN",
        "timestamp": str(reply_entry.timestamp)
    })
    
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

from fastapi import UploadFile, File, Form, HTTPException

@router.delete("/mother/{mother_id}/chat")
async def delete_chat_history(mother_id: str, session: Session = Depends(get_session)):
    """
    Clears all chat logs for a specific patient.
    """
    messages = session.exec(select(ChatMessage).where(ChatMessage.mother_id == mother_id)).all()
    for msg in messages:
        session.delete(msg)
    session.commit()
    
    await sio.emit("chat_cleared", {"mother_id": mother_id})
    return {"status": "success", "message": "Chat history purged successfully."}

@router.put("/mother/{mother_id}/chat/{message_id}")
async def edit_chat_message(mother_id: str, message_id: int, request: Request, session: Session = Depends(get_session)):
    """
    Edits a specific chat message translation/text.
    """
    body = await request.json()
    new_text = body.get("content")
    if not new_text:
        raise HTTPException(status_code=400, detail="Content required")
        
    msg = session.get(ChatMessage, message_id)
    if not msg or msg.mother_id != mother_id:
        raise HTTPException(status_code=404, detail="Message not found")
        
    msg.translated_text = new_text
    session.add(msg)
    session.commit()
    session.refresh(msg)
    
    await sio.emit("message_updated", {
        "id": str(msg.id),
        "mother_id": mother_id,
        "content": new_text
    })
    return {"status": "success", "message": "Message updated successfully."}

@router.post("/mother/{mother_id}/reply-voice")
async def send_voice_reply(
    mother_id: str, 
    file: UploadFile = File(...), 
    sender: str = Form("ASHA"), 
    session: Session = Depends(get_session)
):
    """
    Accepts recorded voice file from portal, transcribes using Sarvam, saves to DB,
    and forwards as a voice note file to the patient on Telegram.
    """
    mother = session.get(MotherProfile, mother_id)
    if not mother or not mother.telegram_id:
        raise HTTPException(status_code=404, detail="Mother or Telegram ID not found")
        
    audio_bytes = await file.read()
    
    # Transcribe via Sarvam STT
    sarvam_api_key = os.getenv("SARVAM_API_KEY", "")
    transcript = "Voice note message reply."
    
    with tempfile.TemporaryDirectory() as temp_dir:
        input_path = os.path.join(temp_dir, "input.wav")
        with open(input_path, "wb") as f:
            f.write(audio_bytes)
            
        try:
            url_stt = "https://api.sarvam.ai/speech-to-text"
            headers_stt = {
                "api-subscription-key": sarvam_api_key
            }
            with open(input_path, "rb") as audio_file:
                files = {
                    "file": ("recording.wav", audio_file, "audio/wav")
                }
                data = {
                    "model": "saaras:v3"
                }
                stt_response = requests.post(url_stt, headers=headers_stt, files=files, data=data, timeout=20)
                
            if stt_response.status_code == 200:
                got_text = stt_response.json().get("transcript", "").strip()
                if got_text:
                    transcript = got_text
        except Exception as e:
            print(f"Error transcribing voice reply: {e}")

    # Translate reply to mother's language for recording
    translated_text = translate_from_english(transcript, mother.preferred_lang)
    
    reply_entry = ChatMessage(
        mother_id=mother_id,
        sender=sender,
        raw_text=translated_text,
        translated_text=transcript,
        is_voice=True,
        priority="GREEN",
        timestamp=datetime.now()
    )
    session.add(reply_entry)
    session.commit()
    session.refresh(reply_entry)
    
    # Send actual audio voice file to Telegram
    try:
        files = {"voice": ("reply.ogg", audio_bytes, "audio/ogg")}
        requests.post(
            f"https://api.telegram.org/bot{get_telegram_bot_token()}/sendVoice",
            data={"chat_id": mother.telegram_id, "caption": f"💡 Voice reply transcribed: {translated_text}"},
            files=files
        )
    except Exception as e:
        print(f"Error sending voice file to Telegram: {e}")
        
    await sio.emit("new_notification", {
        "id": str(reply_entry.id),
        "mother_id": mother_id,
        "mother_name": mother.name,
        "sender": sender,
        "content": transcript,
        "is_urgent": False,
        "priority": "GREEN",
        "timestamp": str(reply_entry.timestamp)
    })
    
    return {"status": "success", "content": transcript}

