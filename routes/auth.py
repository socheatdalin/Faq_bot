from fastapi import FastAPI, Depends, HTTPException, APIRouter, status,Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi_login import LoginManager
from pydantic import BaseModel
from typing import Optional
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from models.user import User, UserInDB
from config.db import users_db


# manager = LoginManager(SECRET, token_url="login")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# Secret key to encode and decode JWT
SECRET_KEY = "secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

user_router = APIRouter()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@user_router.post("/register")
async def register(email: str = Body(...), password: str = Body(...)):
    hashed_password = get_password_hash(password)
    user = {"email": email, "password": hashed_password}
    if users_db.find_one({"email": email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    users_db.insert_one(user)
    return {"msg": "User created successfully"}

@user_router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_db.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@user_router.get("/logout")
async def logout(token: str = Depends(oauth2_scheme)):
  
    return {"msg": "User logged out"}
