import jwt
import datetime
from flask import Blueprint, request, jsonify
from functools import wraps
from models import db, User, Progress, Module
from config import Config

auth_bp = Blueprint('auth', __name__)

# JWT decorator helper
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing fields!'}), 400
        
    # Check if user already exists
    if User.query.filter_by(username=data['username']).first() or User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Username or Email already registered!'}), 400
        
    user = User(
        username=data['username'],
        email=data['email'],
        role=data.get('role', 'user'),
        preferred_language=data.get('preferred_language', 'en')
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    # Initialize progress for existing modules
    modules = Module.query.all()
    for m in modules:
        progress = Progress(user_id=user.id, module_id=m.id, completed_topics_json='[]')
        db.session.add(progress)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully!'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password!'}), 400
        
    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid email or password!'}), 401
        
    # Handle streak logic
    today = datetime.date.today()
    if user.last_active_date:
        delta = today - user.last_active_date
        if delta.days == 1:
            user.streak_count += 1
        elif delta.days > 1:
            user.streak_count = 1
    else:
        user.streak_count = 1
        
    user.last_active_date = today
    db.session.commit()
    
    # Create JWT token
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, Config.SECRET_KEY, algorithm='HS256')
    
    return jsonify({
        'token': token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify(current_user.to_dict()), 200

@auth_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No data provided'}), 400
        
    if 'preferred_language' in data:
        current_user.preferred_language = data['preferred_language']
        
    if 'username' in data:
        # Check uniqueness if username is changed
        existing = User.query.filter_by(username=data['username']).first()
        if existing and existing.id != current_user.id:
            return jsonify({'message': 'Username already taken!'}), 400
        current_user.username = data['username']
        
    db.session.commit()
    return jsonify(current_user.to_dict()), 200
