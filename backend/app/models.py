from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from flask_security import UserMixin, RoleMixin
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
from . import db

# Service and Incident Status Constants
SERVICE_STATUSES = ['Operational', 'Degraded', 'Outage']
INCIDENT_STATUSES = ['Ongoing', 'Resolved', 'Scheduled']

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    active = db.Column(db.Boolean, default=True)
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=True)

    organization = relationship("Organization", back_populates="users")
    roles = db.relationship('Role', secondary='user_roles',
                          backref=db.backref('users', lazy='dynamic'))

    def verify_password(self, password):
        return check_password_hash(self.password, password)

    @staticmethod
    def hash_password(password):
        return generate_password_hash(password)

    def __str__(self):
        return self.email

class Role(db.Model, RoleMixin):
    __tablename__ = 'roles'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

    def __str__(self):
        return self.name

class UserRoles(db.Model):
    __tablename__ = 'user_roles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id', ondelete='CASCADE'))

    def __str__(self):
        return f"UserRole {self.user_id}:{self.role_id}"

class Organization(db.Model):
    __tablename__ = 'organizations'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    users = relationship("User", back_populates="organization", cascade="all, delete-orphan")
    services = relationship("Service", back_populates="organization", cascade="all, delete-orphan")

    def __str__(self):
        return self.name

class Service(db.Model):
    __tablename__ = 'services'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50), nullable=False, default="Operational")
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    organization = relationship("Organization", back_populates="services")
    incidents = relationship("Incident", back_populates="service", cascade="all, delete-orphan")

    def __str__(self):
        return self.name

    @staticmethod
    def validate_status(status):
        if status not in SERVICE_STATUSES:
            raise ValueError(f"Invalid service status. Must be one of {SERVICE_STATUSES}")
        return status

class Incident(db.Model):
    __tablename__ = 'incidents'

    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    status = db.Column(db.String(50), nullable=False, default="Ongoing")
    description = db.Column(db.Text, nullable=False)
    resolved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    service = relationship("Service", back_populates="incidents")

    def __str__(self):
        return f"Incident {self.id} - {self.status}"

    @staticmethod
    def validate_status(status):
        if status not in INCIDENT_STATUSES:
            raise ValueError(f"Invalid incident status. Must be one of {INCIDENT_STATUSES}")
        return status


