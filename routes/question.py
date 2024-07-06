from fastapi import APIRouter,HTTPException,UploadFile,File,Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.encoders import jsonable_encoder
from config.db import faq_db
from models.model import Faq, Category,Subcategory
from bson import ObjectId
import os

question_router = APIRouter()

@question_router.get('/get_faq')
async def get_faq():
    # Retrieve all documents from the collection
    faqs = list(faq_db.find())
    for faq in faqs:
        faq["_id"] = str(faq["_id"])  # Convert ObjectId to string for JSON serialization
    return JSONResponse(content=faqs)

@question_router.delete("/delete_question/{category_name}/{subcategory_name}/{question_index}")
def delete_question(category_name: str, subcategory_name: str, question_index: int):
    category = faq_db.find_one({"category_name": category_name})
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    
    subcategory_to_delete = None
    for subcategory in category.get("subcategories", []):
        if subcategory["subcategory_name"] == subcategory_name:
            subcategory_to_delete = subcategory
            break
    if subcategory_to_delete is None:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    # Remove the question
    del subcategory_to_delete["questions"][question_index]

    # Update the database
    faq_db.update_one(
        {"category_name": category_name}, 
        {"$set": {"subcategories": category["subcategories"]}}
    )
    
    return {"message": "Question deleted successfully"}


UPLOAD_DIRECTORY = "files"

@question_router.post("/categories/{category_name}/subcategories/{subcategory_name}/questions/")
async def add_question(
    category_name: str, 
    subcategory_name: str, 
    question: str = Form(...), 
    answer: str = Form(...), 
    file: UploadFile = File(None)
):
    existing_category =  faq_db.find_one({"category_name": category_name})
    if not existing_category:
        raise HTTPException(status_code=404, detail="Category not found")

    subcategories = existing_category.get("subcategories", [])
    subcategory = next((sub for sub in subcategories if sub["subcategory_name"] == subcategory_name), None)
    
    if not subcategory:
        raise HTTPException(status_code=404, detail="Subcategory not found")

    if file:
        file_location = os.path.join(UPLOAD_DIRECTORY, file.filename)
        with open(file_location, "wb") as f:
            f.write(file.file.read())
        filename = file.filename
        filepath = file_location
        
    else:
        filename = None
        filepath = None

    question_dict = {
        "question": question,
        "answer": answer,
        "filename": filename,
        "filepath": filepath,
    }

    updated_category =  faq_db.update_one(
        {"category_name": category_name, "subcategories.subcategory_name": subcategory_name},
        {"$push": {"subcategories.$.questions": question_dict}}
    )

    if updated_category.modified_count == 1:
        updated_category =  faq_db.find_one({"category_name": category_name})
        updated_category["_id"] = str(updated_category["_id"])
        return updated_category

    raise HTTPException(status_code=500, detail="Question could not be added")


@question_router.patch("/update_question/{category_name}/{subcategory_name}/{question_index}")
def update_question(
    category_name: str, 
    subcategory_name: str, 
    question_index: int,
    new_question: str = Form(None), 
    new_answer: str = Form(None), 
    new_file: UploadFile = File(None)
):
    category = faq_db.find_one({"category_name": category_name})
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    
    subcategories = category.get("subcategories", [])
    subcategory = next((sub for sub in subcategories if sub["subcategory_name"] == subcategory_name), None)
    
    if not subcategory:
        raise HTTPException(status_code=404, detail="Subcategory not found")

    if question_index < 0 or question_index >= len(subcategory["questions"]):
        raise HTTPException(status_code=404, detail="Question index out of range")
    
    question = subcategory["questions"][question_index]

    new_filename = question.get("filename", "")
    new_filepath = question.get("filepath", "")

    if new_file:
        new_filename = new_file.filename
        file_location = os.path.join(UPLOAD_DIRECTORY, new_filename)
        with open(file_location, "wb") as f:
            f.write(new_file.file.read())
        new_filepath = file_location

    question_update = {
        "question": new_question or question["question"],
        "answer": new_answer or question["answer"],
        "filename": new_filename,
        "filepath": new_filepath,
    }

    subcategory["questions"][question_index] = question_update
    faq_db.update_one(
        {"category_name": category_name, "subcategories.subcategory_name": subcategory_name},
        {"$set": {"subcategories.$.questions": subcategory["questions"]}}
    )

    return JSONResponse(content={"message": "Question updated successfully"})
    
# @question_router.patch("/categories/{category_name}/subcategories/{subcategory_name}/questions/")
# async def update_question(
#     category_name: str, 
#     subcategory_name: str, 
#     old_question: str = Form(...), 
#     new_question: str = Form(None), 
#     new_answer: str = Form(None), 
#     new_file: UploadFile = File(None)
# ):
#     existing_category = faq_db.find_one({"category_name": category_name})
#     if not existing_category:
#         raise HTTPException(status_code=404, detail="Category not found")

#     subcategories = existing_category.get("subcategories", [])
#     subcategory = next((sub for sub in subcategories if sub["subcategory_name"] == subcategory_name), None)

#     if not subcategory:
#         raise HTTPException(status_code=404, detail="Subcategory not found")

#     question = next((q for q in subcategory.get("questions", []) if q["question"] == old_question), None)
#     if not question:
#         raise HTTPException(status_code=404, detail="Question not found")

#     # Process the new file
#     if new_file:
#         file_location = os.path.join(UPLOAD_DIRECTORY, new_file.filename)
#         with open(file_location, "wb") as f:
#             f.write(new_file.file.read())
#         new_filename = new_file.filename
#         new_filepath = file_location
#     else:
#         new_filename = question["filename"]
#         new_filepath = question["filepath"]

#     # Update the question details
#     question_update = {
#         "question": new_question or question["question"],
#         "answer": new_answer or question["answer"],
#         "filename": new_filename,
#         "filepath": new_filepath,
#     }

#     # Update the question in the database
#     update_result = faq_db.update_one(
#         {"category_name": category_name, "subcategories.subcategory_name": subcategory_name, "subcategories.questions.question": old_question},
#         {"$set": {"subcategories.$[subcat].questions.$[q]": question_update}},
#         array_filters=[{"subcat.subcategory_name": subcategory_name}, {"q.question": old_question}]
#     )

#     if update_result.modified_count == 1:
#         updated_category = faq_db.find_one({"category_name": category_name})
#         updated_category["_id"] = str(updated_category["_id"])
#         return updated_category

#     raise HTTPException(status_code=500, detail="Question could not be updated")
# @faq_router.get('/faq')
# async def get_faq():
#     subcategories = []
#     for category in faq_db.find():
#         category_dict ={
#             "category_name": category["category_name"],
#             "subcategories": []
        
#         }
#         for subcategory in category.get("subcategories",[]):
#             subcategory_dict = {
#                     "subcategory_name": subcategory["subcategory_name"],
#                     # "questions": subcategory.get("questions", [])
#                     "questions": []
#                 }
#             for faq in subcategory.get("questions",[]):
#                 faq_dict ={
#                     "question": faq["question"],
#                     "answer":faq["answer"]
#                 }
#                 subcategory_dict["questions"].append(faq_dict)
#             category_dict["subcategories"].append(subcategory_dict)
#         subcategories.append(category_dict)
#     if subcategories:
#         return subcategories
#     raise HTTPException(status_code=404, detail="Subcategories not found")