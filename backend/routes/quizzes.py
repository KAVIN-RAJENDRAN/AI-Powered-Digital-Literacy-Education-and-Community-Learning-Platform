import uuid
from flask import Blueprint, request, jsonify
from models import db, Quiz, QuizAttempt, Certificate, Module
from routes.auth import token_required

quizzes_bp = Blueprint('quizzes', __name__)

@quizzes_bp.route('/<int:module_id>', methods=['GET'])
@token_required
def get_quiz(current_user, module_id):
    lang = request.args.get('lang', current_user.preferred_language)
    quizzes = Quiz.query.filter_by(module_id=module_id).all()
    
    if not quizzes:
        return jsonify({'message': 'No quiz found for this module.'}), 404
        
    return jsonify([q.to_dict(lang=lang) for q in quizzes]), 200

@quizzes_bp.route('/<int:module_id>/submit', methods=['POST'])
@token_required
def submit_quiz(current_user, module_id):
    data = request.get_json()
    if not data or 'answers' not in data:
        return jsonify({'message': 'Answers are required!'}), 400
        
    user_answers = data['answers'] # Dictionary mapping quiz_id -> selected_option_index
    quizzes = Quiz.query.filter_by(module_id=module_id).all()
    
    if not quizzes:
        return jsonify({'message': 'No quiz found for this module.'}), 404
        
    correct_count = 0
    total_questions = len(quizzes)
    feedback = []
    
    for q in quizzes:
        q_id_str = str(q.id)
        selected_idx = user_answers.get(q_id_str)
        is_correct = False
        
        # If user answered, check correctness
        if selected_idx is not None and int(selected_idx) == q.correct_option_index:
            correct_count += 1
            is_correct = True
            
        feedback.append({
            'quiz_id': q.id,
            'question': q.question_en if current_user.preferred_language == 'en' else q.question_ta,
            'correct_option_index': q.correct_option_index,
            'selected_option_index': selected_idx,
            'is_correct': is_correct,
            'explanation': q.explanation_en if current_user.preferred_language == 'en' else q.explanation_ta
        })
        
    score_percentage = (correct_count / total_questions) * 100 if total_questions > 0 else 0
    passed = score_percentage >= 80.0
    
    # Save attempt
    attempt = QuizAttempt(
        user_id=current_user.id,
        module_id=module_id,
        score=score_percentage,
        passed=passed
    )
    db.session.add(attempt)
    db.session.commit()
    
    certificate_issued = False
    certificate_id = None
    
    # Generate certificate if passed
    if passed:
        existing_cert = Certificate.query.filter_by(user_id=current_user.id, module_id=module_id).first()
        if not existing_cert:
            new_uuid = str(uuid.uuid4()).upper()[:13] # Short readable UUID e.g. D39B-89A2-1C34
            cert = Certificate(
                certificate_uuid=f"DLH-{new_uuid}",
                user_id=current_user.id,
                module_id=module_id
            )
            db.session.add(cert)
            db.session.commit()
            certificate_id = cert.certificate_uuid
            certificate_issued = True
        else:
            certificate_id = existing_cert.certificate_uuid
            certificate_issued = True
            
    return jsonify({
        'score': score_percentage,
        'passed': passed,
        'correct_answers': correct_count,
        'total_questions': total_questions,
        'feedback': feedback,
        'certificate_issued': certificate_issued,
        'certificate_id': certificate_id
    }), 200
