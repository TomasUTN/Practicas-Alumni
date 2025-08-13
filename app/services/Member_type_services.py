from models.Member_type_table import Member_type_db
from schemes.Member_type_class import Member_type_edit_create, Member_type
from sqlalchemy.orm import Session
from fastapi import HTTPException

class Member_type_services:
    def __init__(self, db: Session):
        self.db = db    
    
    def get_all_member_type(self):
        return self.db.query(Member_type_db).all()
    
    def get_member_type_by_id(self,id:int):
        member_type = self.db.query(Member_type_db).filter(Member_type_db.id == id).first()
        if not member_type:
            raise HTTPException(status_code=404, detail="Tipo de miembro no encontrado")
        return member_type
    
    def create_member_type(self, new_member_type_data:Member_type_edit_create):
            query = self.db.query(Member_type_db).filter(Member_type_db.name == new_member_type_data.name.lower())
            existente = query.first()
            if existente:
                raise HTTPException(status_code=400, detail="Este tipo de miembro ya existe")
            new_member_type = Member_type_db(
                name= new_member_type_data.name.lower(),
                description=new_member_type_data.description,
                price= new_member_type_data.price)
            self.db.add(new_member_type)
            self.db.commit()
            self.db.refresh(new_member_type)
            return self.db.query(Member_type_db).all()        
        
    
    def edit_member_type(self,id:int, new_member_type_data: Member_type_edit_create):
        member_type = self.get_member_type_by_id(id)

        existente = (
            self.db.query(Member_type_db)
            .filter(Member_type_db.name == new_member_type_data.name.lower())
            .filter(Member_type_db.id != id)
            .first())

        if existente:
            raise HTTPException(status_code=400, detail="Este tipo de miembro ya existe")

        member_type.name = new_member_type_data.name
        member_type.description = new_member_type_data.description
        member_type.price = new_member_type_data.price
        self.db.commit()
        self.db.refresh(member_type)
        
        return self.db.query(Member_type_db).all()
    
    def delete_member_type(self, id:int):
        member_type = self.get_member_type_by_id(id)
        self.db.delete(member_type)
        self.db.commit()
        return self.db.query(Member_type_db).all()