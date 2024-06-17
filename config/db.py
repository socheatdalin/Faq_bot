from dotenv import load_dotenv 
import os
from pymongo import MongoClient

load_dotenv()

DATABASE = os.getenv('DATABASE_CONNECTION')
client = MongoClient(DATABASE)

db = client['bot']

# category_db = db["category"]
# subcategory_db = db["subcategory"]
faq_db = db['faq']
users_db = db['user']

