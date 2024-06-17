from telegram import Update,InlineKeyboardButton, InlineKeyboardMarkup,InputFile
from telegram.ext import CallbackContext,ContextTypes
from bson import ObjectId
from config.db import db,faq_db
import os

# list category
async def start(update, context):
    faq_data =  faq_db.find()
    category_names = ""
    for category in faq_data:
        category_names += f"/{category['category_name']}\n"
    reply_text = """👋 Welcome to the Institute of Technology of Cambodia! 
    This is LIBRBOT. 
    🚀 To get started, check out the following commands our bot:
    Categories:
    {}
    """.format(category_names)  # Remove trailing newline
    await update.message.reply_photo(photo=open("./assets/images/welcome.png", 'rb'), caption=reply_text)
# Callback query handler function

# seleted category list subcategory
async def list_subcategory(update, context,selected_category):
    faq_data = faq_db.find()
    reply_text = "👋 Welcome to the Institute of Technology of Cambodia! This is LIBRBOT.\n🚀 To get started, check out the following commands our bot:\n Categories: "
    
    for category in faq_data:
        if category["category_name"] == selected_category:
            reply_text +=  f"/{category['category_name']}"
            reply_text += "\nSubcategory:" 
            for subcategory in category["subcategories"]:
                reply_text +=f"\n\t/{subcategory['subcategory_name']}"
            break  # Stop looping once the selected category is found
    
    await update.message.reply_text(reply_text)

# list question of each subcategory 
async def list_qa (update,context, selected_subcategory):
    faq_data = faq_db.find()
    questions = []
    keyboard = []
    for category in faq_data:
        for subcategory in category["subcategories"]:
            if subcategory["subcategory_name"] == selected_subcategory:
                questions = subcategory.get("questions", [])
                break  # Break after finding the correct subcategory
    for question in questions:
        question_text = question["question"]
        keyboard.append([InlineKeyboardButton(question_text,callback_data=f"question:{question_text}")])
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(f"Questions for {selected_subcategory}:", reply_markup=reply_markup)


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
                        print(answer)
                        images = question['images']
                        for image in images:
                            file_path = image['filepath']
                            file_name = image['filename']
                            file_type = image['type']
                                
                            if os.path.exists(file_path):
                                with open(file_path, 'rb') as f:
                                    await query.message.reply_photo(
                                                            # photo=InputFile(f, filename=file_name), 
                                                            photo=file_path,
                                                            caption=f"🤔 <b style='color: red;'>Question:</b> {question_text}\n\n🤖 <b>Answer:</b> {answer}", 
                                                            parse_mode="HTML"
                                                    )    
                    
        await update.message.reply_text("Answer not found")

