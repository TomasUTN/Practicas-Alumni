from schemes.User_class import user
from datetime import date
    
class Press_edit_create(user):
    name: str
    surname: str
    photo: str # despues convertirlo a tipo file, pero lo guardaremos como archivo estatico y aqui ira la ruta
    DNI: int
    channel: str # hace referencia al medio por ej: villa maria ya, el diario, radio villa maria, etc.
    phone: int
    
class Press(Press_edit_create):
    id_press: int
