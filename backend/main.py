import json
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Root endpoint
@app.get("/")
def read_root():
    return {"Hello": "World"}

# Model for input data
class Item(BaseModel):
    name: str
    age: int

# Endpoint to update db.json
@app.post("/change")
def read_item(item: Item):
    file_path = "C:/Users/osatt/OneDrive/المستندات/Aruma/Aruma/backend/db.json"

    # فتح الملف للقراءة والكتابة
    with open(file_path, "r+", encoding="utf-8") as f:
        data = json.load(f)   # قراءة البيانات
        data["name"] = item.name
        data["age"] = item.age

        f.seek(0)  # رجع المؤشر لأول الملف
        json.dump(data, f, indent=4, ensure_ascii=False)  # اكتب البيانات الجديدة
        f.truncate()  # احذف أي بيانات قديمة زائدة

    return item
