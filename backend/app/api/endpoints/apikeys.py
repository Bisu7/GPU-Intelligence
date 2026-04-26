from typing import List, Tuple
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session, select
from app.api import deps
from app.models.apikey import APIKey, APIKeyCreate, APIKeyRead
from app.models.user import User
from app.core import security
from app.services.audit_service import audit_service

router = APIRouter()

@router.post("/create")
def create_apikey(
    *,
    db: Session = Depends(deps.get_db),
    apikey_in: APIKeyCreate,
    current_user: User = Depends(deps.get_current_active_user),
    request: Request
):
    raw_key, prefix, key_hash = security.generate_api_key()
    
    db_apikey = APIKey(
        name=apikey_in.name,
        prefix=prefix,
        key_hash=key_hash,
        user_id=current_user.id
    )
    db.add(db_apikey)
    db.commit()
    db.refresh(db_apikey)
    
    audit_service.log(
        db,
        user_id=current_user.id,
        action="apikey_create",
        details=f"Created API Key: {apikey_in.name}",
        request=request
    )
    
    return {
        "id": db_apikey.id,
        "name": db_apikey.name,
        "api_key": raw_key,
        "prefix": db_apikey.prefix,
        "created_at": db_apikey.created_at
    }

@router.get("/", response_model=List[APIKeyRead])
def read_apikeys(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    keys = db.exec(select(APIKey).where(APIKey.user_id == current_user.id)).all()
    return keys

@router.delete("/{key_id}")
def delete_apikey(
    key_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    request: Request
):
    key = db.get(APIKey, key_id)
    if not key or key.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="API Key not found")
    
    db.delete(key)
    db.commit()
    
    audit_service.log(
        db,
        user_id=current_user.id,
        action="apikey_delete",
        details=f"Deleted API Key: {key.name}",
        request=request
    )
    
    return {"message": "API Key deleted"}
