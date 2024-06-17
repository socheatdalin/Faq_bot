from fastapi import APIRouter,HTTPException,UploadFile,File,Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.encoders import jsonable_encoder
from config.db import faq_db
# from schemas.schema import faq_serializer,faqs_serializer,faqs_question,categories_serializer,category_serializer
from models.model import Faq, Category,Subcategory
from bson import ObjectId

item_router = APIRouter()

@item_router.get('/count')
def count_subcategories():
    # Use aggregate to count unique subcategories for each category_name
    pipeline = [
        {
            "$unwind": "$subcategories"
        },
        {
            "$group": {
                "_id": "$category_name",
                "uniqueSubcategories": { "$addToSet": "$subcategories.subcategory_name" }
            }
        },
        {
            "$project": {
                "category_name": "$_id",
                "subcategory_count": { "$size": "$uniqueSubcategories" }
            }
        }
    ]
    category_subcategory_counts = list(faq_db.aggregate(pipeline))

    return category_subcategory_counts

category_subcategory_counts = count_subcategories()
# print(category_subcategory_counts)

@item_router.get("/count-category")
def count_category():
    
    category_counts = faq_db.distinct("category_name")
    return len(category_counts)

category_counts = count_category()

@item_router.delete("/category/{category_name}")
async def delete_category(category_name:str):
    category = faq_db.delete_one({"category_name":category_name})
    if category.deleted_count == 1:
        return {"messages":"Category delete successfully"}
    else:
        raise HTTPException(status_code=404, detail="Category not found")
  
@item_router.delete("/category/{id}")
async def delete_category_by_id(id:str):
    categoies = faq_db.find()
    for category in categoies:
       if category["id"] == id:
           categoies.remove(category)
           return category
    raise HTTPException(status_code=404, detail="Category not found")

  
  
@item_router.delete("/categories/{category_name}/subcategories/{subcategory_name}")
async def delete_subcategory(category_name: str, subcategory_name: str):
    update_result = await faq_db.update_one(
        {"category_name": category_name},
        {"$pull": {"subcategories": {"subcategory_name": subcategory_name}}}
    )

    if update_result.modified_count == 1:
        return {"message": "Subcategory deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Subcategory not found or already deleted")
