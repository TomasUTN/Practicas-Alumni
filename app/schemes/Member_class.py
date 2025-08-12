from schemes.User_class import user
from pydantic import BaseModel
from typing import Literal
from datetime import date

class Member_type_edit_create(BaseModel):
    name: str # para generar los tipos de socios (infantil,activo,vitalicio,jugador,etc)
    description: str
    price: float


class Member_type(Member_type_edit_create):
    id: int

class Member_edit_create(user):
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


class Member(user):
    id_member: int # auto incremental, no lo selecciona el usuario
    last_pay : date # ultimo pago
    debt: int # deuda o pagos pendientes con el price que tiene el member type multiplicarlo dependiendo los meses entre la fecha actual y el last pay
    
    