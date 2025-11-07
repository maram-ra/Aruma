# routers/debug_repo.py
from fastapi import APIRouter
import os
from database import repo

router = APIRouter(prefix="/debug", tags=["debug"])

@router.get("/which-repo")
def which_repo():
    # مين المستورد عند runtime؟
    name = getattr(repo, "__name__", str(type(repo)))
    mod  = getattr(repo, "__module__", "unknown")
    return {
        "USE_POSTGRES": os.getenv("USE_POSTGRES"),
        "repo_mod": mod,
        "repo_name": name,
    }
