from fastapi import FastAPI
from routers.User_router import router_user

app = FastAPI()
app.include_router(router_user)

# Inicializo la base de datos
from config.database import engine, Base
Base.metadata.create_all(bind=engine)

@app.get("/")
def hello_world():
    return {"hello": "world"}
