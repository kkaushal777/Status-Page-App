import os

class Config:
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') 

    

class DevelopmentConfig(Config):
    # SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:postgres@localhost:5432/mydb'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///db.sqlite3'
    SECRET_KEY = 'plivo123'
    SECURITY_PASSWORD_HASH = 'bcrypt'
    SECURITY_PASSWORD_SALT = 'plivoproject' 
    WTF_CSRF_ENABLED = False  # CSRF protection is disabled for now. it is used to prevent CSRF attacks
    DEBUG = True
    JWT_SECRET_KEY = 'plivo123'

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}