from telegram import Update
from telegram.ext import  ContextTypes,MessageHandler,filters, CommandHandler,Application,CallbackContext,CallbackQueryHandler
from dotenv import load_dotenv
import os
import openai
# import aiohttp
import logging
import asyncio
import google.generativeai as genai
load_dotenv()

DATABASE = os.getenv('DATABASE_CONNECTION')
TOKEN = os.getenv('TOKEN')
BOT_USERNAME = os.getenv('BOT_USERNAME')

from doc_bot.list_library import start,button,list_subcategory,list_qa
from gemini import chat

async def library_command(update, context):
    await list_subcategory(update, context, "libraries")

async def school_command(update, context):
    await list_subcategory(update, context, "school")

    
async def room_question(update, context):
    await list_qa(update, context, "room")
async def library_question(update, context):
    await list_qa(update, context, "library")
async def school_question(update, context):
    await list_qa(update, context, "building")
async def school_question(update, context):
    await list_qa(update, context, "book")
async def school_question(update, context):
    await list_qa(update, context, "service")
async def school_question(update, context):
    await list_qa(update, context, "department")
    
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def reply(update:Update, context:CallbackContext) -> None:
    query = update.message.text.lower()
    user_name = update.effective_user.first_name
    replies = {
        "hi": f"Hello, {user_name}", 
        "how are you?": "I am fine. Thank you.",
        "what is your name": "I am LIBRABot",
        "bye":"See you",
    }
    for key, value in replies.items():
        if query in key:
            await update.message.reply_text(value)
            break
        else:
            await update.message.reply_text("Please go to menu to move on to next step.")

async def handle_message(update, context):
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        chat =  model.start_chat(history=[]) 
        max_retries = 3
        city="Cambodia"


        for attempt in range(max_retries):
            try:
                response = chat.send_message(update.message.text)  
               
                logger.info("Model response: %s", response)
                break
            except Exception as e:
                if attempt < max_retries - 1:
                    await asyncio.sleep(2)  # Wait a bit before retrying
                else:
                    raise
        response_text = response.text  
        await context.bot.send_message(chat_id=update.effective_chat.id, text=response_text)
    except Exception as e:
        await context.bot.send_message(chat_id=update.effective_chat.id, text="An error occurred. Please try again later.")
       
async def echo(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text(update.message.text)
    
async def error(update: Update, context: ContextTypes.DEFAULT_TYPE):
        print(f'Update {update} caused error {context.error}')


def main():
    application = Application.builder().token(TOKEN).read_timeout(30).write_timeout(30).build()
    print('starting bot ')
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("libraries", library_command))
    application.add_handler(CommandHandler("school", school_command))
    application.add_handler(CommandHandler("room", room_question))
    application.add_handler(CommandHandler("library", library_question))
    application.add_handler(CommandHandler("school", school_question))
    application.add_handler(CallbackQueryHandler(button))
    application.add_handler(MessageHandler(filters.TEXT, handle_message))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, echo))

    application.run_polling()

if __name__ == "__main__":
    main()