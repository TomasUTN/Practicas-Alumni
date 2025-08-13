from fastapi import APIRouter,Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from schemes.Member_class import Member_edit_create, Member_class
from services.Member_services import Member_services

router_member = APIRouter(prefix="/member", tags=["Member"]) # en esta linea hago que todas las rutas comiencen con /member

@router_member.get("/", response_model=list[Member_class])
def get_all_member(db: Session = Depends(get_db)):
    return Member_services(db).get_all_members()