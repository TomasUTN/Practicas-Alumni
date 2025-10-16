from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config.database import get_db
from schemes.User_class import User_log
from services.Login_service import Login_services

router_login = APIRouter(prefix="/login", tags=["Login"])


@router_login.post("/")
def login_user(data: User_log, db: Session = Depends(get_db)):
    return Login_services(db).login(data)