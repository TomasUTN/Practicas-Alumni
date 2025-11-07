from fastapi import FastAPI
from routers.User_router import router_user
from routers.Member_type_router import router_member_type
from routers.Member_router import router_member
from routers.Login_router import router_login
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()
app.include_router(router_user)
app.include_router(router_member_type)
app.include_router(router_member)
app.include_router(router_login)

### para que mi front que se esta ejectuando en 127.0.0.1:5500 pueda acceder al back que
### se esta ejecutando en  127.0.0.1:8000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # O especifica ["http://127.0.0.1:5500"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializo la base de datos
from config.database import engine, Base
Base.metadata.create_all(bind=engine)

@app.get("/")
def hello_world():
    return {"hello": "world"}
