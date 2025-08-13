from fastapi import APIRouter,Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from schemes.Member_type_class import Member_type_edit_create, Member_type
from services.Member_type_services import Member_type_services

router_member_type = APIRouter(prefix="/member_type", tags=["Member_type"]) # en esta linea hago que todas las rutas comiencen con /member_type

@router_member_type.get("/", response_model=list[Member_type])
def get_member_type(db: Session = Depends(get_db)):
    return Member_type_services(db).get_all_member_type()

@router_member_type.get("/{id}", response_model=Member_type)
def get_member_type_by_id(id:int, db: Session = Depends(get_db)):
    return Member_type_services(db).get_member_type_by_id(id)

@router_member_type.post("/create", response_model=list[Member_type])
def create_member_type(new_member_type_data: Member_type_edit_create, db: Session = Depends(get_db)):
    return Member_type_services(db).create_member_type(new_member_type_data)

@router_member_type.put("/edit/{id}", response_model=list[Member_type])
def edit_member_type(id:int, new_member_type_data:Member_type_edit_create,db: Session = Depends(get_db)):
    update = Member_type_services(db).edit_member_type(id,new_member_type_data)
    if not update:
        raise HTTPException(status_code=404, detail="Tipo de miembro no encontrado")
    return update

@router_member_type.delete("/delete/{id}", response_model=list[Member_type])
def delete_member_type(id:int, db: Session = Depends(get_db)):
    delete = Member_type_services(db).delete_member_type(id)
    if not delete:
        raise HTTPException(status_code=404, detail="tipo de miembro no encontrado")
    return delete