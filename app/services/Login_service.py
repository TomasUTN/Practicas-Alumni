import uuid
from datetime import datetime, timedelta
from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.User_table import User_db
from schemes.User_class import User_log

# Diccionario global de sesiones
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

        # Generar token aleatorio
        token = str(uuid.uuid4())

        # Guardar sesión con hora de expiración (30 minutos)
        sesiones[token] = {
            "id": user.id,
            "rol": user.rol,
            "email": user.email,
        }

        return {
            "message": "Login exitoso",
            "token": token,
            "email": user.email,
            "id": user.id,
            "rol": user.rol
        }

    def verificar_sesion(self, token: str):
        """
        Verifica si la sesión es válida (existe y no expiró)
        """
        sesion = sesiones.get(token)
        if not sesion:
            raise HTTPException(status_code=401, detail="Token inválido o sesión cerrada")
        return sesion

    def login_delete(self, token: str):
        """
        Cierra la sesión (logout): elimina el token de la memoria
        """
        if token not in sesiones:
            raise HTTPException(status_code=401, detail="Token inválido o sesión inexistente")

        del sesiones[token]
        return {"message": "Sesión cerrada correctamente"}
