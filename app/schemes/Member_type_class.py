from pydantic import BaseModel


class Member_type_edit_create(BaseModel):
    name: str # para generar los tipos de socios (infantil,activo,vitalicio,jugador,etc)
    description: str
    price: float


class Member_type(Member_type_edit_create):
    id: int
    
    
class Config:
    orm_mode = True  # Muy importante para que Swagger convierta SQLAlchemy → Pydantic