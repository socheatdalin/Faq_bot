from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from telegram import Update,Bot
from telegram.ext import  ContextTypes,MessageHandler,filters, CommandHandler,Application,CallbackContext,CallbackQueryHandler
from pydantic import BaseModel
import logging
import uvicorn
from dotenv import load_dotenv
import os
import requests

from routes.all_list import faq_router
from routes.auth import user_router
from routes.subcategory import item_router
from gemini import vision,chat
from doc_bot.list_library import start,button,list_subcategory,list_qa


load_dotenv()

DATABASE = os.getenv('DATABASE_CONNECTION')
TOKEN = os.getenv('TOKEN')

# Initialize FastAPI
app = FastAPI()
app.include_router(faq_router)
app.include_router(user_router)
app.include_router(item_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TelegramRequest(BaseModel):
    update_id: int
    message: dict = None
    
class PromptRequest(BaseModel):
    prompt: str
    
bot = Bot(token=TOKEN)    
application = Application.builder().token(TOKEN).build()   

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)
logger = logging.getLogger(__name__)

@app.post("https://f729-58-97-229-26.ngrok-free.app/webhook")
async def webhook(request: Request):
    try:
        data = await request.json()
        update = Update.de_json(data, bot)
        await application.update_queue.put(update)
        return JSONResponse(content={"status": "ok"}, status_code=200)
    except Exception as e:
        logger.error(f"Error processing update: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/gemini")
def gemini(prompt, img_url):
    return vision(prompt, img_url)

@app.post("/api/gemini/chat")
async def gemini_chat(request: PromptRequest):
    if not request.prompt:
        raise HTTPException(status_code=400, detail="No prompt provided")

    response_text = chat(request.prompt)
    return  JSONResponse(content={"response": response_text})

# Set the webhook (one-time setup)
# @app.on_event("startup")
# async def on_startup():
#     webhook_url = "https://f729-58-97-229-26.ngrok-free.app/webhook"
#     await bot.set_webhook(webhook_url)



# Start the FastAPI server
if __name__ == "__main__":
   
    uvicorn.run(app)
