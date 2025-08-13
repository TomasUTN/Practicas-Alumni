from fastapi import APIRouter,Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from schemes.User_class import User_scheme, User_edit_create
from services.User_services import User_services

router_user = APIRouter(prefix="/user", tags=["Users"]) # en esta linea hago que todas las rutas comiencen con /usuarios


@router_user.get("/", response_model=list[User_scheme])
def get_users(db: Session = Depends(get_db)):
    return User_services(db).get_all_user()


@router_user.get("/by-id/{id}", response_model=User_scheme)
def get_user_by_id(id:int, db:Session = Depends(get_db)):
    return User_services(db).get_user_by_id(id)

@router_user.post("/create", response_model=list[User_scheme])
def create_users(new_user_data: User_edit_create, db: Session = Depends(get_db)):
    return User_services(db).create_user(new_user_data)

@router_user.put("/update/{id}", response_model=list[User_scheme])
def update_user(id:int, new_user_data: User_edit_create, db:Session = Depends(get_db)):
    update = User_services(db).edit_user(id,new_user_data)
    if not update:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return update

@router_user.delete("/delete/{id}", response_model=list[User_scheme])
def delete_user(id:int, db: Session = Depends(get_db)):
    delete = User_services(db).delete_user(id)
    if not delete:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return delete