from fastapi import FastAPI
from routers.User_router import router_user
from routers.Member_type_router import router_member_type
from routers.Member_router import router_member

app = FastAPI()
app.include_router(router_user)
app.include_router(router_member_type)
app.include_router(router_member)

# Inicializo la base de datos
from config.database import engine, Base
Base.metadata.create_all(bind=engine)

@app.get("/")
def hello_world():
    return {"hello": "world"}
