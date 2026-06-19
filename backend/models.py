import json
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='user') # 'user' or 'admin'
    preferred_language = db.Column(db.String(10), default='en') # 'en' or 'ta'
    streak_count = db.Column(db.Integer, default=0)
    last_active_date = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    progress_records = db.relationship('Progress', backref='user', lazy=True, cascade="all, delete-orphan")
    quiz_attempts = db.relationship('QuizAttempt', backref='user', lazy=True, cascade="all, delete-orphan")
    certificates = db.relationship('Certificate', backref='user', lazy=True, cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'preferred_language': self.preferred_language,
            'streak_count': self.streak_count,
            'last_active_date': self.last_active_date.isoformat() if self.last_active_date else None,
            'created_at': self.created_at.isoformat()
        }


class Module(db.Model):
    __tablename__ = 'modules'
    
    id = db.Column(db.Integer, primary_key=True)
    title_en = db.Column(db.String(255), nullable=False)
    title_ta = db.Column(db.String(255), nullable=False)
    description_en = db.Column(db.Text, nullable=False)
    description_ta = db.Column(db.Text, nullable=False)
    icon = db.Column(db.String(50), default='BookOpen')
    estimated_time = db.Column(db.Integer, default=15) # minutes
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    topics = db.relationship('Topic', backref='module', lazy=True, cascade="all, delete-orphan")
    quizzes = db.relationship('Quiz', backref='module', lazy=True, cascade="all, delete-orphan")
    progress_records = db.relationship('Progress', backref='module', lazy=True, cascade="all, delete-orphan")
    quiz_attempts = db.relationship('QuizAttempt', backref='module', lazy=True, cascade="all, delete-orphan")
    certificates = db.relationship('Certificate', backref='module', lazy=True, cascade="all, delete-orphan")

    def to_dict(self, lang='en'):
        return {
            'id': self.id,
            'title': self.title_en if lang == 'en' else self.title_ta,
            'description': self.description_en if lang == 'en' else self.description_ta,
            'icon': self.icon,
            'estimated_time': self.estimated_time,
            'topics_count': len(self.topics)
        }


class Topic(db.Model):
    __tablename__ = 'topics'
    
    id = db.Column(db.Integer, primary_key=True)
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=False)
    title_en = db.Column(db.String(255), nullable=False)
    title_ta = db.Column(db.String(255), nullable=False)
    content_en = db.Column(db.Text, nullable=False)
    content_ta = db.Column(db.Text, nullable=False)
    step_number = db.Column(db.Integer, nullable=False)

    def to_dict(self, lang='en'):
        return {
            'id': self.id,
            'module_id': self.module_id,
            'title': self.title_en if lang == 'en' else self.title_ta,
            'content': self.content_en if lang == 'en' else self.content_ta,
            'step_number': self.step_number
        }


class Progress(db.Model):
    __tablename__ = 'progress'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=False)
    completed_topics_json = db.Column(db.Text, default='[]') # JSON list of topic_ids completed
    is_completed = db.Column(db.Boolean, default=False)
    last_accessed = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (db.UniqueConstraint('user_id', 'module_id', name='user_module_unique'),)

    def get_completed_topics(self):
        try:
            return json.loads(self.completed_topics_json)
        except Exception:
            return []

    def set_completed_topics(self, topic_ids):
        self.completed_topics_json = json.dumps(topic_ids)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'module_id': self.module_id,
            'completed_topics': self.get_completed_topics(),
            'is_completed': self.is_completed,
            'last_accessed': self.last_accessed.isoformat()
        }


class Quiz(db.Model):
    __tablename__ = 'quizzes'
    
    id = db.Column(db.Integer, primary_key=True)
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=False)
    question_en = db.Column(db.Text, nullable=False)
    question_ta = db.Column(db.Text, nullable=False)
    options_en = db.Column(db.Text, nullable=False) # JSON list of options
    options_ta = db.Column(db.Text, nullable=False) # JSON list of options
    correct_option_index = db.Column(db.Integer, nullable=False)
    explanation_en = db.Column(db.Text, nullable=True)
    explanation_ta = db.Column(db.Text, nullable=True)

    def get_options(self, lang='en'):
        try:
            return json.loads(self.options_en if lang == 'en' else self.options_ta)
        except Exception:
            return []

    def set_options(self, options_list, lang='en'):
        if lang == 'en':
            self.options_en = json.dumps(options_list)
        else:
            self.options_ta = json.dumps(options_list)

    def to_dict(self, lang='en'):
        return {
            'id': self.id,
            'module_id': self.module_id,
            'question': self.question_en if lang == 'en' else self.question_ta,
            'options': self.get_options(lang),
            'correct_option_index': self.correct_option_index,
            'explanation': self.explanation_en if lang == 'en' else self.explanation_ta
        }


class QuizAttempt(db.Model):
    __tablename__ = 'quiz_attempts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=False)
    score = db.Column(db.Numeric(5,2), nullable=False) # percentage, e.g. 85.50
    passed = db.Column(db.Boolean, nullable=False)
    attempted_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'module_id': self.module_id,
            'score': float(self.score),
            'passed': self.passed,
            'attempted_at': self.attempted_at.isoformat()
        }


class Certificate(db.Model):
    __tablename__ = 'certificates'
    
    id = db.Column(db.Integer, primary_key=True)
    certificate_uuid = db.Column(db.String(100), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=False)
    issued_at = db.Column(db.DateTime, default=datetime.utcnow)
    pdf_url = db.Column(db.String(255), nullable=True)

    __table_args__ = (db.UniqueConstraint('user_id', 'module_id', name='user_module_cert_unique'),)

    def to_dict(self):
        return {
            'id': self.id,
            'certificate_uuid': self.certificate_uuid,
            'user_id': self.user_id,
            'module_id': self.module_id,
            'issued_at': self.issued_at.isoformat(),
            'pdf_url': self.pdf_url
        }


class SafetyScenario(db.Model):
    __tablename__ = 'safety_scenarios'
    
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False) # 'sms', 'email', 'call', 'payment'
    title_en = db.Column(db.String(255), nullable=False)
    title_ta = db.Column(db.String(255), nullable=False)
    content_en = db.Column(db.Text, nullable=False)
    content_ta = db.Column(db.Text, nullable=False)
    is_safe = db.Column(db.Boolean, nullable=False)
    clues_en = db.Column(db.Text, nullable=False) # JSON list of string clues
    clues_ta = db.Column(db.Text, nullable=False) # JSON list of string clues
    explanation_en = db.Column(db.Text, nullable=False)
    explanation_ta = db.Column(db.Text, nullable=False)

    def get_clues(self, lang='en'):
        try:
            return json.loads(self.clues_en if lang == 'en' else self.clues_ta)
        except Exception:
            return []

    def set_clues(self, clues_list, lang='en'):
        if lang == 'en':
            self.clues_en = json.dumps(clues_list)
        else:
            self.clues_ta = json.dumps(clues_list)

    def to_dict(self, lang='en'):
        return {
            'id': self.id,
            'type': self.type,
            'title': self.title_en if lang == 'en' else self.title_ta,
            'content': self.content_en if lang == 'en' else self.content_ta,
            'is_safe': self.is_safe,
            'clues': self.get_clues(lang),
            'explanation': self.explanation_en if lang == 'en' else self.explanation_ta
        }
