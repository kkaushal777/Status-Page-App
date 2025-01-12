from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security, SQLAlchemyUserDatastore
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import JWTManager
from flask_cors import CORS  # Import CORS
from flask_socketio import SocketIO  # Import SocketIO
from flask_mail import Mail  # Import Mail

from app.config import DevelopmentConfig
from sqlalchemy.exc import OperationalError
import logging
import os  # Import os

# Initialize SQLAlchemy
db = SQLAlchemy()
jwt = JWTManager()
socketio = SocketIO()  # Initialize SocketIO
mail = Mail()  # Initialize Mail

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db(app):
    """Initialize database with error handling"""
    try:
        db.init_app(app)
        with app.app_context():
            db.create_all()

        userdatastore: SQLAlchemyUserDatastore = app.security.datastore
        userdatastore.find_or_create_role(name='admin', description='Administrator')

        if not userdatastore.find_user(email='admin@plivo.com'):
            userdatastore.create_user(email='admin@plivo.com', password=generate_password_hash('plivo123'), roles=['admin'])
       
        db.session.commit()

    except OperationalError as e:
        print("Database connection failed. Please check if PostgreSQL is running.")
        print(f"Error: {e}")
        raise

def register_blueprints(app):
    try:
        from app.routes.auth import auth_bp
        from app.routes.service import service_bp
        from app.routes.incident import incident_bp
        from app.routes.status import status_bp
        from app.routes.notification import notification_bp 
        from app.routes.api import api_bp
        # from app.routes.organization import organization_bp

        app.register_blueprint(auth_bp)
        app.register_blueprint(service_bp)
        app.register_blueprint(incident_bp)
        app.register_blueprint(status_bp)
        app.register_blueprint(notification_bp)
        app.register_blueprint(api_bp)
        # app.register_blueprint(organization_bp)

        logger.info("Blueprints registered successfully")
    except Exception as e:
        logger.error(f"Error registering blueprints: {str(e)}")
        raise

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    
    # Initialize extensions
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "https://status-page-ead5m5fip-kaushal-kishores-projects-b81830f3.vercel.app",
                        'https://status-page-nine-indol.vercel.app'],
            "supports_credentials": True,
            "allow_headers": ["Content-Type", "Authorization"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
        }
    })
    
    # Fix Socket.IO configuration
    socketio.init_app(app, 
                     cors_allowed_origins=["http://localhost:5173", 
                                         "https://status-page-ead5m5fip-kaushal-kishores-projects-b81830f3.vercel.app",
                                         "https://status-page-nine-indol.vercel.app"],
                     async_mode='eventlet',
                     logger=True,
                     engineio_logger=True)
    
    # Enable flash messages
    app.config['SESSION_TYPE'] = 'filesystem'
    
    from app.models import User, Role
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore=datastore, register_blueprint=False) # Registering predefined blueprint is disabled

    app.app_context().push()
    # Initialize database with error handling
    init_db(app)
    jwt.init_app(app)

    # Configure and initialize Flask-Mail
    app.config.update(
        MAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp.gmail.com'),
        MAIL_PORT = int(os.getenv('MAIL_PORT', 587)),
        MAIL_USE_TLS = os.getenv('MAIL_USE_TLS', 'True').lower() == 'true',
        MAIL_USERNAME = os.getenv('MAIL_USERNAME'),
        MAIL_PASSWORD = os.getenv('MAIL_APP_PASSWORD'),
        MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER')
    )
    mail.init_app(app)

    # Register blueprints
    register_blueprints(app)

    # Error handler
    @app.errorhandler(Exception)
    def handle_error(error):
        logger.error(f"Unhandled error: {str(error)}")
        return jsonify({
            "error": "Internal server error",
            "message": str(error)
        }), 500

    # Initialize background tasks using with app.app_context()
    with app.app_context():
        from app.tasks import start_uptime_tracker
        try:
            start_uptime_tracker()
            logger.info("Background tasks initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize background tasks: {e}")

    logger.info("App created successfully")
    
    return app
