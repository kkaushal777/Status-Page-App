from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Service, db, User, StatusHistory
from flask_socketio import emit
from app import socketio

service_bp = Blueprint('service', __name__)

def admin_required(fn):
    """Decorator to ensure the user is an admin"""
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        if not user or 'admin' not in [role.name for role in user.roles]:
            return {"error": "Admin access required"}, 403
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__  # Ensure the wrapper has the same name as the function
    return wrapper

def validate_service_data(data):
    if not data.get('name'):
        raise ValueError("Service name is required")
    if not data.get('organization_id'):
        raise ValueError("Organization ID is required")
    if 'status' in data:
        Service.validate_status(data['status'])
    return True

@service_bp.route('/api/services', methods=['GET'], endpoint='manage_services')
@jwt_required()
@admin_required
def manage_services():
    try:
        if request.method == 'GET':
            services = Service.query.all()
            return jsonify([{
                'id': s.id,
                'name': s.name,
                'status': s.status,
                'organization_id': s.organization_id,
                'created_at': s.created_at.isoformat(),
                'updated_at': s.updated_at.isoformat()
            } for s in services]), 200
            
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@service_bp.route('/api/services', methods=['POST'])
@jwt_required()
@admin_required
def create_service():
    try:
        data = request.json
        validate_service_data(data)
        
        new_service = Service(
            name=data['name'],
            status=data.get('status', 'Operational'),
            organization_id=data['organization_id']
        )
        
        db.session.add(new_service)
        db.session.commit()
        
        return jsonify({
            'id': new_service.id,
            'name': new_service.name,
            'status': new_service.status,
            'organization_id': new_service.organization_id,
            'created_at': new_service.created_at.isoformat(),
            'updated_at': new_service.updated_at.isoformat()
        }), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@service_bp.route('/api/services/<int:service_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
@admin_required 
def service_detail(service_id):
    try:
        service = Service.query.get_or_404(service_id)

        if request.method == 'GET':
            return jsonify(service.to_dict()), 200
            
        elif request.method == 'PUT':
            data = request.json
            validate_service_data(data)
            
            if 'name' in data:
                service.name = data['name']
            if 'status' in data and data['status'] != service.status:
                # Log status change
                history = StatusHistory(
                    service_id=service.id,
                    status=data['status']
                )
                db.session.add(history)
                service.status = data['status']
                
                # Emit WebSocket event for status change
                socketio.emit('service_status_changed', service.to_dict(), broadcast=True)
                
            db.session.commit()
            return jsonify(service.to_dict()), 200
            
        elif request.method == 'DELETE':
            db.session.delete(service)
            db.session.commit()
            return '', 204
            
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@service_bp.route('/api/services/<int:service_id>/history')
@jwt_required()
@admin_required
def get_service_history(service_id):
    history = StatusHistory.query.filter_by(service_id=service_id)\
        .order_by(StatusHistory.timestamp.desc())\
        .limit(30)\
        .all()
    return jsonify([h.to_dict() for h in history])