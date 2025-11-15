#!/usr/bin/env python3
"""
ONE-TIME SCRIPT: Send schedule update email to exhibitors
Notifies about Plenary Session moved from 26 Nov to 25 Nov
This script sends a custom message and is NOT for regular use
"""
import sys
import os
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent / "backend"))

# Override database settings to use Supabase production database
os.environ['USE_SUPABASE'] = 'true'
os.environ['DB_HOST'] = 'aws-1-ap-south-1.pooler.supabase.com'
os.environ['DB_PORT'] = '6543'
os.environ['DB_NAME'] = 'postgres'
os.environ['DB_USER'] = 'postgres.scvzcvpyvmwzigusdsjl'
os.environ['DB_PASSWORD'] = 'Ra3epL4uy45G9qTO'

# Brevo API key and sender email should be set in .env file
# If not set, the script will fail with appropriate error message

from app.core.database import get_db
from app.models.entry import Entry
from app.services.pass_generator import PassGenerator
from app.services.brevo_service import BrevoService

def send_exhibitor_schedule_update():
    """Send schedule update email - FIRST RUN SENDS TEST TO abhishekvardhan86@gmail.com"""

    print("=" * 70)
    print("EXHIBITOR SCHEDULE UPDATE EMAIL SENDER (ONE-TIME)")
    print("=" * 70)
    print()

    # Get database session
    db = next(get_db())

    # Get first exhibitor for TEST email
    exhibitor = db.query(Entry).filter(Entry.is_exhibitor_pass == True).first()

    if not exhibitor:
        print("❌ No exhibitors found in database!")
        return

    print(f"📊 Sending TEST email FIRST for validation")
    print(f"   Using exhibitor data: {exhibitor.name}")
    print(f"   Test will be sent to: abhishekvardhan86@gmail.com")
    print()

    # Use only ONE exhibitor for test
    exhibitors = [exhibitor]

    print("=" * 70)
    print("SENDING TEST EMAIL...")
    print("=" * 70)
    print()

    success_count = 0
    failed_count = 0

    # Initialize pass generator and Brevo service
    pass_gen = PassGenerator()
    brevo = BrevoService()

    for idx, exhibitor in enumerate(exhibitors, 1):
        test_email = "abhishekvardhan86@gmail.com"
        print(f"[{idx}/{len(exhibitors)}] Processing: {exhibitor.name} → {test_email}")

        try:
            # Generate exhibitor passes
            pass_files = pass_gen.generate_passes_for_entry(exhibitor, exhibitor.username)

            if not pass_files:
                print(f"  ⚠️  No pass files generated!")
                failed_count += 1
                continue

            # CUSTOM ONE-TIME EMAIL with schedule change notice
            subject = "IMPORTANT: Schedule Change - Swavlamban 2025"

            html_body = f"""<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6;">
<p>Dear {exhibitor.name.title()},</p>

<h2 style="color: #d32f2f;">IMPORTANT SCHEDULE UPDATE</h2>

<p>View change in programme of chief guest, the plenary session of 26 Nov 25 has been advanced to 1500 Hr on 25 Nov 25. All personnel are required to be seated by 1430 hr.</p>

<hr>
<h3>UPDATED SCHEDULE:</h3>
<hr>

<h4>🎤 PLENARY SESSION - NEW TIMING</h4>
<ul>
<li>Date: 25 November 2025 (Tuesday) [CHANGED FROM 26 NOV]</li>
<li>Time: 1500 - 1700 hrs</li>
<li>Venue: Zorawar Hall, Manekshaw Centre</li>
<li><strong>IMPORTANT: Please be seated by 1430 hrs</strong></li>
</ul>

<hr>
<h3>YOUR EXHIBITOR PASSES:</h3>
<hr>

<h4>🏛️ EXHIBITION PASS (Both Days)</h4>
<ul>
<li>Day 1: 25 November 2025 (Tuesday) - 1000-1700 hrs</li>
<li>Day 2: 26 November 2025 (Wednesday) - 1000-1600 hrs</li>
<li>Venue: Exhibition Hall, Manekshaw Centre</li>
</ul>

<h4>STALL SETUP:</h4>
<ul>
<li>Venue available for stall setup on AM 24 Nov 25</li>
<li>Dimensions: 3m X 2.5m</li>
</ul>

<hr>
<h3>ATTACHMENTS:</h3>
<hr>
<ul>
<li>✅ Your Exhibitor Passes (with QR codes)</li>
<li>✅ Invitation Cards</li>
</ul>

<hr>
<h3>IMPORTANT REMINDERS:</h3>
<hr>
<ol>
<li>🎫 Bring your QR pass (printed or on mobile)</li>
<li>🪪 Valid Government ID required</li>
<li>👔 Formal dress code for Plenary Session</li>
<li>⏰ Arrive early to avoid entry delays</li>
<li>📱 Mobile phones on silent during sessions</li>
</ol>

<hr>
<h3>CONTACT SUPPORT:</h3>
<hr>
<ul>
<li>📞 Phone: 011-26771528</li>
<li>📧 Email: niio-tdac@navy.gov.in</li>
<li>🕐 Hours: 0900-1730 hrs (Mon-Fri)</li>
</ul>

<p>We apologize for any inconvenience caused by this schedule change.</p>

<p>Best regards,<br>
Team Swavlamban 2025<br>
Indian Navy | Innovation & Self-Reliance</p>
</body>
</html>"""

            # Send email using BrevoService (same as registration repo)
            attachment_paths = [str(pf) for pf in pass_files]  # Convert Path objects to strings
            result = brevo.send_email(
                to_email=test_email,
                subject=subject,
                html_content=html_body,
                attachments=attachment_paths
            )

            if result:
                print(f"  ✅ Test email sent successfully!")
                success_count += 1
            else:
                print(f"  ❌ Email failed")
                failed_count += 1

        except Exception as e:
            print(f"  ❌ Error: {e}")
            import traceback
            traceback.print_exc()
            failed_count += 1

        print()

    # Summary
    print("=" * 70)
    print("TEST EMAIL SUMMARY")
    print("=" * 70)
    print(f"✅ Successful: {success_count}")
    print(f"❌ Failed: {failed_count}")
    print()

    if success_count > 0:
        print("🎉 Test email sent! Please check abhishekvardhan86@gmail.com")
        print()
        print("⚠️  TO SEND TO ALL EXHIBITORS:")
        print("   1. Validate the test email")
        print("   2. Modify script to query ALL exhibitors")
        print("   3. Remove test_email override")
        print("   4. Run again")
    else:
        print("❌ Test email failed!")

if __name__ == "__main__":
    send_exhibitor_schedule_update()
