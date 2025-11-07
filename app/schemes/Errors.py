from pydantic import BaseModel


class Error(BaseModel):
    number: int
    detail: str
