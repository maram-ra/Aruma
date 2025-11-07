from fastapi import APIRouter, HTTPException, Depends
from database import repo
from ._deps import get_current_user

router = APIRouter()

@router.put("/contracts/{contract_id}/confirm")
def confirm_contract(contract_id: str, current_user: dict = Depends(get_current_user)):
    try:
        if current_user.get("user_type") != "client":
            raise HTTPException(status_code=403, detail="Clients only")
        updated = repo.confirm_contract(contract_id=contract_id, client_id=str(current_user.get("sub")))
        if not updated:
            raise HTTPException(status_code=404, detail="Contract not found or not owned by this client")
        return {"message": "confirmed", "contract_id": contract_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
