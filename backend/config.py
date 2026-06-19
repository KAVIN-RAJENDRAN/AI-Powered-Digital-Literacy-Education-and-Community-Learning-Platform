import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'digital_literacy_super_secret_key')
    
    # DB fallback configuration: MySQL by default, SQLite if not available/configured
    DB_USER = os.environ.get('DB_USER', 'root')
    DB_PASSWORD = os.environ.get('DB_PASSWORD', '')
    DB_HOST = os.environ.get('DB_HOST', 'localhost')
    DB_NAME = os.environ.get('DB_NAME', 'digital_literacy_db')
    
    # If MYSQL_URL or typical mysql settings are provided, use MySQL. Otherwise, use SQLite.
    mysql_uri = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
    sqlite_uri = "sqlite:///" + os.path.join(os.path.abspath(os.path.dirname(__file__)), 'digital_literacy.db')
    
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', sqlite_uri)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # OpenAI Settings
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', 'mock-key-for-development')
