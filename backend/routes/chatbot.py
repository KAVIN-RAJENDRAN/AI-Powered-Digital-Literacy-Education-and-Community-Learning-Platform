import os
from flask import Blueprint, request, jsonify
from routes.auth import token_required
from openai import OpenAI
from config import Config

chatbot_bp = Blueprint('chatbot', __name__)

# Initialize OpenAI client if key is configured
openai_client = None
if Config.OPENAI_API_KEY and Config.OPENAI_API_KEY != 'mock-key-for-development':
    try:
        openai_client = OpenAI(api_key=Config.OPENAI_API_KEY)
    except Exception as e:
        print(f"Error initializing OpenAI: {e}")

# High quality offline rules-based response mapping for Digital Literacy in EN & TA
KNOWLEDGE_BASE = {
    'en': [
        {
            'keywords': ['whatsapp', 'message', 'video call', 'chat'],
            'response': "Here is how to use WhatsApp:\n1. Open WhatsApp from your screen.\n2. Tap the Chat icon (a small bubble at the bottom right).\n3. Find your contact and tap their name.\n4. Type your message and hit the green Send arrow!\n5. To call: Tap the Phone or Camera icon on the top right of the chat screen."
        },
        {
            'keywords': ['upi', 'pay', 'gpay', 'phonepe', 'payment', 'money', 'qr'],
            'response': "Unified Payments Interface (UPI) is safe when you follow these rules:\n1. Open your payment app (Google Pay, PhonePe, Paytm).\n2. Tap 'Scan QR' to scan the vendor's code, or enter their UPI ID.\n3. Verify the receiver name displays correctly on screen.\n4. Enter the amount to transfer.\n5. Enter your UPI PIN (Never share this with anyone! Bank executives never ask for it).\n6. Wait for the green checkmark success screen."
        },
        {
            'keywords': ['scam', 'fraud', 'otp', 'fake', 'phishing', 'password'],
            'response': "Protect yourself from scams:\n1. Never share your OTP (One Time Password) with anyone.\n2. Avoid clicking links in SMS that promise lottery prizes or cashbacks.\n3. If a caller claims they are from your bank and asks for your PIN/OTP, hang up immediately.\n4. Enable Two-Factor Authentication on accounts where possible."
        },
        {
            'keywords': ['digilocker', 'aadhaar', 'pan', 'government', 'documents'],
            'response': "DigiLocker is a digital wallet for government documents:\n1. Download DigiLocker from Play Store or visit digilocker.gov.in.\n2. Register using your Aadhaar number and OTP verification.\n3. Go to 'Issued Documents' to search and retrieve your Aadhaar, PAN Card, Driving License, or Marksheets.\n4. These digital documents are legally valid everywhere, just like physical copies."
        },
        {
            'keywords': ['call', 'contact', 'save', 'phone'],
            'response': "How to save a Contact:\n1. Open your Phone/Contacts app.\n2. Tap the '+' plus icon (Add Contact).\n3. Type their First Name, Last Name, and Mobile Number.\n4. Tap 'Save' at the top right.\n5. To call them, search their name in your Contacts list and tap the call button."
        }
    ],
    'ta': [
        {
            'keywords': ['வாட்ஸ்அப்', 'செய்தி', 'வீடியோ கால்', 'அரட்டை', 'whatsapp'],
            'response': "வாட்ஸ்அப் எவ்வாறு பயன்படுத்துவது:\n1. உங்கள் திரையில் இருந்து வாட்ஸ்அப்பைத் திறக்கவும்.\n2. கீழே வலதுபுறத்தில் உள்ள 'சேட்' (Chat) ஐகானைத் தட்டவும்.\n3. உங்கள் தொடர்பைத் தேடி, அவர் பெயரைத் தட்டவும்.\n4. செய்தியை தட்டச்சு செய்து பச்சை நிற அனுப்பும் அம்பு குறியை அழுத்தவும்!\n5. அழைக்க: சேட் பக்கத்தின் மேல் வலதுபுறத்தில் உள்ள கேமரா அல்லது போன் ஐகானைத் தட்டவும்."
        },
        {
            'keywords': ['யுபிஐ', 'பணம்', 'கட்டணம்', 'ஜிபே', 'போன்பே', 'upi', 'qr'],
            'response': "UPI ஐப் பாதுகாப்பாகப் பயன்படுத்தும் வழிமுறைகள்:\n1. உங்கள் கட்டண செயலியைத் திறக்கவும் (Google Pay, PhonePe, Paytm).\n2. வணிகரின் QR குறியீட்டை ஸ்கேன் செய்ய 'Scan QR' என்பதைத் தட்டவும்.\n3. பெறுநரின் பெயர் திரையில் சரியாகக் காட்டப்படுகிறதா என்பதைச் சரிபார்க்கவும்.\n4. அனுப்ப வேண்டிய தொகையை உள்ளிடவும்.\n5. உங்கள் UPI PIN-ஐ உள்ளிடவும் (இதை யாரிடமும் பகிர்ந்து கொள்ளக் கூடாது).\n6. பணம் வெற்றிகரமாக அனுப்பப்பட்டதற்கான பச்சை குறியீட்டை சரிபார்க்கவும்."
        },
        {
            'keywords': ['ஏமாற்று', 'மோசடி', 'ஓடிபி', 'கடவுச்சொல்', 'otp', 'scam'],
            'response': "மோசடிகளிலிருந்து உங்களைப் பாதுகாத்துக் கொள்ள:\n1. உங்கள் OTP-ஐ (ஒரு முறை கடவுச்சொல்) யாரிடமும் பகிர்ந்து கொள்ளாதீர்கள்.\n2. பரிசுப் போட்டிகள் என்று வரும் SMS இணைப்புகளைக் கிளிக் செய்யாதீர்கள்.\n3. வங்கி அதிகாரி என்று பேசினாலும், உங்கள் பின் அல்லது OTP-ஐக் கேட்டால் அழைப்பைத் துண்டிக்கவும்.\n4. உங்கள் கணக்குகளுக்கு வலுவான கடவுச்சொற்களைப் பயன்படுத்தவும்."
        },
        {
            'keywords': ['டிஜிலாக்கர்', 'ஆதார்', 'பான்', 'அரசு', 'சான்றிதழ்', 'digilocker'],
            'response': "டிஜிலாக்கர் (DigiLocker) என்பது அரசு ஆவணங்களைச் சேமிக்கும் டிஜிட்டல் பெட்டகமாகும்:\n1. Play Store-லிருந்து DigiLocker செயலியைப் பதிவிறக்கவும்.\n2. உங்கள் ஆதார் எண் மற்றும் OTP மூலம் பதிவு செய்யவும்.\n3. 'Issued Documents' பகுதிக்குச் சென்று உங்கள் ஆதார், பான் கார்டு அல்லது ஓட்டுநர் உரிமத்தைத் தேடிப் பதிவிறக்கவும்.\n4. இந்த டிஜிட்டல் ஆவணங்கள் அசல் நகல்களைப் போலவே சட்டப்பூர்வமாகச் செல்லுபடியாகும்."
        },
        {
            'keywords': ['அழைப்பு', 'தொடர்பு', 'சேமி', 'போன்', 'contact'],
            'response': "புதிய தொடர்பைச் சேமிப்பது எப்படி:\n1. உங்கள் போன்/காண்டாக்ட் செயலியைத் திறக்கவும்.\n2. '+' குறியீட்டைத் (Add Contact) தட்டவும்.\n3. அவர்களின் பெயர் மற்றும் மொபைல் எண்ணை உள்ளிடவும்.\n4. மேலே உள்ள 'Save' என்பதைத் தட்டவும்.\n5. அவர்களை அழைக்க, தொடர்புகள் பட்டியலில் தேடி கால் பட்டனைத் தட்டவும்."
        }
    ]
}

