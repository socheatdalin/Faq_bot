from typing import List, Optional
from pydantic import BaseModel

class User(BaseModel):
    email: str
    username: str

# User model for database storage (with hashed password)
class UserInDB(User):
    password: str