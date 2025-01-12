import os


class Config:
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') 


    MAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.getenv('MAIL_PORT', 587))
    MAIL_USE_TLS = os.getenv('MAIL_USE_TLS', 'True').lower() == 'true'
    MAIL_USERNAME = os.getenv('MAIL_USERNAME', 'roxxkk786@gmail.com')  # Change this in .env
    MAIL_APP_PASSWORD = os.getenv('MAIL_PASSWORD', '')  # Must be set in .env
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER', os.getenv('MAIL_USERNAME', 'your-email@gmail.com'))

    

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