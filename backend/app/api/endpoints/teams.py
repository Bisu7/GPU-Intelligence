from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlmodel import Session, select
from app.api import deps
from app.models.team import Team, TeamCreate, TeamRead
from app.models.user import User, UserRole
from app.services.audit_service import audit_service

router = APIRouter()

@router.post("/create", response_model=TeamRead)
def create_team(
    *,
    request: Request,
    db: Session = Depends(deps.get_db),
    team_in: TeamCreate,
    current_user: User = Depends(deps.check_role([UserRole.SUPER_ADMIN, UserRole.INFRA_MANAGER]))
):
    team = db.exec(select(Team).where(Team.name == team_in.name)).first()
    if team:
        raise HTTPException(
            status_code=400,
            detail="A team with this name already exists.",
        )
    db_team = Team.from_orm(team_in)
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    
    audit_service.log(
        db, 
        user_id=current_user.id, 
        action="team_create", 
        details=f"Created team {db_team.name}",
        request=request
    )
    
    return db_team

@router.get("/", response_model=List[TeamRead])
def read_teams(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
):
    teams = db.exec(select(Team).offset(skip).limit(limit)).all()
    return teams
