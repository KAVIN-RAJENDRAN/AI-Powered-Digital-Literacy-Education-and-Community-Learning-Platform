from flask import Blueprint, request, jsonify
from models import SafetyScenario
from routes.auth import token_required

simulator_bp = Blueprint('simulator', __name__)

@simulator_bp.route('/scenarios', methods=['GET'])
@token_required
def get_scenarios(current_user):
    lang = request.args.get('lang', current_user.preferred_language)
    scenarios = SafetyScenario.query.all()
    
    # If no scenarios in DB, return static initial data
    if not scenarios:
        # Fallback to high-quality simulated scenarios to ensure stability
        scenarios_data = [
            {
                "id": 1,
                "type": "sms",
                "title": "Lottery Win SMS" if lang == 'en' else "பரிசு வென்ற SMS",
                "content": "CONGRATULATIONS! You have won a cash lottery of Rs. 10 Lakhs. Click this link: http://win-lott-secure.in/claim to claim your prize immediately!" if lang == 'en' else "வாழ்த்துகள்! நீங்கள் ரூ. 10 லட்சம் பரிசுப் போட்டியில் வென்றுள்ளீர்கள். உங்கள் பரிசை உடனடியாகப் பெற இந்த இணைப்பைக் கிளிக் செய்க: http://win-lott-secure.in/claim",
                "is_safe": False,
                "clues": [
                    "Check the link domain: win-lott-secure.in is not an official government or secure URL.",
                    "Urgency alert: 'claim immediately' is a common psychological pressure tactic used by scammers.",
                    "Grammar & style: Random capitalizations like CONGRATULATIONS!"
                ] if lang == 'en' else [
                    "இணைப்பு டொமைனைச் சரிபார்க்கவும்: win-lott-secure.in என்பது அதிகாரப்பூர்வ அரசு தளம் அல்ல.",
                    "அவசரம்: 'உடனடியாகப் பெறவும்' என்பது மோசடி செய்பவர்கள் பயன்படுத்தும் ஒரு பொதுவான தந்திரமாகும்.",
                    "அதிகப்படியான வாழ்த்துகள் மற்றும் நம்ப முடியாத அளவுக்குப் பெரிய தொகை."
                ],
                "explanation": "Official banks, government departments, and reputed corporations never ask you to click unofficial links to claim random prizes. Never share personal details." if lang == 'en' else "அதிகாரப்பூர்வ வங்கிகள், அரசுத் துறைகள் அல்லது புகழ்பெற்ற நிறுவனங்கள் ஒருபோதும் சீரற்ற பரிசுகளைப் பெற அதிகாரப்பூர்வமற்ற இணைப்புகளைக் கிளிக் செய்யுமாறு கேட்காது."
            },
            {
                "id": 2,
                "type": "email",
                "title": "Urgent Bank Account Suspension" if lang == 'en' else "வங்கி கணக்கு முடக்கம் எச்சரிக்கை",
                "content": "Dear Customer, Your account status has been flagged for suspicious activities. To prevent permanent suspension, update your KYC details within 24 hours at http://hdlf-bank-kyc-status.net.",
                "is_safe": False,
                "clues": [
                    "Sender check: Look at the domain name hdlf-bank-kyc-status.net. Official banking websites use official secure domains (e.g. .com or bank official domain).",
                    "Generic greeting: 'Dear Customer' instead of your actual name.",
                    "Suspension threat: Creating fear to make you act quickly."
                ] if lang == 'en' else [
                    "அனுப்புநரைச் சரிபார்க்கவும்: hdlf-bank-kyc-status.net என்ற டொமைன் பெயர் அசல் வங்கிப் பெயர் அல்ல.",
                    "பொதுவான வாழ்த்து: உங்கள் பெயரைக் குறிப்பிடாமல் 'Dear Customer' என்று கூறுகிறது.",
                    "முடக்கம் அச்சுறுத்தல்: உங்களை விரைவாகச் செயல்பட வைக்க பயத்தை உருவாக்குகிறது."
                ],
                "explanation": "Banks never request sensitive updates, KYC forms, or password changes through links in emails. Always visit the physical bank branch or open the official banking app." if lang == 'en' else "வங்கிகள் ஒருபோதும் மின்னஞ்சல் இணைப்புகள் மூலம் உணர்திறன் மிக்க புதுப்பிப்புகள், KYC படிவங்கள் அல்லது கடவுச்சொல் மாற்றங்களைக் கேட்காது. எப்போதும் அசல் வங்கி கிளைக்குச் செல்லவும்."
            },
            {
                "id": 3,
                "type": "call",
                "title": "Verification OTP Call" if lang == 'en' else "வங்கி சரிபார்ப்பு அழைப்பு",
                "content": "[Voice Call Simulation]: 'Hello, I am calling from State Bank support. Your debit card is expiring today. I have sent an activation code to your mobile. Please read out the 6-digit OTP code to reactivate your card immediately.'",
                "is_safe": False,
                "clues": [
                    "The caller asks for the OTP. OTPs are meant for your eyes only.",
                    "Urgency: 'Expiring today' creates fake urgency.",
                    "Official staff instructions: Official bank messages state 'Do not share your OTP with anyone, including bank staff'."
                ] if lang == 'en' else [
                    "அழைப்பாளர் OTP-ஐக் கேட்கிறார். OTP-க்கள் உங்களைத் தவிர வேறு யாருக்கும் தெரியக் கூடாது.",
                    "அவசரம்: 'இன்றுடன் முடிகிறது' என்பது போலி அவசரத்தை உருவாக்குகிறது.",
                    "அதிகாரப்பூர்வ வங்கி விதிகள்: வங்கி ஊழியர்கள் உட்பட யாரிடமும் OTP-ஐப் பகிர வேண்டாம் என்று வங்கி செய்திகளில் குறிப்பிடப்பட்டிருக்கும்."
                ],
                "explanation": "No bank representative will ever call you to ask for your OTP, PIN, CVV, or passwords. Sharing an OTP gives the caller permission to withdraw money from your account." if lang == 'en' else "எந்தவொரு வங்கிப் பிரதிநிதியும் உங்கள் OTP, PIN, CVV அல்லது கடவுச்சொற்களைக் கேட்க உங்களை ஒருபோதும் அழைக்க மாட்டார்கள். OTP-ஐப் பகிர்வது உங்கள் கணக்கிலிருந்து பணத்தை எடுக்க அழைப்பாளருக்கு அனுமதி அளிக்கிறது."
            },
            {
                "id": 4,
                "type": "payment",
                "title": "UPI Request to Receive Money" if lang == 'en' else "UPI மூலம் பணம் பெறுதல்",
                "content": "[Payment Notification Screen]: 'Requesting Rs. 5,000 from: user_name. Click PAY to receive money in your account.'",
                "is_safe": False,
                "clues": [
                    "Action request: Clicking 'PAY' and entering your PIN will send money, not receive it.",
                    "Text check: You do not need to enter your UPI PIN to receive money. PIN is only for sending money."
                ] if lang == 'en' else [
                    "செயல்: 'PAY' என்பதைக் கிளிக் செய்து உங்கள் PIN-ஐ உள்ளீடு செய்தால் பணம் கழிக்கப்படும், உங்களுக்கு பணம் வராது.",
                    "உண்மைச் சோதனை: பணம் பெறுவதற்கு நீங்கள் ஒருபோதும் UPI PIN-ஐ உள்ளிட வேண்டியதில்லை."
                ],
                "explanation": "Entering a UPI PIN always debits money from your account. Scammers send money requests with high amounts pretending to 'pay' you, but clicking them transfers money to the scammer." if lang == 'en' else "UPI PIN-ஐ உள்ளிடுவது எப்போதும் உங்கள் கணக்கிலிருந்து பணத்தை மட்டுமே கழிக்கும். ஏமாற்றுபவர்கள் உங்களுக்கு பணம் அனுப்புவதாகக் கூறி பணம் கோரும் கோரிக்கைகளை அனுப்புவார்கள்."
            }
        ]
        return jsonify(scenarios_data), 200
        
    return jsonify([s.to_dict(lang=lang) for s in scenarios]), 200
