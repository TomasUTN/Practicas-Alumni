from config.database import Base
from sqlalchemy import Column, String, Enum, Integer
import enum


class Rol(enum.Enum):
    admin = "admin"
    client = "client"
    
class User_db(Base):
    __tablename__ = "user"
    
    id = Column(Integer, primary_key=True)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(100), nullable=False)
    rol = Column(Enum(Rol))