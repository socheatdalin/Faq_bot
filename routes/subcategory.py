from fastapi import APIRouter,HTTPException,UploadFile,File,Form,Path
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.encoders import jsonable_encoder
from config.db import faq_db
from models.model import Faq, Category,Subcategory, updateSubcategory
from bson import ObjectId

subcategory_router = APIRouter()

@subcategory_router.get('/find_subcategory/{category_name}')
async def find_subcategory(category_name: str):
    subcategories = []
    for category in faq_db.find():
        cat_name = category["category_name"]  # Renamed the variable to avoid confusion
        if cat_name == category_name:
            for subcategory in category.get("subcategories", []):
                subcategories.append(subcategory["subcategory_name"])
    print(subcategories)  # Print outside the loop to see all subcategories
    return subcategories  # Return the list after the loop



@subcategory_router.post("/categories/{category_name}/subcategories/")
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

@subcategory_router.get("/categories/{category_name}/{subcategory_name}")
async def subcategory_by_name(category_name: str,subcategory_name: str):
    existing_category = faq_db.find_one({"category_name": category_name})
    if not existing_category:
        raise HTTPException(status_code=404, detail="Category not found")

    subcategory = next((sub for sub in existing_category["subcategories"] if sub["subcategory_name"] == subcategory_name), None)
    if not subcategory:
        raise HTTPException(status_code=404, detail="Subcategory not found")

    return subcategory

@subcategory_router.get('/count-subcategory')
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



@subcategory_router.delete("/categories/{category_name}/subcategories/{subcategory_name}")
async def delete_subcategory(category_name: str, subcategory_name: str):
    update_result = faq_db.update_one(
        {"category_name": category_name},
        {"$pull": {"subcategories": {"subcategory_name": subcategory_name}}}
    )

    if update_result.modified_count == 1:
        return {"message": "Subcategory deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Subcategory not found or already deleted")

@subcategory_router.patch("/{category_name}/{current_subcategory_name}")
async def update_subcategory(category_name: str,current_subcategory_name: str ,subcategory:updateSubcategory):
    
    existing_category = faq_db.find_one({"category_name": category_name})
    if not existing_category:
        raise HTTPException(status_code=404, detail="Category not found")

    subcategories = existing_category.get("subcategories", [])

    # Find the subcategory by its current name
    subcategory_to_update = next((sub for sub in subcategories if sub.get("subcategory_name") == current_subcategory_name), None)

    if not subcategory_to_update:
        raise HTTPException(status_code=404, detail=f"Subcategory '{current_subcategory_name}' not found")

    # Update only the subcategory_name
    subcategory_to_update["subcategory_name"] = subcategory.subcategory_name

    # Perform update operation
    result = faq_db.update_one(
        {"category_name": category_name, "subcategories.subcategory_name": current_subcategory_name},
        {"$set": {"subcategories.$": subcategory_to_update}}
    )

    if result.modified_count == 1:
        updated_category = faq_db.find_one({"category_name": category_name})
        updated_category["_id"] = str(updated_category["_id"])
        return updated_category

    raise HTTPException(status_code=500, detail="Subcategory could not be updated")