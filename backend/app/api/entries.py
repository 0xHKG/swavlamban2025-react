"""
Entries API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from ..core.database import get_db
from ..api.auth import get_current_user
from ..models import Entry, User
from ..schemas.entry import EntryCreate, EntryUpdate, EntryResponse
from pydantic import BaseModel


router = APIRouter(prefix="/entries", tags=["Entries"])


class DashboardStats(BaseModel):
    """Dashboard statistics schema"""
    total_entries: int
    max_entries: int
    remaining_quota: int
    passes_generated: int
    exhibition_day1_count: int
    exhibition_day2_count: int
    interactive_sessions_count: int
    plenary_count: int


@router.get("/my", response_model=List[EntryResponse])
async def get_my_entries(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's entries"""
    entries = db.query(Entry).filter(Entry.username == current_user.username).all()
    return entries


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics for current user"""
    # Get all user's entries
    entries = db.query(Entry).filter(Entry.username == current_user.username).all()

    # Calculate statistics
    total_entries = len(entries)
    max_entries = current_user.max_entries
    remaining_quota = max_entries - total_entries

    # Count passes generated (any entry with at least one pass generated)
    passes_generated = sum(1 for e in entries if (
        e.pass_generated_exhibition_day1 or
        e.pass_generated_exhibition_day2 or
        e.pass_generated_interactive_sessions or
        e.pass_generated_plenary
    ))

    # Count by pass type
    exhibition_day1_count = sum(1 for e in entries if e.exhibition_day1)
    exhibition_day2_count = sum(1 for e in entries if e.exhibition_day2)
    interactive_sessions_count = sum(1 for e in entries if e.interactive_sessions)
    plenary_count = sum(1 for e in entries if e.plenary)

    return DashboardStats(
        total_entries=total_entries,
        max_entries=max_entries,
        remaining_quota=remaining_quota,
        passes_generated=passes_generated,
        exhibition_day1_count=exhibition_day1_count,
        exhibition_day2_count=exhibition_day2_count,
        interactive_sessions_count=interactive_sessions_count,
        plenary_count=plenary_count
    )


@router.post("", response_model=EntryResponse, status_code=status.HTTP_201_CREATED)
async def create_entry(
    entry: EntryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new entry"""
    # Check if user has quota remaining
    current_count = db.query(Entry).filter(Entry.username == current_user.username).count()
    if current_count >= current_user.max_entries:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Entry quota exceeded. Maximum {current_user.max_entries} entries allowed."
        )

    # Check if ID number already exists
    existing_entry = db.query(Entry).filter(Entry.id_number == entry.id_number).first()
    if existing_entry:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Entry with ID number {entry.id_number} already exists"
        )

    # Validate at least one pass is selected (exhibitor pass OR at least one individual pass)
    if not (entry.is_exhibitor_pass or any([entry.exhibition_day1, entry.exhibition_day2, entry.interactive_sessions, entry.plenary])):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one pass must be selected"
        )

    # Validate pass permissions
    if entry.exhibition_day1 and not current_user.allowed_passes.get("exhibition_day1", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to allocate Exhibition Day 1 passes"
        )
    if entry.exhibition_day2 and not current_user.allowed_passes.get("exhibition_day2", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to allocate Exhibition Day 2 passes"
        )
    if entry.interactive_sessions and not current_user.allowed_passes.get("interactive_sessions", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to allocate Interactive Sessions passes"
        )
    if entry.plenary and not current_user.allowed_passes.get("plenary", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to allocate Plenary passes"
        )

    # Create new entry
    db_entry = Entry(
        username=current_user.username,
        name=entry.name,
        phone=entry.phone,
        email=entry.email,
        id_type=entry.id_type,
        id_number=entry.id_number,
        photo_url=entry.photo_url,
        exhibition_day1=entry.exhibition_day1,
        exhibition_day2=entry.exhibition_day2,
        interactive_sessions=entry.interactive_sessions,
        plenary=entry.plenary,
        is_exhibitor_pass=entry.is_exhibitor_pass
    )

    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)

    return db_entry


@router.get("/{entry_id}", response_model=EntryResponse)
async def get_entry(
    entry_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific entry by ID"""
    entry = db.query(Entry).filter(Entry.id == entry_id).first()

    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found"
        )

    # Only allow users to see their own entries (unless admin)
    if entry.username != current_user.username and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )

    return entry


@router.put("/{entry_id}", response_model=EntryResponse)
async def update_entry(
    entry_id: int,
    entry_update: EntryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an existing entry"""
    entry = db.query(Entry).filter(Entry.id == entry_id).first()

    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found"
        )

    # Only allow users to update their own entries (unless admin)
    if entry.username != current_user.username and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )

    # Validate pass permissions if being updated
    if entry_update.exhibition_day1 is not None and entry_update.exhibition_day1 and \
       not current_user.allowed_passes.get("exhibition_day1", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to allocate Exhibition Day 1 passes"
        )
    if entry_update.exhibition_day2 is not None and entry_update.exhibition_day2 and \
       not current_user.allowed_passes.get("exhibition_day2", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to allocate Exhibition Day 2 passes"
        )
    if entry_update.interactive_sessions is not None and entry_update.interactive_sessions and \
       not current_user.allowed_passes.get("interactive_sessions", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to allocate Interactive Sessions passes"
        )
    if entry_update.plenary is not None and entry_update.plenary and \
       not current_user.allowed_passes.get("plenary", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to allocate Plenary passes"
        )

    # Update fields
    update_data = entry_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(entry, field, value)

    db.commit()
    db.refresh(entry)

    return entry


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entry(
    entry_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an entry"""
    entry = db.query(Entry).filter(Entry.id == entry_id).first()

    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found"
        )

    # Only allow users to delete their own entries (unless admin)
    if entry.username != current_user.username and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )

    db.delete(entry)
    db.commit()

    return None
