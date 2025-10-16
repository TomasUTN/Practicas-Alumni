from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from models.User_table import User_db
from schemes.User_class import User_log
import uuid

# Diccionario en memoria para tener la sesion activas
sesiones = {}


class Login_services:
    def __init__(self, db: Session):
        self.db = db

    def login(self, data: User_log):
        user = self.db.query(User_db).filter(User_db.email == data.email.lower()).first()

        if not user:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")

        if user.password != data.password:
            raise HTTPException(status_code=401, detail="Contraseña incorrecta")

        # Generar un token aleatorio
        token = str(uuid.uuid4())

        # Guardar sesión en memoria
        sesiones[token] = {
            "id": user.id,
            "rol": user.rol,
            "email": user.email
        }

        return {
            "message": "Login exitoso",
            "token": token,
            "id": user.id,
            "rol": user.rol
        }