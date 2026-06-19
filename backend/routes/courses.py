from flask import Blueprint, request, jsonify
from models import db, Module, Topic, Progress
from routes.auth import token_required

courses_bp = Blueprint('courses', __name__)

@courses_bp.route('/', methods=['GET'])
@token_required
def get_modules(current_user):
    lang = request.args.get('lang', current_user.preferred_language)
    modules = Module.query.all()
    
    result = []
    for m in modules:
        m_dict = m.to_dict(lang=lang)
        
        # Join progress details
        prog = Progress.query.filter_by(user_id=current_user.id, module_id=m.id).first()
        if prog:
            completed_topics = prog.get_completed_topics()
            m_dict['completed_topics'] = completed_topics
            m_dict['is_completed'] = prog.is_completed
            m_dict['progress_percentage'] = int((len(completed_topics) / len(m.topics) * 100)) if len(m.topics) > 0 else 0
        else:
            m_dict['completed_topics'] = []
            m_dict['is_completed'] = False
            m_dict['progress_percentage'] = 0
            
        result.append(m_dict)
        
    return jsonify(result), 200

@courses_bp.route('/<int:module_id>/topics', methods=['GET'])
@token_required
def get_topics(current_user, module_id):
    lang = request.args.get('lang', current_user.preferred_language)
    module = Module.query.get_or_404(module_id)
    
    # Sort by step number
    topics = sorted(module.topics, key=lambda t: t.step_number)
    
    # Get completed status
    prog = Progress.query.filter_by(user_id=current_user.id, module_id=module_id).first()
    completed_list = prog.get_completed_topics() if prog else []
    
    topics_list = []
    for t in topics:
        t_dict = t.to_dict(lang=lang)
        t_dict['is_completed'] = t.id in completed_list
        topics_list.append(t_dict)
        
    return jsonify({
        'module_title': module.title_en if lang == 'en' else module.title_ta,
        'topics': topics_list
    }), 200

@courses_bp.route('/topics/<int:topic_id>/complete', methods=['POST'])
@token_required
def complete_topic(current_user, topic_id):
    topic = Topic.query.get_or_404(topic_id)
    module_id = topic.module_id
    
    prog = Progress.query.filter_by(user_id=current_user.id, module_id=module_id).first()
    if not prog:
        prog = Progress(user_id=current_user.id, module_id=module_id, completed_topics_json='[]')
        db.session.add(prog)
        db.session.commit()
        
    completed_topics = prog.get_completed_topics()
    if topic_id not in completed_topics:
        completed_topics.append(topic_id)
        prog.set_completed_topics(completed_topics)
        
        # Check if all module topics are completed
        module = Module.query.get(module_id)
        if len(completed_topics) >= len(module.topics):
            prog.is_completed = True
            
        db.session.commit()
        
    return jsonify({
        'message': 'Progress updated successfully!',
        'progress': prog.to_dict()
    }), 200
