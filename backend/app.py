import json
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db, User, Module, Topic, Quiz, SafetyScenario

# Blueprints
from routes.auth import auth_bp
from routes.courses import courses_bp
from routes.quizzes import quizzes_bp
from routes.chatbot import chatbot_bp
from routes.simulator import simulator_bp
from routes.admin import admin_bp
from routes.community import community_bp

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for frontend API calls
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Bind DB
db.init_app(app)

# Register routes
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(courses_bp, url_prefix='/api/courses')
app.register_blueprint(quizzes_bp, url_prefix='/api/quizzes')
app.register_blueprint(chatbot_bp, url_prefix='/api/chatbot')
app.register_blueprint(simulator_bp, url_prefix='/api/simulator')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(community_bp, url_prefix='/api/community')

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Digital Literacy Hub API is running!'}), 200

# DB Seeding Function
def seed_database():
    with app.app_context():
        # Create all tables (SQLite/MySQL automatically)
        db.create_all()
        
        # 1. Seed admin and user if not exists
        if not User.query.filter_by(email='admin@dlh.org').first():
            admin = User(username='admin', email='admin@dlh.org', role='admin', preferred_language='en')
            admin.set_password('admin123')
            db.session.add(admin)
            
        if not User.query.filter_by(email='citizen@dlh.org').first():
            citizen = User(username='citizen', email='citizen@dlh.org', role='user', preferred_language='en', streak_count=3)
            citizen.set_password('citizen123')
            db.session.add(citizen)
            
        db.session.commit()
        
        # 2. Seed Modules if empty
        if Module.query.count() == 0:
            modules_data = [
                {
                    "id": 1,
                    "title_en": "Smartphone Basics",
                    "title_ta": "ஸ்மார்ட்போன் அடிப்படைகள்",
                    "description_en": "Learn to make calls, save contacts, use the camera, and WhatsApp.",
                    "description_ta": "அழைப்புகள் செய்ய, தொடர்புகளை சேமிக்க, கேமராவைப் பயன்படுத்த மற்றும் வாட்ஸ்அப் பயன்படுத்த கற்றுக்கொள்ளுங்கள்.",
                    "icon": "Smartphone",
                    "estimated_time": 15
                },
                {
                    "id": 2,
                    "title_en": "Internet Basics",
                    "title_ta": "இணைய அடிப்படைகள்",
                    "description_en": "Understand how to browse websites, search Google, and create emails.",
                    "description_ta": "இணையதளங்களை உலாவுவது, கூகுளில் தேடுவது மற்றும் மின்னஞ்சல்களை உருவாக்குவது எப்படி என்பதைப் புரிந்து கொள்ளுங்கள்.",
                    "icon": "Globe",
                    "estimated_time": 20
                },
                {
                    "id": 3,
                    "title_en": "Digital Payments",
                    "title_ta": "டிஜிட்டல் கட்டணங்கள்",
                    "description_en": "Master UPI, QR code scanning, bank transfers, and safe payment practices.",
                    "description_ta": "UPI, QR குறியீடு ஸ்கேனிங், வங்கி இடமாற்றங்கள் மற்றும் பாதுகாப்பான கட்டண நடைமுறைகளை மாஸ்டர் செய்யுங்கள்.",
                    "icon": "CreditCard",
                    "estimated_time": 25
                },
                {
                    "id": 4,
                    "title_en": "Government Services",
                    "title_ta": "அரசு சேவைகள்",
                    "description_en": "Learn to access DigiLocker, Aadhaar, PAN, and book railway tickets.",
                    "description_ta": "டிஜிலாக்கர், ஆதார், பான் மற்றும் ரயில் டிக்கெட் முன்பதிவு செய்வதை கற்றுக்கொள்ளுங்கள்.",
                    "icon": "FileText",
                    "estimated_time": 30
                },
                {
                    "id": 5,
                    "title_en": "Cyber Security",
                    "title_ta": "சைபர் பாதுகாப்பு",
                    "description_en": "Protect yourself from phishing, scams, secure passwords, and keep OTP safe.",
                    "description_ta": "ஃபிஷிங், மோசடிகள், பாதுகாப்பான கடவுச்சொற்கள் ஆகியவற்றிலிருந்து உங்களைப் பாதுகாத்துக் கொள்ளுங்கள் மற்றும் OTP ஐப் பாதுகாப்பாக வைத்திருங்கள்.",
                    "icon": "ShieldAlert",
                    "estimated_time": 20
                }
            ]
            
            for md in modules_data:
                m = Module(
                    id=md['id'],
                    title_en=md['title_en'],
                    title_ta=md['title_ta'],
                    description_en=md['description_en'],
                    description_ta=md['description_ta'],
                    icon=md['icon'],
                    estimated_time=md['estimated_time']
                )
                db.session.add(m)
            db.session.commit()
            
            # 3. Seed Topics for Smartphone Basics
            topics_data = [
                # Module 1
                {
                    "module_id": 1, "step_number": 1,
                    "title_en": "Making Phone Calls", "title_ta": "தொலைபேசி அழைப்புகளைச் செய்தல்",
                    "content_en": "To make a phone call:\n1. Find and tap the Phone icon (usually green with a receiver).\n2. Use the dial pad to enter the number, or scroll to find a contact.\n3. Tap the green Call button to connect.\n4. To hang up, tap the red End Call button.",
                    "content_ta": "தொலைபேசி அழைப்பை மேற்கொள்ள:\n1. போன் ஐகானைத் (வழக்கமாக ரிசீவர் கொண்ட பச்சை நிற ஐகான்) தட்டி திறக்கவும்.\n2. எண்ணை உள்ளிட கீபேடைப் பயன்படுத்தவும், அல்லது தொடர்பைத் தேர்ந்தெடுக்கவும்.\n3. அழைக்க பச்சை நிற கால் பட்டனைத் தட்டவும்.\n4. அழைப்பைத் துண்டிக்க, சிவப்பு நிற எண்ட் கால் பட்டனைத் தட்டவும்."
                },
                {
                    "module_id": 1, "step_number": 2,
                    "title_en": "Saving Contacts", "title_ta": "தொடர்புகளைச் சேமித்தல்",
                    "content_en": "Saving contacts helps you dial people quickly:\n1. Open the Contacts app.\n2. Tap the '+' button to add a new contact.\n3. Type their name and mobile number.\n4. Tap 'Save' to save the contact in your phone directory.",
                    "content_ta": "தொடர்புகளைச் சேமிப்பது எளிதாக அழைக்க உதவுகிறது:\n1. காண்டாக்ட்ஸ் செயலியைத் திறக்கவும்.\n2. புதிய தொடர்பைச் சேர்க்க '+' பட்டனைத் தட்டவும்.\n3. அவர்களின் பெயர் மற்றும் மொபைல் எண்ணை உள்ளிடவும்.\n4. 'Save' என்பதைத் தட்டி உங்கள் முகவரிப் புத்தகத்தில் சேமிக்கவும்."
                },
                {
                    "module_id": 1, "step_number": 3,
                    "title_en": "Using the Camera", "title_ta": "கேமராவைப் பயன்படுத்துதல்",
                    "content_en": "Capture photos and videos:\n1. Tap the Camera icon.\n2. Hold your phone steady and aim at the subject.\n3. Tap the large white circular button to snap a photo.\n4. Switch to 'Video' mode and tap the red button to record video.",
                    "content_ta": "புகைப்படங்கள் மற்றும் வீடியோக்களைப் பிடிக்க:\n1. கேமரா ஐகானைத் தட்டவும்.\n2. போனை அசையாமல் பிடித்து, எடுக்க வேண்டிய பொருளின் மீது குறிவைக்கவும்.\n3. புகைப்படம் எடுக்க பெரிய வெள்ளை வட்ட பொத்தானைத் தட்டவும்.\n4. வீடியோ பதிவு செய்ய 'Video' மோடுக்கு மாறி சிவப்பு பொத்தானைத் தட்டவும்."
                },
                {
                    "module_id": 1, "step_number": 4,
                    "title_en": "Getting Started with WhatsApp", "title_ta": "வாட்ஸ்அப் அறிமுகம்",
                    "content_en": "Connect with friends and family:\n1. Open WhatsApp.\n2. Select a contact from your list.\n3. Type your text message in the chat box and tap the green arrow to send.\n4. Use the paperclip icon to attach images or documents.",
                    "content_ta": "நண்பர்கள் மற்றும் குடும்பத்தினருடன் இணையுங்கள்:\n1. வாட்ஸ்அப்பைத் திறக்கவும்.\n2. உங்கள் பட்டியலில் இருந்து ஒரு தொடர்பைத் தேர்ந்தெடுக்கவும்.\n3. சேட் பாக்ஸில் உங்கள் செய்தியைத் தட்டச்சு செய்து அனுப்ப பச்சை அம்புக்குறியைத் தட்டவும்.\n4. படங்களை அல்லது ஆவணங்களை இணைக்க பேப்பர் கிளிப் ஐகானைப் பயன்படுத்தவும்."
                },
                # Module 2
                {
                    "module_id": 2, "step_number": 1,
                    "title_en": "Browsing Websites", "title_ta": "இணையதளங்களை உலாவுதல்",
                    "content_en": "Access the world wide web:\n1. Open Google Chrome or any browser.\n2. Tap the Address bar at the top.\n3. Type the address of the website (e.g. www.tn.gov.in) and press Enter.\n4. Scroll up and down to read contents; tap links to navigate.",
                    "content_ta": "இணையத்தை அணுகுவதற்கு:\n1. கூகிள் குரோம் அல்லது ஏதேனும் பிரவுசரைத் திறக்கவும்.\n2. மேலே உள்ள முகவரிப் பட்டியைத் (Address bar) தட்டவும்.\n3. இணையதள முகவரியை (எ.கா. www.tn.gov.in) உள்ளிட்டு என்டர் அழுத்தவும்.\n4. உள்ளடக்கங்களைப் படிக்க மேலும் கீழும் நகர்த்தவும்; புதிய பக்கத்திற்குச் செல்ல இணைப்புகளைத் தட்டவும்."
                },
                # Module 3
                {
                    "module_id": 3, "step_number": 1,
                    "title_en": "Introduction to UPI", "title_ta": "UPI அறிமுகம்",
                    "content_en": "Unified Payments Interface allows instant transfers:\n1. Set up a secure payment app like BHIM, Google Pay, or PhonePe linking your bank account.\n2. Create a secure 4 or 6 digit UPI PIN.\n3. Transfer money by scanning a QR code or entering a receiver's mobile/UPI ID.",
                    "content_ta": "UPI என்பது உடனடி பணப் பரிமாற்றத்தை அனுமதிக்கிறது:\n1. உங்கள் வங்கி கணக்கை இணைத்து BHIM, Google Pay அல்லது PhonePe போன்ற செயலியை நிறுவவும்.\n2. பாதுகாப்பான 4 அல்லது 6 இலக்க UPI PIN-ஐ உருவாக்கவும்.\n3. QR குறியீட்டை ஸ்கேன் செய்தோ அல்லது மொபைல் எண்/UPI முகவரியை உள்ளிட்டோ பணம் அனுப்பலாம்."
                }
            ]
            
            for td in topics_data:
                t = Topic(
                    module_id=td['module_id'],
                    step_number=td['step_number'],
                    title_en=td['title_en'],
                    title_ta=td['title_ta'],
                    content_en=td['content_en'],
                    content_ta=td['content_ta']
                )
                db.session.add(t)
            db.session.commit()
            
            # 4. Seed Quizzes
            quizzes_data = [
                {
                    "module_id": 1,
                    "question_en": "Which button do you press to make a phone call after entering a number?",
                    "question_ta": "தொலைபேசி எண்ணை உள்ளிட்ட பிறகு அழைக்க எந்த பொத்தானை அழுத்த வேண்டும்?",
                    "options_en": ["Red End Button", "Green Call Button", "Camera Icon", "Volume Up Button"],
                    "options_ta": ["சிவப்பு எண்ட் பொத்தான்", "பச்சை கால் பொத்தான்", "கேமரா ஐகான்", "ஒலி கூட்டல் பொத்தான்"],
                    "correct_option_index": 1,
                    "explanation_en": "The green button represents taking a call or making a phone call.",
                    "explanation_ta": "பச்சை பொத்தான் அழைப்பை ஏற்க அல்லது புதிய அழைப்பைத் தொடங்கப் பயன்படுகிறது."
                },
                {
                    "module_id": 1,
                    "question_en": "What is the primary function of WhatsApp?",
                    "question_ta": "வாட்ஸ்அப்பின் முதன்மை செயல்பாடு என்ன?",
                    "options_en": ["Calculator", "Playing games", "Sending text messages and making video calls", "Booking train tickets"],
                    "options_ta": ["கால்குலேட்டர்", "விளையாடுவது", "செய்திகள் அனுப்புவது மற்றும் வீடியோ அழைப்புகள் செய்வது", "ரயில் டிக்கெட் முன்பதிவு"],
                    "correct_option_index": 2,
                    "explanation_en": "WhatsApp is a messaging app used to exchange texts, voice messages, images, and video calls.",
                    "explanation_ta": "வாட்ஸ்அப் என்பது செய்திகள், குரல் பதிவுகள், படங்கள் மற்றும் வீடியோ கால்களைப் பகிர்ந்து கொள்ளும் ஒரு செயலியாகும்."
                },
                {
                    "module_id": 3,
                    "question_en": "When should you share your secure UPI PIN with someone?",
                    "question_ta": "உங்களது பாதுகாப்பான UPI PIN-ஐ எப்போது மற்றவர்களுடன் பகிர்ந்து கொள்ளலாம்?",
                    "options_en": ["When bank staff calls and requests it", "When a relative claims it is urgent", "Never, it should be kept secret", "To claim cashback prizes"],
                    "options_ta": ["வங்கி ஊழியர் அழைத்து கேட்கும்போது", "உறவினர்கள் அவசரம் என்று கூறும்போது", "ஒருபோதும் கூடாது, இரகசியமாக வைக்க வேண்டும்", "பரிசுப் பணத்தைப் பெறும்போது"],
                    "correct_option_index": 2,
                    "explanation_en": "Your UPI PIN is highly confidential. Banks or payment operators will never ask for it. Keep it secret to prevent fraud.",
                    "explanation_ta": "உங்கள் UPI PIN மிகவும் இரகசியமானது. வங்கிகள் ஒருபோதும் இதைக் கேட்காது. மோசடிகளைத் தடுக்க இதை எப்போதும் ரகசியமாக வைக்கவும்."
                }
            ]
            
            for qd in quizzes_data:
                q = Quiz(
                    module_id=qd['module_id'],
                    question_en=qd['question_en'],
                    question_ta=qd['question_ta'],
                    correct_option_index=qd['correct_option_index'],
                    explanation_en=qd['explanation_en'],
                    explanation_ta=qd['explanation_ta']
                )
                q.set_options(qd['options_en'], lang='en')
                q.set_options(qd['options_ta'], lang='ta')
                db.session.add(q)
            db.session.commit()
            
            # 5. Seed Safety Scenarios
            scenarios = [
                {
                    "type": "sms",
                    "title_en": "Lottery Win SMS",
                    "title_ta": "பரிசு வென்ற SMS",
                    "content_en": "CONGRATULATIONS! You have won a cash lottery of Rs. 10 Lakhs. Click this link: http://win-lott-secure.in/claim to claim your prize immediately!",
                    "content_ta": "வாழ்த்துகள்! நீங்கள் ரூ. 10 லட்சம் பரிசுப் போட்டியில் வென்றுள்ளீர்கள். உங்கள் பரிசை உடனடியாகப் பெற இந்த இணைப்பைக் கிளிக் செய்க: http://win-lott-secure.in/claim",
                    "is_safe": False,
                    "clues_en": ["win-lott-secure.in is not official", "Creates emergency pressure"],
                    "clues_ta": ["win-lott-secure.in அதிகாரப்பூர்வ தளம் அல்ல", "அவசரப்படுத்துகிறது"],
                    "explanation_en": "Official institutions never request you to click links to claim random prizes.",
                    "explanation_ta": "அதிகாரப்பூர்வ நிறுவனங்கள் ஒருபோதும் சீரற்ற பரிசுகளைப் பெற இணைப்புகளைக் கிளிக் செய்யுமாறு கேட்காது."
                }
            ]
            
            for s in scenarios:
                ss = SafetyScenario(
                    type=s['type'],
                    title_en=s['title_en'],
                    title_ta=s['title_ta'],
                    content_en=s['content_en'],
                    content_ta=s['content_ta'],
                    is_safe=s['is_safe'],
                    explanation_en=s['explanation_en'],
                    explanation_ta=s['explanation_ta']
                )
                ss.set_clues(s['clues_en'], lang='en')
                ss.set_clues(s['clues_ta'], lang='ta')
                db.session.add(ss)
            db.session.commit()

# Trigger DB initialization
seed_database()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
