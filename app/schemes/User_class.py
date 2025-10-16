from pydantic import BaseModel, EmailStr

class User_edit_create(BaseModel):
    email : EmailStr
    password : str 
    repeat_password : str
    rol: str
    
class User_scheme(BaseModel):
    id: int
    email : EmailStr
    rol: str

class User_log(BaseModel):
    email: EmailStr
    password:str

class Config:
    orm_mode = True  # Muy importante para que Swagger convierta SQLAlchemy → Pydantic