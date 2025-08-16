from models.Member_table import Member_db
from models.User_table import User_db
from models.Member_type_table import Member_type_db
from schemes.Member_class import Member_edit_create, Member_class
from sqlalchemy.orm import Session
from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import joinedload
import os
from datetime import datetime

class Member_services:
  
    def get_all_members(self):
        return self.db.query(Member_db).options(joinedload(Member_db.user)).all()

    async def create_member(self, id_user, photo, name, surname, DNI, date_of_birth, phone, city, post_code, adress, date_of_up, type_member, last_pay, debt):
        # Validar que el usuario existe
        user = self.db.query(User_db).filter(User_db.id == id_user).first()
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        # Validar que el tipo de miembro existe
        member_type = self.db.query(Member_type_db).filter(Member_type_db.id == type_member).first()
        if not member_type:
            raise HTTPException(status_code=404, detail="Tipo de miembro no encontrado")

        # Convertir fechas
        try:
            date_of_birth_dt = datetime.strptime(date_of_birth, "%d/%m/%Y").date()
            date_of_up_dt = datetime.strptime(date_of_up, "%d/%m/%Y").date()
            last_pay_dt = datetime.strptime(last_pay, "%d/%m/%Y").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Formato de fecha inválido. Usa DD/MM/YYYY.")

        # Guardar archivo
        if isinstance(photo, UploadFile):
            static_dir = os.path.join(os.getcwd(), "static", "photos")
            os.makedirs(static_dir, exist_ok=True)
            file_location = os.path.join(static_dir, photo.filename)
            try:
                with open(file_location, "wb") as f:
                    content = await photo.read()
                    f.write(content)
            except Exception as e:
                print(f"Error guardando archivo: {e}")
            db_path = os.path.relpath(file_location, os.getcwd())
        else:
            db_path = photo  # fallback por si ya es ruta

        new_member = Member_db(
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
        self.db.add(new_member)
        self.db.commit()
        self.db.refresh(new_member)
        return new_member
    
    async def update_member(self, id, name, surname, DNI, date_of_birth, phone, city, post_code, adress, date_of_up, type_member, last_pay, debt, photo):
        from fastapi import UploadFile
        # Buscar el miembro
        member = self.db.query(Member_db).filter(Member_db.id == id).first()
        if not member:
            raise HTTPException(status_code=404, detail="Miembro no encontrado")
        # Validar que el tipo de miembro existe
        member_type = self.db.query(Member_type_db).filter(Member_type_db.id == type_member).first()
        if not member_type:
            raise HTTPException(status_code=404, detail="Tipo de miembro no encontrado")
        # Convertir fechas
        from datetime import datetime
        try:
            date_of_birth_dt = datetime.strptime(date_of_birth, "%d/%m/%Y").date()
            date_of_up_dt = datetime.strptime(date_of_up, "%d/%m/%Y").date()
            last_pay_dt = datetime.strptime(last_pay, "%d/%m/%Y").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Formato de fecha inválido. Usa DD/MM/YYYY.")
        # Actualizar campos (excepto id_user y id)
        member.name = name
        member.surname = surname
        member.DNI = DNI
        member.date_of_birth = date_of_birth_dt
        member.phone = phone
        member.city = city
        member.post_code = post_code
        member.adress = adress
        member.date_of_up = date_of_up_dt
        member.type_member = type_member
        member.last_pay = last_pay_dt
        member.debt = debt
        # Si se sube una nueva foto, guardar y actualizar la ruta
        if photo and isinstance(photo, UploadFile):
            import os
            static_dir = os.path.join(os.getcwd(), "static", "photos")
            os.makedirs(static_dir, exist_ok=True)
            file_location = os.path.join(static_dir, photo.filename)
            with open(file_location, "wb") as f:
                content = await photo.read()
                f.write(content)
            db_path = os.path.relpath(file_location, os.getcwd())
            member.photo = db_path
        self.db.commit()
        self.db.refresh(member)
        return member

    def delete_member(self, id):
        member = self.db.query(Member_db).filter(Member_db.id == id).first()
        if not member:
            raise HTTPException(status_code=404, detail="Miembro no encontrado")
        self.db.delete(member)
        self.db.commit()
        return {"detail": "Miembro eliminado correctamente"}
    def __init__(self, db: Session):
        self.db = db  