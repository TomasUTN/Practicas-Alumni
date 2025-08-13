from schemes.User_class import User_scheme
from datetime import date
from pydantic import BaseModel


class Member_edit_create(BaseModel):
    id_user: int
    photo: str # despues convertirlo a tipo file, pero lo guardaremos como archivo estatico y aqui ira la ruta
    name: str
    surname: str
    DNI: int
    date_of_birth: date
    phone: int
    city: str
    post_code: int
    adress: str
    date_of_up: date # fecha de alta
    type_member: int # tengo que ver para en caso de que sea mayor y seleccione infantil lo ponga como activo ver como aplico las condiciones


class Member_class(Member_edit_create):
    id: int # auto incremental, no lo selecciona el usuario
    last_pay: date # ultimo pago
    debt: int # deuda o pagos pendientes
    user: User_scheme

class Config:
    orm_mode = True
    
