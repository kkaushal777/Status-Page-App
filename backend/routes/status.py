from flask import Blueprint, jsonify
from backend.models import Service, Incident
from collections import defaultdict
from datetime import datetime, timedelta

status_bp = Blueprint('status', __name__)

def get_system_status(services):
    """Calculate overall system status based on service statuses"""
    if not services:
        return "Unknown"
    
    status_priority = {
        "Outage": 3,
        "Degraded": 2, 
        "Operational": 1
    }
    
    highest_priority = max(services, key=lambda x: status_priority.get(x.status, 0))
    return highest_priority.status

def get_status():
    """Get status of all services and related incidents"""
    try:
        # Get all active services
        services = Service.query.all()
        
        # Get recent incidents (last 24 hours)
        recent_time = datetime.utcnow() - timedelta(hours=24)
        recent_incidents = Incident.query.filter(
            Incident.created_at >= recent_time
        ).order_by(Incident.created_at.desc()).all()
        
        # Group incidents by service
        service_incidents = defaultdict(list)
        for incident in recent_incidents:
            service_incidents[incident.service_id].append({
                'id': incident.id,
                'status': incident.status,
                'description': incident.description,
                'created_at': incident.created_at.isoformat(),
                'resolved': incident.resolved
            })

        # Build response
        status_response = {
            'overall_status': get_system_status(services),
            'last_updated': datetime.utcnow().isoformat(),
            'services': [{
                'id': service.id,
                'name': service.name,
                'status': service.status,
                'incidents': service_incidents.get(service.id, [])
            } for service in services],
            'incident_count': {
                'total': len(recent_incidents),
                'ongoing': len([i for i in recent_incidents if not i.resolved])
            }
        }
        
        return status_response

    except Exception as e:
        return {'error': 'Error fetching status', 'details': str(e)}

@status_bp.route('/api/status', methods=['GET'])
def public_status():
    """Public endpoint to get system status and incidents"""
    try:
        status = get_status()
        return jsonify(status), 200
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500