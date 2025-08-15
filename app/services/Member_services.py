from models.Member_table import Member_db
from models.User_table import User_db
from models.Member_type_table import Member_type_db
from schemes.Member_class import Member_edit_create, Member_class
from sqlalchemy.orm import Session
from fastapi import HTTPException
from sqlalchemy.orm import joinedload

class Member_services:
    def __init__(self, db: Session):
        self.db = db    
        
    def get_all_members(self):
        return self.db.query(Member_db).options(joinedload(Member_db.user)).all()
    
    def create_member(self, id_user, photo, name, surname, DNI, date_of_birth, phone, city, post_code, adress, date_of_up, type_member, last_pay, debt):
        # Validar que el usuario existe
        user = self.db.query(User_db).filter(User_db.id == id_user).first()
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        # Validar que el tipo de miembro existe
        member_type = self.db.query(Member_type_db).filter(Member_type_db.id == type_member).first()
        if not member_type:
            raise HTTPException(status_code=404, detail="Tipo de miembro no encontrado")

        new_member = Member_db(
            id_user=id_user,
            photo=photo,
            name=name,
            surname=surname,
            DNI=DNI,
            date_of_birth=date_of_birth,
            phone=phone,
            city=city,
            post_code=post_code,
            adress=adress,
            date_of_up=date_of_up,
            type_member=type_member,
            last_pay=last_pay,
            debt=debt
        )
        self.db.add(new_member)
        self.db.commit()
        self.db.refresh(new_member)
        return new_member