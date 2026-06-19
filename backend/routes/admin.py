from flask import Blueprint, request, jsonify
from models import db, User, Module, Progress, QuizAttempt, Certificate
from routes.auth import token_required

admin_bp = Blueprint('admin', __name__)

from functools import wraps

def admin_required(f):
    @wraps(f)
    @token_required
    def decorated(current_user, *args, **kwargs):
        if current_user.role != 'admin':
            return jsonify({'message': 'Admin privilege required!'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_admin_stats(current_user):
    total_users = User.query.filter_by(role='user').count()
    total_admins = User.query.filter_by(role='admin').count()
    total_modules = Module.query.count()
    
    # Calculate completions
    completions = Progress.query.filter_by(is_completed=True).count()
    certificates_issued = Certificate.query.count()
    
    # Pass rate
    attempts = QuizAttempt.query.all()
    total_attempts = len(attempts)
    passed_attempts = sum(1 for a in attempts if a.passed)
    pass_rate = (passed_attempts / total_attempts * 100) if total_attempts > 0 else 0
    
    # Course-wise statistics
    modules = Module.query.all()
    course_stats = []
    for m in modules:
        m_completions = Progress.query.filter_by(module_id=m.id, is_completed=True).count()
        m_attempts = QuizAttempt.query.filter_by(module_id=m.id).all()
        m_total = len(m_attempts)
        m_passed = sum(1 for a in m_attempts if a.passed)
        m_pass_rate = (m_passed / m_total * 100) if m_total > 0 else 0
        
        course_stats.append({
            'module_id': m.id,
            'title': m.title_en,
            'completions': m_completions,
            'pass_rate': round(m_pass_rate, 2),
            'total_attempts': m_total
        })

    return jsonify({
        'total_users': total_users,
        'total_admins': total_admins,
        'total_modules': total_modules,
        'courses_completed': completions,
        'certificates_issued': certificates_issued,
        'quiz_pass_percentage': round(pass_rate, 2),
        'course_stats': course_stats
    }), 200

@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users(current_user):
    users = User.query.filter_by(role='user').all()
    result = []
    
    for u in users:
        u_dict = u.to_dict()
        # Add their overall progress
        total_modules = Module.query.count()
        completions = Progress.query.filter_by(user_id=u.id, is_completed=True).count()
        u_dict['completed_courses'] = completions
        u_dict['total_courses'] = total_modules
        u_dict['certificates_count'] = Certificate.query.filter_by(user_id=u.id).count()
        
        result.append(u_dict)
        
    return jsonify(result), 200

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(current_user, user_id):
    user = User.query.get_or_404(user_id)
    if user.role == 'admin':
        return jsonify({'message': 'Cannot delete administrative account.'}), 400
        
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': f'User {user.username} deleted successfully.'}), 200

@admin_bp.route('/courses', methods=['POST'])
@admin_required
def create_course(current_user):
    data = request.get_json()
    if not data or not data.get('title_en') or not data.get('description_en'):
        return jsonify({'message': 'Missing course details!'}), 400
        
    m = Module(
        title_en=data['title_en'],
        title_ta=data.get('title_ta', data['title_en']),
        description_en=data['description_en'],
        description_ta=data.get('description_ta', data['description_en']),
        icon=data.get('icon', 'BookOpen'),
        estimated_time=data.get('estimated_time', 15)
    )
    db.session.add(m)
    db.session.commit()
    
    # Populate progress tracking for all existing users
    users = User.query.all()
    for u in users:
        prog = Progress(user_id=u.id, module_id=m.id, completed_topics_json='[]')
        db.session.add(prog)
    db.session.commit()
    
    return jsonify({'message': 'Course module created successfully!', 'course_id': m.id}), 201

@admin_bp.route('/courses/<int:module_id>', methods=['DELETE'])
@admin_required
def delete_course(current_user, module_id):
    module = Module.query.get_or_404(module_id)
    db.session.delete(module)
    db.session.commit()
    return jsonify({'message': f'Course module {module.title_en} deleted successfully.'}), 200
