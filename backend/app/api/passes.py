"""
Pass generation API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from pathlib import Path
import os

from ..core.database import get_db
from ..api.auth import get_current_user
from ..models import Entry, User
from ..services.pass_generator import PassGenerator
from ..services.email_service import email_service


router = APIRouter(prefix="/passes", tags=["Passes"])


class PassGenerationRequest(BaseModel):
    """Schema for pass generation request"""
    send_email: bool = False


class PassGenerationResponse(BaseModel):
    """Schema for pass generation response"""
    pass_files: List[str]
    email_sent: bool
    message: str


@router.post("/generate/{entry_id}", response_model=PassGenerationResponse)
async def generate_passes(
    entry_id: int,
    request: PassGenerationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate passes for an entry and optionally send via email

    This endpoint will:
    1. Validate entry exists and user has access
    2. Generate QR code passes based on allocated pass types
    3. Optionally send email with passes attached
    4. Update pass generation flags in database
    5. Return list of generated pass files
    """
    # Get entry
    entry = db.query(Entry).filter(Entry.id == entry_id).first()

    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found"
        )

    # Check access - users can only generate for their own entries (unless admin)
    if entry.username != current_user.username and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )

    # Check if entry has any passes allocated
    if not any([entry.exhibition_day1, entry.exhibition_day2, entry.interactive_sessions, entry.plenary]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No passes allocated for this entry"
        )

    # Initialize pass generator
    pass_generator = PassGenerator()

    try:
        # Generate passes (includes QR passes + DND + Event Flow attachments)
        all_files = pass_generator.generate_passes_for_entry(entry, current_user.username)

        # Filter to get only QR pass files (not DND/Event Flow)
        qr_pass_files = [
            f for f in all_files
            if not (f.name.startswith('DND_') or f.name.startswith('EF-'))
        ]

        # Update pass generation flags
        if entry.exhibition_day1:
            entry.pass_generated_exhibition_day1 = True
        if entry.exhibition_day2:
            entry.pass_generated_exhibition_day2 = True
        if entry.interactive_sessions:
            entry.pass_generated_interactive_sessions = True
        if entry.plenary:
            entry.pass_generated_plenary = True

        db.commit()

        # Prepare response
        pass_file_names = [f.name for f in qr_pass_files]
        email_sent = False
        message = f"Generated {len(pass_file_names)} pass(es) successfully"

        # Send email if requested
        if request.send_email:
            try:
                # Send email with all attachments (QR passes + DND + Event Flow)
                email_sent = email_service.send_pass_email(
                    recipient_email=entry.email,
                    recipient_name=entry.name,
                    pass_files=all_files  # Send all files including DND/Event Flow
                )

                if email_sent:
                    message += f" and email sent to {entry.email}"
                else:
                    message += " but email sending failed"

            except Exception as e:
                # Don't fail the whole request if email fails
                message += f" but email error: {str(e)}"

        return PassGenerationResponse(
            pass_files=pass_file_names,
            email_sent=email_sent,
            message=message
        )

    except Exception as e:
        # Rollback database changes if pass generation failed
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Pass generation failed: {str(e)}"
        )


@router.get("/check/{entry_id}")
async def check_pass_status(
    entry_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Check which passes have been generated for an entry

    Returns status of all pass types for the entry
    """
    # Get entry
    entry = db.query(Entry).filter(Entry.id == entry_id).first()

    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found"
        )

    # Check access
    if entry.username != current_user.username and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )

    return {
        "entry_id": entry.id,
        "name": entry.name,
        "email": entry.email,
        "passes_allocated": {
            "exhibition_day1": entry.exhibition_day1,
            "exhibition_day2": entry.exhibition_day2,
            "interactive_sessions": entry.interactive_sessions,
            "plenary": entry.plenary
        },
        "passes_generated": {
            "exhibition_day1": entry.pass_generated_exhibition_day1,
            "exhibition_day2": entry.pass_generated_exhibition_day2,
            "interactive_sessions": entry.pass_generated_interactive_sessions,
            "plenary": entry.pass_generated_plenary
        },
        "all_generated": all([
            entry.pass_generated_exhibition_day1 if entry.exhibition_day1 else True,
            entry.pass_generated_exhibition_day2 if entry.exhibition_day2 else True,
            entry.pass_generated_interactive_sessions if entry.interactive_sessions else True,
            entry.pass_generated_plenary if entry.plenary else True
        ])
    }


@router.get("/download/{entry_id}/{filename}")
async def download_pass(
    entry_id: int,
    filename: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Download a generated pass file

    Returns the pass file as a downloadable attachment
    """
    # Get entry
    entry = db.query(Entry).filter(Entry.id == entry_id).first()

    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found"
        )

    # Check access - users can only download their own passes (unless admin)
    if entry.username != current_user.username and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )

    # Get the generated_passes directory path
    project_root = Path(__file__).parent.parent.parent.parent
    passes_dir = project_root / "generated_passes"
    file_path = passes_dir / filename

    # Check if file exists
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pass file not found: {filename}"
        )

    # Return file as download
    return FileResponse(
        path=str(file_path),
        filename=filename,
        media_type="image/png"
    )
