from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from config.database import get_db
from schemes.Member_class import Member_edit_create, Member_class
from services.Member_services import Member_services

router_member = APIRouter(prefix="/member", tags=["Member"]) # en esta linea hago que todas las rutas comiencen con /member

@router_member.get("/", response_model=list[Member_class])
def get_all_member(db: Session = Depends(get_db)):
    return Member_services(db).get_all_members()


#### este endpoint lo hice asi para que el usuario cargue un archivo y no un str con la ruta
@router_member.post("/create", response_model=Member_class)
async def create_member(
    id_user: int = Form(...),
    name: str = Form(...),
    surname: str = Form(...),
    DNI: int = Form(...),
    date_of_birth: str = Form(...),
    phone: int = Form(...),
    city: str = Form(...),
    post_code: int = Form(...),
    adress: str = Form(...),
    date_of_up: str = Form(...),
    type_member: int = Form(...),
    last_pay: str = Form(...),
    debt: int = Form(...),
    photo: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    return await Member_services(db).create_member(id_user=id_user,photo=photo,name=name,surname=surname,DNI=DNI,date_of_birth=date_of_birth,phone=phone,city=city,post_code=post_code,adress=adress,date_of_up=date_of_up,type_member=type_member,last_pay=last_pay,debt=debt)

@router_member.put("/update/{id}", response_model=Member_class)
async def update_member(
    id: int,
    name: str = Form(...),
    surname: str = Form(...),
    DNI: int = Form(...),
    date_of_birth: str = Form(...),
    phone: int = Form(...),
    city: str = Form(...),
    post_code: int = Form(...),
    adress: str = Form(...),
    date_of_up: str = Form(...),
    type_member: int = Form(...),
    last_pay: str = Form(...),
    debt: int = Form(...),
    photo: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    return await Member_services(db).update_member(id=id,name=name,surname=surname,DNI=DNI,date_of_birth=date_of_birth,phone=phone,city=city,post_code=post_code,adress=adress,date_of_up=date_of_up,type_member=type_member,last_pay=last_pay,debt=debt,photo=photo)

@router_member.delete("/delete/{id}", response_model=dict)
async def delete_member(id: int, db: Session = Depends(get_db)):
    return Member_services(db).delete_member(id)