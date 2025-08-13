from config.database import Base
from sqlalchemy import Column, String, Enum, Integer


class Member_type_db(Base):
    __tablename__ = "Member_type"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(String(100), nullable=False)
    price = Column(Integer)
    
