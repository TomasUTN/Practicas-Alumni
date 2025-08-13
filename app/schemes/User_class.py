from pydantic import BaseModel, EmailStr

class User_edit_create(BaseModel):
    email : EmailStr
    password : str 
    rol: str
    
class User_scheme(User_edit_create):
    id: int
    
class Config:
    orm_mode = True  # Muy importante para que Swagger convierta SQLAlchemy → Pydantic