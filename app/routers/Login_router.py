from fastapi import APIRouter, Depends, Header
from config.database import get_db
from services.Login_service import Login_services
from sqlalchemy.orm import Session
from schemes.User_class import User_log

router_login = APIRouter(prefix="/login", tags=["Login"])

@router_login.post("/")
def login(data: User_log, db: Session = Depends(get_db)):
    return Login_services(db).login(data)

@router_login.post("/logout")
def logout(authorization: str = Header(None), db: Session = Depends(get_db)):
    token = authorization.replace("Bearer ", "") if authorization else None
    return Login_services(db).login_delete(token)

@router_login.get("/verificar")
def verificar(authorization: str = Header(None), db: Session = Depends(get_db)):
    token = authorization.replace("Bearer ", "") if authorization else None
    return Login_services(db).verificar_sesion(token)
