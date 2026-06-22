import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'super-secret-key-change-me-in-production')
    SQLALCHEMY_TRACK_MODIFICATIONS = False


    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        'postgresql://postgres:postgres@db:5432/k2_erp_db'
    )