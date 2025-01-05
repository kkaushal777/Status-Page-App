from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security, SQLAlchemyUserDatastore
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import JWTManager

from backend.config import DevelopmentConfig
from sqlalchemy.exc import OperationalError
import logging

# Initialize SQLAlchemy
db = SQLAlchemy()
jwt = JWTManager()

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
        from backend.routes.auth import auth_bp
        from backend.routes.service import service_bp
        from backend.routes.incident import incident_bp
        from backend.routes.status import status_bp
        # from backend.routes.organization import organization_bp

        app.register_blueprint(auth_bp)
        app.register_blueprint(service_bp)
        app.register_blueprint(incident_bp)
        app.register_blueprint(status_bp)
        # app.register_blueprint(organization_bp)

        logger.info("Blueprints registered successfully")
    except Exception as e:
        logger.error(f"Error registering blueprints: {str(e)}")
        raise

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)

    from backend.models import User, Role
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore=datastore, register_blueprint=False) # Registering predefined blueprint is disabled

    app.app_context().push()
    # Initialize database with error handling
    init_db(app)
    jwt.init_app(app)

    # Register blueprints
    register_blueprints(app)

    logger.info("App created successfully")
    
    return app

