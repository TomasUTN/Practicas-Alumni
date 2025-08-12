from models.User_table import User_db,Rol
from schemes.User_class import User_edit_create,User_scheme
from sqlalchemy.orm import Session
from fastapi import HTTPException

class User_services:
    
    def __init__(self, db: Session):
        self.db = db    
    
    def get_all_user(self):
        return self.db.query(User_db).all()

    def get_user_by_id(self, id: int):
        user = self.db.query(User_db).filter(User_db.id == id).first()
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return user
        
    def create_user(self, new_user_data: User_edit_create):
        query = self.db.query(User_db).filter(User_db.email == new_user_data.email.lower())
        existente = query.first()
        if existente:
            raise HTTPException(status_code=400, detail="Email ya registrado por otro usuario")
        new_user = User_db(
            email= new_user_data.email.lower(),
            password=new_user_data.password,
            rol= new_user_data.rol
        )
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        return self.db.query(User_db).all()
    
    def edit_user(self,id:int ,new_user_data: User_edit_create):
        user = self.get_user_by_id(id)
        
        query = self.db.query(User_db).filter(User_db.email == new_user_data.email.lower())
        if id is not None:
            query = query.filter(User_db.id != id)
        existente = query.first()
        if existente:
            raise HTTPException(status_code=400, detail="Email ya registrado por otro usuario")
        
        user.email = new_user_data.email
        user.password = new_user_data.password
        user.rol = new_user_data.rol
        self.db.commit()
        
        return self.db.query(User_db).all()
    


    def delete_user(self, id: int):
        user = self.get_user_by_id(id)
        self.db.delete(user)
        self.db.commit()
        return self.db.query(User_db).all()

        