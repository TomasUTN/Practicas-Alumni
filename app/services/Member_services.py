from models.Member_table import Member_db
from schemes.Member_class import Member_edit_create, Member_class
from sqlalchemy.orm import Session
from fastapi import HTTPException
from sqlalchemy.orm import joinedload

class Member_services:
    def __init__(self, db: Session):
        self.db = db    
        
    def get_all_members(self):
        return self.db.query(Member_db).options(joinedload(Member_db.user)).all()