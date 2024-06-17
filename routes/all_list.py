from fastapi import APIRouter,HTTPException,UploadFile,File,Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.encoders import jsonable_encoder
from config.db import faq_db
from models.model import Faq, Category,Subcategory
import os
import logging

faq_router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@faq_router.get('/')
def root():
    return {"message": "Hello, Please go to http://127.0.0.1:8000/docs#/ to get more api"}

@faq_router.post("/categories/")
async def create_category(category: Category):
    existing_category =  faq_db.find_one({"category_name": category.category_name})
    if existing_category:
        raise HTTPException(status_code=400, detail="Category already exists")
    
    category_dict = category.dict()
    result =  faq_db.insert_one(category_dict)
    
    if result.inserted_id:
        category_dict["_id"] = str(result.inserted_id)
        return category_dict
    raise HTTPException(status_code=500, detail="Category could not be created")

@faq_router.get("/categories/{category_name}/")
async def category_by_name(category_name: str):
    category= faq_db.find_one({"category_name": category_name})
    if category:
      return category 
    raise HTTPException(status_code=404, detail="Category not found")
    # print(category)
    # return faq_db[category_name]

# subcategory
@faq_router.get("/subcategories")
async def subcategory():
    subcategories = []
    for category in faq_db.find():
        category_dict ={
            "category_name": category["category_name"],
            "subcategories": []
        
        }
        for subcategory in category.get("subcategories",[]):
            subcategory_dict = {
                    "subcategory_name": subcategory["subcategory_name"],
                    # "questions": subcategory.get("questions", [])
                    "questions": []
                }
            for faq in subcategory.get("questions",[]):
                faq_dict ={
                    "question": faq["question"],
                    "answer":faq["answer"]
                }
                subcategory_dict["questions"].append(faq_dict)
            category_dict["subcategories"].append(subcategory_dict)
        subcategories.append(category_dict)
    if subcategories:
        return subcategories

    raise HTTPException(status_code=404, detail="Subcategories not found")

@faq_router.post("/categories/{category_name}/subcategories/")
async def create_subcategory(category_name: str, subcategory: Subcategory):
    existing_category =  faq_db.find_one({"category_name": category_name})
    if not existing_category:
        raise HTTPException(status_code=404, detail="Category not found")
    subcategory_dict = subcategory.dict()
    if any(sub["subcategory_name"] == subcategory.subcategory_name for sub in existing_category.get("subcategories", [])):
        raise HTTPException(status_code=400, detail="Subcategory already exists")
    
    updated_category =  faq_db.update_one(
        {"category_name": category_name},
        {"$push": {"subcategories":  subcategory_dict}}
    )
    if updated_category.modified_count == 1:
        updated_category =  faq_db.find_one({"category_name": category_name})
        updated_category["_id"] = str(updated_category["_id"])
        return updated_category

    raise HTTPException(status_code=500, detail="Subcategory could not be created")
    # faq_db.update_one(
    #     {"category_name": category_name},
    #     {"$push": {"subcategories": subcategory.dict()}}
    # )
    # return subcategory

@faq_router.get("/categories/{category_name}/{subcategory_name}")
async def subcategory_by_name(category_name: str,subcategory_name: str):
    existing_category = faq_db.find_one({"category_name": category_name})
    if not existing_category:
        raise HTTPException(status_code=404, detail="Category not found")

    subcategory = next((sub for sub in existing_category["subcategories"] if sub["subcategory_name"] == subcategory_name), None)
    if not subcategory:
        raise HTTPException(status_code=404, detail="Subcategory not found")

    return subcategory

# faq
@faq_router.get('/faq')
async def get_faq():
    subcategories = []
    for category in faq_db.find():
        category_dict ={
            "category_name": category["category_name"],
            "subcategories": []
        
        }
        for subcategory in category.get("subcategories",[]):
            subcategory_dict = {
                    "subcategory_name": subcategory["subcategory_name"],
                    # "questions": subcategory.get("questions", [])
                    "questions": []
                }
            for faq in subcategory.get("questions",[]):
                faq_dict ={
                    "question": faq["question"],
                    "answer":faq["answer"]
                }
                subcategory_dict["questions"].append(faq_dict)
            category_dict["subcategories"].append(subcategory_dict)
        subcategories.append(category_dict)
    if subcategories:
        return subcategories

    raise HTTPException(status_code=404, detail="Subcategories not found")



@faq_router.delete("/delete_question/{category_name}/{subcategory_name}/{question_index}")
async def delete_question(category_name: str, subcategory_name: str, question_index: int):
    # Find the category
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

    if question_index < 0 or question_index >= len(subcategory_to_delete.get("questions", [])):
        raise HTTPException(status_code=400, detail="Invalid question index")
    
    question_index -= 1
    
    del subcategory_to_delete["questions"][question_index]
    faq_db.update_one({"category_name": category_name}, {"$set": {"subcategories": category["subcategories"]}})
    
    return {"message": "Question deleted successfully"}

@faq_router.get('/find_category')
async def find_category():
    categories = []
    for category in faq_db.find():
        categories.append(category["category_name"])
    if categories:
        return categories

@faq_router.get('/find_subcategory/{category_name}')
async def find_subcategory(category_name: str):
    subcategories = []
    for category in faq_db.find():
        cat_name = category["category_name"]  # Renamed the variable to avoid confusion
        if cat_name == category_name:
            for subcategory in category.get("subcategories", []):
                subcategories.append(subcategory["subcategory_name"])
    print(subcategories)  # Print outside the loop to see all subcategories
    return subcategories  # Return the list after the loop

def find_subcategories(category_name, subcategory_name):
    return faq_db.find_one(
        {"category_name": category_name, "subcategories.subcategory_name": subcategory_name},
        {"subcategories.$": 1}
    )


@faq_router.get("/get_faq")
async def get_faq():
    # Retrieve all documents from the collection
    faqs = list(faq_db.find())
    for faq in faqs:
        faq["_id"] = str(faq["_id"])  # Convert ObjectId to string for JSON serialization
    return JSONResponse(content=faqs)

UPLOAD_DIRECTORY = "files"

@faq_router.post("/categories/{category_name}/subcategories/{subcategory_name}/questions/")
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

    # Process the uploaded file
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

    # Update the subcategory with the new question
    updated_category =  faq_db.update_one(
        {"category_name": category_name, "subcategories.subcategory_name": subcategory_name},
        {"$push": {"subcategories.$.questions": question_dict}}
    )

    if updated_category.modified_count == 1:
        updated_category =  faq_db.find_one({"category_name": category_name})
        updated_category["_id"] = str(updated_category["_id"])
        return updated_category

    raise HTTPException(status_code=500, detail="Question could not be added")


