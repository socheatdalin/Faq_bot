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


