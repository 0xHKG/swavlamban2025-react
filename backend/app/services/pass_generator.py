"""
Pass generation service - QR code generation and overlay on pass templates
"""
import qrcode
import json
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional

from ..core.config import settings
from ..core.security import hash_id_number, create_hmac_signature
from ..models import Entry


class PassGenerator:
    """Service for generating event passes with QR codes"""
    
    # Pass template mappings (as per user's practical structure)
    PASS_TEMPLATES = {
        "exhibition_day1_visitor": "EP-25.png",           # Day 1 visitor
        "exhibition_day2_visitor": "EP-26.png",           # Day 2 visitor  
        "exhibition_both_days_exhibitor": "EP-25n26.png", # Exhibitor (both days)
        "interactive_sessions": "EP-INTERACTIVE.png",     # Both panel discussions
        "plenary": "EP-PLENARY.png"                       # Plenary session
    }
    
    # Session details for QR code
    SESSION_DETAILS = {
        "exhibition_day1": {
            "name": "Exhibition - 25 Nov",
            "date": "2025-11-25",
            "time_start": "1000",
            "time_end": "1730",
            "venue": "Exhibition Hall, Manekshaw Centre"
        },
        "exhibition_day2": {
            "name": "Exhibition - 26 Nov",
            "date": "2025-11-26",
            "time_start": "1000",
            "time_end": "1730",
            "venue": "Exhibition Hall, Manekshaw Centre"
        },
        "exhibition_both_days": {
            "name": "Exhibition - 25 & 26 Nov",
            "date": "2025-11-25 to 2025-11-26",
            "time_start": "1000",
            "time_end": "1730",
            "venue": "Exhibition Hall, Manekshaw Centre"
        },
        "exhibition_both_days_exhibitor": {
            "name": "Exhibition - 25 & 26 Nov",
            "date": "2025-11-25 to 2025-11-26",
            "time_start": "1000",
            "time_end": "1730",
            "venue": "Exhibition Hall, Manekshaw Centre"
        },
        "interactive_sessions": {
            "name": "Interactive Sessions I & II - 26 Nov",
            "date": "2025-11-26",
            "time_start": "1030",
            "time_end": "1330",
            "venue": "Zorawar Hall, Manekshaw Centre"
        },
        "plenary": {
            "name": "Plenary Session - 25 Nov",
            "date": "2025-11-25",
            "time_start": "1500",
            "time_end": "1700",
            "venue": "Zorawar Hall, Manekshaw Centre"
        }
    }
    
    def __init__(self):
        self.images_dir = Path(settings.IMAGE_ASSETS_DIR)
        if not self.images_dir.is_absolute():
            # Relative to backend directory
            base_dir = Path(__file__).parent.parent.parent.parent
            self.images_dir = base_dir / settings.IMAGE_ASSETS_DIR.lstrip("../")
        
        self.output_dir = Path(settings.PASS_OUTPUT_DIR)
        if not self.output_dir.is_absolute():
            base_dir = Path(__file__).parent.parent.parent.parent
            self.output_dir = base_dir / settings.PASS_OUTPUT_DIR.lstrip("../")
        
        # Create output directory
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Pass templates directory
        self.passes_dir = self.images_dir / "Passes"
    
    def generate_qr_data(self, entry: Entry, pass_type: str, username: str) -> str:
        """Generate clean text format QR data"""
        session = self.SESSION_DETAILS.get(pass_type, {})

        # Format ID number with hyphens to prevent phone number detection on iPhone
        # Use hyphens instead of spaces (spaces cause blue hyperlinks on iOS)
        id_num = entry.id_number
        if len(id_num) > 4:
            formatted_id = '-'.join([id_num[i:i+4] for i in range(0, len(id_num), 4)])
        else:
            formatted_id = id_num

        # Plain text format with line breaks - readable on all devices
        qr_text = f"""SWAVLAMBAN 2025 ENTRY PASS

Name: {entry.name}
ID Type: {entry.id_type}
ID Number: {formatted_id}

Session: {session.get("name", pass_type.replace("_", " ").title())}
Venue: {session.get("venue", "")}

Valid for entry on specified date and session only."""

        return qr_text
    
    def create_qr_image(self, qr_data: str, pass_type: str, template_filename: str) -> Image.Image:
        """Create QR code - EXACT 2024 code"""
        # EXACT 2024 QR generation
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(qr_data)
        qr.make(fit=True)

        # EXACT 2024 colors - Brown on Beige for ALL passes
        # The beige background creates a light box that stands out on both:
        # - Dark blue Exhibition pass backgrounds (beige box is visible)
        # - Beige/Cream Interactive/Plenary backgrounds (brown QR stands out)
        qr_img = qr.make_image(fill_color="#8B4513", back_color="#F5DEB3")

        return qr_img
    
    def overlay_qr_on_pass(self, pass_template_path: Path, qr_image: Image.Image,
                           output_path: Path, template_filename: str) -> Path:
        """Overlay QR code on pass template - EXACT 2024 code"""
        # Load the pass template
        template = Image.open(pass_template_path)

        # Convert palette mode to RGB to preserve QR code colors
        if template.mode == 'P':
            template = template.convert('RGB')

        # Calculate the size of the left frame
        frame_width = template.width // 3
        frame_height = template.height

        # Resize QR code to fit in the left frame
        qr_size = min(frame_width, frame_height) - 250
        qr_img = qr_image.resize((qr_size, qr_size))

        # Calculate position to paste QR code
        left_margin = 60
        qr_position = (
            left_margin,
            (frame_height - qr_size) // 2
        )

        # Paste QR code onto template
        template.paste(qr_img, qr_position)

        # Save as PNG
        template.save(output_path, "PNG")

        return output_path
    
    def determine_passes_needed(self, entry: Entry) -> List[tuple]:
        """Determine which pass files are needed for this entry"""
        passes = []

        # DEBUG: Log all entry properties
        print(f"🔍 DEBUG determine_passes_needed for Entry {entry.id}:")
        print(f"   - Name: {entry.name}")
        print(f"   - is_exhibitor_pass: {entry.is_exhibitor_pass}")
        print(f"   - is_exhibitor (property): {entry.is_exhibitor}")
        print(f"   - exhibition_day1: {entry.exhibition_day1}")
        print(f"   - exhibition_day2: {entry.exhibition_day2}")
        print(f"   - interactive_sessions: {entry.interactive_sessions}")
        print(f"   - plenary: {entry.plenary}")

        # Check if exhibitor (both exhibition days) - gets combined pass ONLY
        if entry.is_exhibitor:
            print(f"   ✅ Adding exhibition_both_days pass (Exhibitor)")
            passes.append(("exhibition_both_days", self.PASS_TEMPLATES["exhibition_both_days_exhibitor"]))
            # Exhibitors ONLY get exhibition passes - no interactive/plenary
        else:
            # Visitor - gets separate passes for each day
            if entry.exhibition_day1:
                print(f"   ✅ Adding exhibition_day1 pass")
                passes.append(("exhibition_day1", self.PASS_TEMPLATES["exhibition_day1_visitor"]))
            if entry.exhibition_day2:
                print(f"   ✅ Adding exhibition_day2 pass")
                passes.append(("exhibition_day2", self.PASS_TEMPLATES["exhibition_day2_visitor"]))

            # Interactive sessions (VISITORS ONLY)
            if entry.interactive_sessions:
                print(f"   ✅ Adding interactive_sessions pass")
                passes.append(("interactive_sessions", self.PASS_TEMPLATES["interactive_sessions"]))

            # Plenary session (VISITORS ONLY)
            if entry.plenary:
                print(f"   ✅ Adding plenary pass")
                passes.append(("plenary", self.PASS_TEMPLATES["plenary"]))

        print(f"   📊 Total passes to generate: {len(passes)}")
        return passes
    
    def get_additional_attachments(self, entry: Entry) -> List[Path]:
        """
        Get Invitations and Event Flow images based on passes allocated
        Returns list of Path objects for email attachments

        EMAIL ATTACHMENTS:
        - Invitations (Invitation/)
        - Event Flow schedules (EF/)

        NOT sent via email (only for web apps):
        - DND guidelines (DND/)

        Invitation images from images/Invitation/:
        - Inv-25.png - Exhibition Day 1 (0930 Hrs)
        - Inv-26-Exhibition.png - Exhibition Day 2 ONLY (1000 Hrs)
        - Inv-Exhibitors.png - Exhibitors (both days 0930 Hrs)
        - Inv-Interactive.png - Interactive Sessions Day 2 (0930 Hrs)
        - Inv-Plenary.png - Plenary Session Day 1 (1430 Hrs)

        Event Flow images from images/EF/:
        - EF-25.png - Day 1 complete schedule (AM Exhibition + PM Plenary)
        - EF-PM25.png - Day 1 Plenary session only
        - EF26.png - Day 2 complete schedule (Interactive Sessions)
        """
        attachments = []
        invitation_dir = self.images_dir / "Invitation"
        ef_dir = self.images_dir / "EF"

        # =============================================
        # INVITATION LOGIC
        # =============================================

        if entry.is_exhibitor:
            # Exhibitors (both days 25-26)
            inv_file = invitation_dir / "Inv-Exhibitors.png"
            if inv_file.exists():
                attachments.append(inv_file)
                print(f"   📨 Added invitation: Inv-Exhibitors.png")
        else:
            # VISITORS - Day and session-specific invitations

            # DAY 1 (25 Nov) - Morning or Afternoon
            if entry.exhibition_day1 or entry.plenary:
                if entry.exhibition_day1:
                    # Morning arrival (0930 Hrs) - covers Exhibition AM + Plenary PM if both selected
                    inv_file = invitation_dir / "Inv-25.png"
                    if inv_file.exists():
                        attachments.append(inv_file)
                        print(f"   📨 Added invitation: Inv-25.png (Day 1 morning)")
                elif entry.plenary:
                    # Afternoon arrival ONLY (1430 Hrs) - Plenary session only
                    inv_file = invitation_dir / "Inv-Plenary.png"
                    if inv_file.exists():
                        attachments.append(inv_file)
                        print(f"   📨 Added invitation: Inv-Plenary.png (Day 1 afternoon)")

            # DAY 2 (26 Nov) - PRIORITY ORDER (only ONE invitation for Day 2)
            if entry.interactive_sessions:
                # Interactive Sessions (0930 Hrs) - covers Exhibition Day 2 access too
                inv_file = invitation_dir / "Inv-Interactive.png"
                if inv_file.exists():
                    attachments.append(inv_file)
                    print(f"   📨 Added invitation: Inv-Interactive.png (Day 2 morning)")
            elif entry.exhibition_day2:
                # Exhibition Day 2 ONLY (1000 Hrs)
                inv_file = invitation_dir / "Inv-26-Exhibition.png"
                if inv_file.exists():
                    attachments.append(inv_file)
                    print(f"   📨 Added invitation: Inv-26-Exhibition.png (Day 2 exhibition only)")

        # =============================================
        # EVENT FLOW LOGIC - Send only relevant schedules
        # =============================================

        # Skip Event Flows for exhibitors (they know the schedule)
        if not entry.is_exhibitor:
            # DAY 1 Event Flow - Send appropriate EF based on what user is attending
            if entry.exhibition_day1 or entry.plenary:
                if entry.exhibition_day1:
                    # Complete Day 1 (AM Exhibition + PM Plenary)
                    ef_file = ef_dir / "EF-25.png"
                    if ef_file.exists():
                        attachments.append(ef_file)
                        print(f"   📅 Added Event Flow: EF-25.png (Day 1 complete)")
                elif entry.plenary:
                    # Plenary only (PM)
                    ef_file = ef_dir / "EF-PM25.png"
                    if ef_file.exists():
                        attachments.append(ef_file)
                        print(f"   📅 Added Event Flow: EF-PM25.png (Day 1 plenary only)")

            # DAY 2 Event Flow - Send if user has ANY Day 2 access
            if entry.exhibition_day2 or entry.interactive_sessions:
                ef_file = ef_dir / "EF26.png"
                if ef_file.exists():
                    attachments.append(ef_file)
                    print(f"   📅 Added Event Flow: EF26.png (Day 2)")

        return attachments

    def generate_passes_for_entry(self, entry: Entry, username: str) -> List[Path]:
        """
        Generate all passes for an entry and include DND + Event Flow attachments
        Returns list of all files to be attached to email (QR passes + DNDs + Event Flows)
        """
        print(f"🎫 Starting pass generation for Entry {entry.id} ({entry.name})")
        print(f"   Passes directory: {self.passes_dir}")
        print(f"   Output directory: {self.output_dir}")

        passes_needed = self.determine_passes_needed(entry)
        generated_passes = []

        # Generate QR code passes
        for pass_type, template_filename in passes_needed:
            # Get template path
            template_path = self.passes_dir / template_filename

            print(f"   🔍 Checking template: {template_path}")
            print(f"      Template exists: {template_path.exists()}")

            if not template_path.exists():
                print(f"❌ Warning: Template not found: {template_path}")
                continue

            # Generate QR data
            qr_data = self.generate_qr_data(entry, pass_type, username)

            # Create QR image
            qr_img = self.create_qr_image(qr_data, pass_type, template_filename)

            # Output filename
            safe_name = entry.name.replace(" ", "_").replace("/", "-")
            output_filename = f"{safe_name}_{entry.id}_{pass_type}.png"
            output_path = self.output_dir / output_filename

            # Overlay QR on pass (QR already at correct size)
            self.overlay_qr_on_pass(template_path, qr_img, output_path, template_filename)
            generated_passes.append(output_path)

            print(f"✅ Generated pass: {output_filename}")

        # Add DND and Event Flow attachments
        additional_attachments = self.get_additional_attachments(entry)
        generated_passes.extend(additional_attachments)

        if additional_attachments:
            print(f"📎 Added {len(additional_attachments)} additional attachment(s):")
            for attachment in additional_attachments:
                print(f"   - {attachment.name}")

        return generated_passes


# Create singleton instance
pass_generator = PassGenerator()
