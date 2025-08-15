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
    import os
    from datetime import datetime
    # Convertir fechas al formato correcto
    try:
        date_of_birth_dt = datetime.strptime(date_of_birth, "%d/%m/%Y").date()
        date_of_up_dt = datetime.strptime(date_of_up, "%d/%m/%Y").date()
        last_pay_dt = datetime.strptime(last_pay, "%d/%m/%Y").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Formato de fecha inválido. Usa DD/MM/YYYY.")

    # Guardar archivo
    static_dir = os.path.join(os.getcwd(), "static", "photos")
    os.makedirs(static_dir, exist_ok=True)
    file_location = os.path.join(static_dir, photo.filename)
    with open(file_location, "wb") as f:
        f.write(await photo.read())
    # Guardar la ruta relativa para la base de datos
    db_path = os.path.relpath(file_location, os.getcwd())
    # Crear el miembro
    return Member_services(db).create_member(
        id_user=id_user,
        photo=db_path,
        name=name,
        surname=surname,
        DNI=DNI,
        date_of_birth=date_of_birth_dt,
        phone=phone,
        city=city,
        post_code=post_code,
        adress=adress,
        date_of_up=date_of_up_dt,
        type_member=type_member,
        last_pay=last_pay_dt,
        debt=debt
    )