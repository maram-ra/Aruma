import json
from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}

class Item(BaseModel):
    name: str
    age: int

@app.post("/change")
def read_item(item:Item):
    with open(r"C:\Users\osatt\OneDrive\المستندات\Aruma\Aruma\db.json", "r+", encoding="utf-8") as f:

        data = json.load(f)
        data["name"] = item.name
        data["age"] = item.age
        f.seek(0)
        json.dump(data, f, indent=4)
        f.truncate()
        return item
