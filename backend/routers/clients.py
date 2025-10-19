
from fastapi import APIRouter, HTTPException, Depends
from storage.json_repo import JSONRepository
from ._deps import get_current_user

router = APIRouter(prefix="/clients", tags=["clients"])
repo = JSONRepository()

@router.get("/{client_id}")
def get_client(client_id: str, user=Depends(get_current_user)):
    if user["user_type"] != "client" or user["sub"] != client_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    c = repo.get_user("client", client_id)
    if not c:
        raise HTTPException(status_code=404, detail="Client not found")
    c.pop("password", None)
    return c

@router.get("/{client_id}/requests")
def my_requests(client_id: str, user=Depends(get_current_user)):
    if user["user_type"] != "client" or user["sub"] != client_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    return {"requests": repo.list_requests_for_client(client_id)}
