from typing import List, Optional
from pydantic import BaseModel

class Images(BaseModel):
    filename:str
    filepath: str
    type:str
    
class Faq(BaseModel):
    question: str
    answer: str
    image: Optional[Images] = None
    
class Subcategory(BaseModel):
    subcategory_name: str
    questions: Optional[List[Faq]] = []

class Category(BaseModel):
    category_name: str
    subcategories: Optional[List[Subcategory]] = []

#dupdate model
class updateCategory(BaseModel):
    category_name: Optional[str] = None

class updateSubcategory(BaseModel):
    subcategory_name: Optional[str] = None
    
class updateQuestion(BaseModel):
    question:str = None
    answer:str =None
    image:str = None

