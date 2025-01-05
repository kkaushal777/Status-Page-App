from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, 
    jwt_required,
    get_jwt_identity
)
from datetime import timedelta
from ..models import User
from ..utils import validate_email, validate_password
import logging

auth_bp = Blueprint('auth', __name__)
logger = logging.getLogger(__name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    # import pdb; pdb.set_trace()
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing request body"}), 400

        email = data.get('email')
        password = data.get('password')

        # Validate inputs
        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400
        
        if not validate_email(email):
            return jsonify({"error": "Invalid email format"}), 400

        # Get user from database
        user = User.query.filter_by(email=email).first()
        if not user or not user.verify_password(password):
            logger.warning(f"Failed login attempt for email: {email}")
            return jsonify({"error": "Invalid credentials"}), 401

        access_token = create_access_token(identity=user.email, expires_delta=timedelta(hours=1))
        logger.info(f"Successful login for user: {email}")
        
        return jsonify({
            'access_token': access_token,
            'user': {
                'email': user.email,
                'role': [role.name for role in user.roles]
            }
        }), 200

    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing request body"}), 400

        email = data.get('email')
        password = data.get('password')

        # Validate inputs
        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400
        
        if not validate_email(email):
            return jsonify({"error": "Invalid email format"}), 400

        is_valid, error_message = validate_password(password)
        if not is_valid:
            return jsonify({"error": error_message}), 400

        # Check if user already exists
        user = User.query.filter_by(email=email).first()
        if user:
            return jsonify({"error": "User already exists"}), 400

        # Create new user
        new_user = User(
            email=email,
            password=User.hash_password(password)
        )
        new_user.save()
        logger.info(f"New user registered: {email}")

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    try:
        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user)
        return jsonify({'access_token': new_access_token}), 200
    except Exception as e:
        logger.error(f"Token refresh error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500