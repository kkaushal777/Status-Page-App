from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Service, db, User

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
    """Validate service data before processing"""
    if not data.get('name'):
        raise ValueError("Service name is required")
    
    if 'status' in data:
        Service.validate_status(data['status'])
    
    return True

@service_bp.route('/api/services', methods=['GET', 'POST'], endpoint='manage_services')
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
            
        elif request.method == 'POST':
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

@service_bp.route('/api/services/<int:service_id>', methods=['GET', 'PUT', 'DELETE'], endpoint='service_detail')
@jwt_required()
@admin_required
def service_detail(service_id):
    try:
        service = Service.query.get(service_id)
        if not service:
            abort(404, description="Service not found")

        if request.method == 'GET':
            return jsonify({
                'id': service.id,
                'name': service.name,
                'status': service.status,
                'organization_id': service.organization_id,
                'created_at': service.created_at.isoformat(),
                'updated_at': service.updated_at.isoformat()
            }), 200
            
        elif request.method == 'PUT':
            data = request.json
            validate_service_data(data)
            
            if 'name' in data:
                service.name = data['name']
            if 'status' in data:
                service.status = data['status']
                
            db.session.commit()
            
            return jsonify({
                'id': service.id,
                'name': service.name,
                'status': service.status,
                'organization_id': service.organization_id,
                'created_at': service.created_at.isoformat(),
                'updated_at': service.updated_at.isoformat()
            }), 200
            
        elif request.method == 'DELETE':
            db.session.delete(service)
            db.session.commit()
            return '', 204
            
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500