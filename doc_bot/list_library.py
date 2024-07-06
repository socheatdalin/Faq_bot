from telegram import Update,InlineKeyboardButton, InlineKeyboardMarkup,InputFile
from telegram.ext import CallbackContext,ContextTypes
from bson import ObjectId
from config.db import db,faq_db
import os

from routes.subcategory import find_subcategory 

# list category
async def start(update, context):
    faq_data =  faq_db.find()
    category_names = ""
    for category in faq_data:
        category_names += f"/{category['category_name']}\n"
    reply_text = """👋 Welcome to the Institute of Technology of Cambodia! 
    This is LIBRABOT. 
    🚀 To get started, check out the following commands our bot:
    Categories:
    {}
    """.format(category_names)
    await update.message.reply_photo(photo=open("./assets/images/welcome.png", 'rb'), caption=reply_text)

# seleted category list subcategory
async def list_subcategory(update, context,selected_category):
    subcategories = await find_subcategory(selected_category)
    reply_text = "👋 Welcome to the Institute of Technology of Cambodia! This is LIBRBOT.\n🚀 To get started, check out the following commands our bot:\n Categories: "
    
    reply_text += f"/{selected_category}"
    reply_text += "\nSubcategory:" 
    for subcategory in subcategories:
        reply_text += f"\n\t/{subcategory}"
    
    await update.message.reply_text(reply_text)
    
async def category_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    category_name = update.message.text[1:]  # Extract the category name from the command
    await list_subcategory(update, context, category_name)
    
async def show_subcategory_content(update: Update, context: ContextTypes.DEFAULT_TYPE, selected_subcategory: str):
    # Fetch questions for the selected subcategory
    questions = []
    for category in faq_db.find():
        for subcategory in category.get("subcategories", []):
            if subcategory["subcategory_name"] == selected_subcategory:
                questions = subcategory.get("questions", [])
                break  # Break after finding the correct subcategory
    
    # Create inline keyboard buttons for each question
    keyboard = []
    for question in questions:
        question_text = question["question"]
        keyboard.append([InlineKeyboardButton(question_text, callback_data=f"question:{question_text}")])
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(f"Questions for {selected_subcategory}:", reply_markup=reply_markup)

async def subcategory_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    subcategory_name = update.message.text[1:]  # Extract the subcategory name from the command
    await show_subcategory_content(update, context, subcategory_name)

async def button(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    question_data = query.data.split(":", 1)
    if question_data[0] == "question":
        question_text = question_data[1]
        faq_data = faq_db.find()
        for category in faq_data:
            for subcategory in category["subcategories"]:
                questions = subcategory.get("questions", [])
                for question in questions:
                    if question["question"] == question_text:
                        answer = question["answer"]
                        images = question.get('images',[])
                        
                        for image in images:
                            file_path = image['filepath']
                            file_name = image['filename']
                                
                            if os.path.exists(file_path):
                                with open(file_path, 'rb') as f:
                                    await query.message.reply_photo(
                                                            # photo=InputFile(f, filename=file_name), 
                                                            photo=file_path,
                                                            caption=f"🤔 <b style='color: red;'>Question:</b> {question_text}\n\n🤖 <b>Answer:</b> {answer}", 
                                                            parse_mode="HTML"
                                                    )    
                            # if(file_path) is None :
                            #     await query.message.reply_text(
                            #         caption=f"🤔 <b style='color: red;'>Question:</b> {question_text}\n\n🤖 <b>Answer:</b> {answer}", 
                            #                                 parse_mode="HTML"
                            #     )
                    
        await query.message.reply_text("Answer not found")

