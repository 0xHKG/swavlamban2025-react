"""
Admin API endpoints - User and entry management
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from ..core.database import get_db
from ..api.auth import get_current_admin, get_current_user
from ..core.security import hash_password
from ..models import Entry, User
from ..schemas.entry import EntryResponse
from ..schemas.user import UserCreate, UserResponse


router = APIRouter(prefix="/admin", tags=["Admin"])


class UserUpdate(BaseModel):
    """Schema for updating user"""
    organization: str | None = None
    max_entries: int | None = None
    role: str | None = None
    allowed_passes: dict[str, bool] | None = None
    is_active: bool | None = None
    quota_ex_day1: int | None = None
    quota_ex_day2: int | None = None
    quota_interactive: int | None = None
    quota_plenary: int | None = None


class BulkEmailRequest(BaseModel):
    """Schema for bulk email request"""
    entry_ids: List[int]


class BulkEmailResponse(BaseModel):
    """Schema for bulk email response"""
    success: int
    failed: int
    message: str


@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all users (admin only)"""
    users = db.query(User).all()
    return users


@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create new user (admin only)"""
    # Check if username already exists
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Username '{user_data.username}' already exists"
        )

    # Create user
    db_user = User(
        username=user_data.username,
        password_hash=hash_password(user_data.password),
        organization=user_data.organization,
        max_entries=user_data.max_entries,
        role=user_data.role,
        allowed_passes=user_data.allowed_passes or {}
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


@router.put("/users/{username}", response_model=UserResponse)
async def update_user(
    username: str,
    user_update: UserUpdate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update user (admin only)"""
    user = db.query(User).filter(User.username == username).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User '{username}' not found"
        )

    # Update fields
    update_data = user_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    return user


@router.delete("/users/{username}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    username: str,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete user (admin only)"""
    user = db.query(User).filter(User.username == username).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User '{username}' not found"
        )

    # Prevent deleting yourself
    if user.username == current_user.username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )

    db.delete(user)
    db.commit()

    return None


@router.get("/entries", response_model=List[EntryResponse])
async def get_all_entries(
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all entries across all organizations (admin only)"""
    entries = db.query(Entry).all()
    return entries


@router.post("/bulk-email", response_model=BulkEmailResponse)
async def send_bulk_email(
    request: BulkEmailRequest,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Send bulk emails with passes (admin only)

    This endpoint will:
    1. Validate all entry IDs exist
    2. Generate passes for each entry (if not already generated)
    3. Send email with passes to each entry's email address
    4. Return success/failure count
    """
    if not request.entry_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No entry IDs provided"
        )

    # Get all entries
    entries = db.query(Entry).filter(Entry.id.in_(request.entry_ids)).all()

    if len(entries) != len(request.entry_ids):
        found_ids = {e.id for e in entries}
        missing_ids = set(request.entry_ids) - found_ids
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Entries not found: {list(missing_ids)}"
        )

    # TODO: Implement pass generation and email sending
    # For now, just return a placeholder response
    success_count = 0
    failed_count = 0

    # This would be implemented with the email service
    # from ..services.email_service import email_service
    # from ..services.pass_generator import pass_generator
    #
    # for entry in entries:
    #     try:
    #         # Generate passes if not already generated
    #         pass_files = pass_generator.generate_passes_for_entry(entry)
    #
    #         # Send email with passes
    #         email_service.send_pass_email(
    #             recipient_email=entry.email,
    #             recipient_name=entry.name,
    #             pass_files=pass_files
    #         )
    #
    #         # Update pass generation flags
    #         entry.pass_generated_exhibition_day1 = entry.exhibition_day1
    #         entry.pass_generated_exhibition_day2 = entry.exhibition_day2
    #         entry.pass_generated_interactive_sessions = entry.interactive_sessions
    #         entry.pass_generated_plenary = entry.plenary
    #
    #         success_count += 1
    #     except Exception as e:
    #         failed_count += 1
    #         continue
    #
    # db.commit()

    # Placeholder response
    success_count = len(entries)

    return BulkEmailResponse(
        success=success_count,
        failed=failed_count,
        message=f"Bulk email initiated for {len(entries)} entries. Implementation pending."
    )