DEFAULT_RESPONSES = {
    'en': "I am here to help you learn digital skills! You can ask me about using WhatsApp, Google Search, sending emails, UPI payments, DigiLocker, Aadhaar, or cyber safety scams.",
    'ta': "டிஜிட்டல் திறன்களைக் கற்றுக்கொள்ள நான் உங்களுக்கு உதவுவேன்! வாட்ஸ்அப், கூகுள் தேடல், மின்னஞ்சல், யுபிஐ கட்டணங்கள், டிஜிலாக்கர், ஆதார் அல்லது சைபர் பாதுகாப்பு குறித்து நீங்கள் என்னிடம் கேட்கலாம்."
}

@chatbot_bp.route('/chat', methods=['POST'])
@token_required
def chat(current_user):
    data = request.get_json()
    if not data or not data.get('message'):
        return jsonify({'message': 'Message is required!'}), 400
        
    user_msg = data['message'].lower()
    lang = data.get('lang', current_user.preferred_language)
    
    # 1. Try OpenAI if configured
    if openai_client:
        try:
            system_prompt = (
                "You are an assistant for the Digital Literacy Hub, designed for senior citizens, rural citizens, "
                "and first-time smartphone users. Answer questions simply and clearly using bullet points and numbered steps. "
                "Do not use complex technical jargon. Keep answers encouraging and patient. "
                f"Support user language preferences. Current language: {'Tamil' if lang == 'ta' else 'English'}."
            )
            
            response = openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_msg}
                ],
                max_tokens=300
            )
            reply = response.choices[0].message.content
            return jsonify({'reply': reply}), 200
        except Exception as e:
            print(f"OpenAI completion error: {e}. Falling back to knowledge base.")
            
    # 2. Offline semantic rules-based system fallback
    lang_key = 'ta' if lang == 'ta' else 'en'
    rules = KNOWLEDGE_BASE[lang_key]
    
    reply = None
    for rule in rules:
        if any(keyword in user_msg for keyword in rule['keywords']):
            reply = rule['response']
            break
            
    if not reply:
        reply = DEFAULT_RESPONSES[lang_key]
        
    return jsonify({'reply': reply}), 200
