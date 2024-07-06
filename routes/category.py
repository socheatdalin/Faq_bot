
from fastapi import APIRouter,HTTPException,UploadFile,File,Form,Body
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.encoders import jsonable_encoder
from config.db import faq_db
from models.model import Category, updateCategory
import os
import logging

category_router = APIRouter()

@category_router.get('/')
def root():
    return {"message": "Hello, Please go to http://127.0.0.1:8000/docs#/ to get more api"}


@category_router.post("/categories/")
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

@category_router.get("/categories/{category_name}/")
async def category_by_name(category_name: str):
    category= faq_db.find_one({"category_name": category_name})
    if category:
      return category 
    raise HTTPException(status_code=404, detail="Category not found")
    # print(category)
    # return faq_db[category_name
@category_router.get('/find_category')
async def find_category():
    categories = []
    for category in faq_db.find():
        categories.append(category["category_name"])
    if categories:
        return categories
    
@category_router.get("/count-category")
def count_category():
    
    category_counts = faq_db.distinct("category_name")
    return len(category_counts)

category_counts = count_category()

@category_router.delete("/category/{category_name}")
async def delete_category(category_name:str):
    category = faq_db.delete_one({"category_name":category_name})
    if category.deleted_count == 1:
        return {"messages":"Category delete successfully"}
    else:
        raise HTTPException(status_code=404, detail="Category not found")
    
@category_router.delete("/category/{id}")
async def delete_category_by_id(id:str):
    categoies = faq_db.find()
    for category in categoies:
       if category["id"] == id:
           categoies.remove(category)
           return category
    raise HTTPException(status_code=404, detail="Category not found")

@category_router.patch('/category/{category_name}')
def update_category(category_name: str, category:updateCategory):
    
    categories = faq_db.find_one({"category_name":category_name})
    
    if not categories:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = category.dict(exclude_unset=True)
    
    result = faq_db.update_one(
        {"category_name":category_name},
        {"$set":update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")

    new_category_name = update_data.get("category_name",category_name)
  
    updated_category =  faq_db.find_one({"category_name": new_category_name})
    
    if not updated_category:
        raise HTTPException(status_code=404, detail="Updated category not found")
    
    return Category(**updated_category)
    