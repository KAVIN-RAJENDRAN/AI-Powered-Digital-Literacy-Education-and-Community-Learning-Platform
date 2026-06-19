-- MySQL Schema for Digital Literacy Hub Database
CREATE DATABASE IF NOT EXISTS digital_literacy_db;
USE digital_literacy_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user', -- 'user' or 'admin'
    preferred_language VARCHAR(10) DEFAULT 'en', -- 'en' or 'ta'
    streak_count INT DEFAULT 0,
    last_active_date DATE DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Courses/Modules Table
CREATE TABLE IF NOT EXISTS modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_ta VARCHAR(255) NOT NULL,
    description_en TEXT NOT NULL,
    description_ta TEXT NOT NULL,
    icon VARCHAR(50) DEFAULT 'BookOpen',
    estimated_time INT DEFAULT 15, -- minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Topics Table (Within Modules)
CREATE TABLE IF NOT EXISTS topics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    module_id INT NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_ta VARCHAR(255) NOT NULL,
    content_en TEXT NOT NULL,
    content_ta TEXT NOT NULL,
    step_number INT NOT NULL,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- 4. User Progress Table
CREATE TABLE IF NOT EXISTS progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    module_id INT NOT NULL,
    completed_topics_json TEXT, -- array of completed topic IDs
    is_completed BOOLEAN DEFAULT FALSE,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
    UNIQUE KEY user_module_unique (user_id, module_id)
);

-- 5. Quizzes Table
CREATE TABLE IF NOT EXISTS quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    module_id INT NOT NULL,
    question_en TEXT NOT NULL,
    question_ta TEXT NOT NULL,
    options_en TEXT NOT NULL, -- JSON array of options
    options_ta TEXT NOT NULL, -- JSON array of options
    correct_option_index INT NOT NULL,
    explanation_en TEXT,
    explanation_ta TEXT,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- 6. Quiz Attempts Table
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    module_id INT NOT NULL,
    score DECIMAL(5,2) NOT NULL, -- percentage
    passed BOOLEAN NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- 7. Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    certificate_uuid VARCHAR(100) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    module_id INT NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pdf_url VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
    UNIQUE KEY user_module_cert_unique (user_id, module_id)
);

-- 8. Simulator Scenarios Table
CREATE TABLE IF NOT EXISTS safety_scenarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- 'sms', 'email', 'call', 'payment'
    title_en VARCHAR(255) NOT NULL,
    title_ta VARCHAR(255) NOT NULL,
    content_en TEXT NOT NULL,
    content_ta TEXT NOT NULL,
    is_safe BOOLEAN NOT NULL,
    clues_en TEXT NOT NULL, -- JSON array of warnings
    clues_ta TEXT NOT NULL, -- JSON array of warnings
    explanation_en TEXT NOT NULL,
    explanation_ta TEXT NOT NULL
);

-- Insert Mock/Base Module Data
INSERT INTO modules (id, title_en, title_ta, description_en, description_ta, icon, estimated_time) VALUES
(1, 'Smartphone Basics', 'ஸ்மார்ட்போன் அடிப்படைகள்', 'Learn to make calls, save contacts, use the camera, and WhatsApp.', 'அழைப்புகள் செய்ய, தொடர்புகளை சேமிக்க, கேமராவைப் பயன்படுத்த மற்றும் வாட்ஸ்அப் பயன்படுத்த கற்றுக்கொள்ளுங்கள்.', 'Smartphone', 15),
(2, 'Internet Basics', 'இணைய அடிப்படைகள்', 'Understand how to browse websites, search Google, and create emails.', 'இணையதளங்களை உலாவுவது, கூகுளில் தேடுவது மற்றும் மின்னஞ்சல்களை உருவாக்குவது எப்படி என்பதைப் புரிந்து கொள்ளுங்கள்.', 'Globe', 20),
(3, 'Digital Payments', 'டிஜிட்டல் கட்டணங்கள்', 'Master UPI, QR code scanning, bank transfers, and safe payment practices.', 'UPI, QR குறியீடு ஸ்கேனிங், வங்கி இடமாற்றங்கள் மற்றும் பாதுகாப்பான கட்டண நடைமுறைகளை மாஸ்டர் செய்யுங்கள்.', 'CreditCard', 25),
(4, 'Government Services', 'அரசு சேவைகள்', 'Learn to access DigiLocker, Aadhaar, PAN, and book railway tickets.', 'டிஜிலாக்கர், ஆதார், பான் மற்றும் ரயில் டிக்கெட் முன்பதிவு செய்வதை கற்றுக்கொள்ளுங்கள்.', 'FileText', 30),
(5, 'Cyber Security', 'சைபர் பாதுகாப்பு', 'Protect yourself from phishing, scams, secure passwords, and keep OTP safe.', 'ஃபிஷிங், மோசடிகள், பாதுகாப்பான கடவுச்சொற்கள் ஆகியவற்றிலிருந்து உங்களைப் பாதுகாத்துக் கொள்ளுங்கள் மற்றும் OTP ஐப் பாதுகாப்பாக வைத்திருங்கள்.', 'ShieldAlert', 20);
