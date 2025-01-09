# backend/app/routes/notification.py
from flask import Blueprint, request, jsonify, flash
from flask_cors import cross_origin
from ..models import db, EmailSubscriber

notification_bp = Blueprint('notification', __name__)

@notification_bp.route('/api/notifications/subscribe', methods=['POST'])
@cross_origin()
def subscribe():
    try:
        data = request.get_json()
        email = data.get('email')

        if not email:
            flash('Email is required', 'error')
            return jsonify({"error": "Email is required"}), 400

        # Check if already subscribed
        existing = EmailSubscriber.query.filter_by(email=email).first()
        if existing:
            flash('You are already subscribed', 'info')
            return jsonify({
                "message": "You are already subscribed to status updates",
                "isSubscribed": True
            }), 200

        # Create new subscription
        subscriber = EmailSubscriber(
            email=email,
            is_verified=True  # Auto-verify for simplicity
        )
        
        db.session.add(subscriber)
        db.session.commit()

        flash('Successfully subscribed to status updates', 'success')
        return jsonify({
            "message": "Successfully subscribed to status updates"
        }), 201

    except Exception as e:
        flash('Failed to subscribe', 'error')
        db.session.rollback()
        return jsonify({"error": str(e)}), 500