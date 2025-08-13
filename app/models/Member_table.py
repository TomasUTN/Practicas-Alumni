from config.database import Base
from sqlalchemy import Column, String, ForeignKey,  Integer,BigInteger, Date
from sqlalchemy.orm import relationship

class Member_db(Base):
    __tablename__ = "Member"
    
    id = Column(Integer, primary_key=True)
    id_user = Column(Integer, ForeignKey('user.id'))
    photo = Column(String(500), nullable=False)
    name = Column(String(100), nullable=False)
    surname = Column(String(100), nullable=False)
    DNI = Column(Integer, nullable=False)
    date_of_birth = Column(Date, nullable=False)
    phone = Column(BigInteger, nullable=False)
    city = Column(String(150))
    post_code = Column(Integer)
    adress = Column(String(200))
    date_of_up = Column(Date, nullable=False)
    type_member = Column(Integer, ForeignKey('Member_type.id'), nullable=False)
    last_pay = Column(Date,nullable=False)
    debt = Column(Integer, nullable=False)
    user = relationship("User_db")  # Agrega esta línea