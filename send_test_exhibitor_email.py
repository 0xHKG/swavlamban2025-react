#!/usr/bin/env python3
"""
Send test exhibitor email to abhishekvardhan86@gmail.com
Uses existing backend infrastructure
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

from app.core.database import get_db
from app.models.entry import Entry
from app.services.email_service import email_service
from app.services.pass_generator import PassGenerator

def send_test_email():
    """Send test exhibitor email to validation address"""

    print("=" * 70)
    print("TEST EXHIBITOR EMAIL SENDER")
    print("=" * 70)
    print()

    # Get database session
    db = next(get_db())

    # Get first exhibitor as a test case
    exhibitor = db.query(Entry).filter(Entry.is_exhibitor_pass == True).first()

    if not exhibitor:
        print("❌ No exhibitor found in database!")
        return

    print(f"📋 Using exhibitor data from: {exhibitor.name}")
    print(f"   Original email: {exhibitor.email}")
    print(f"   Test email will be sent to: abhishekvardhan86@gmail.com")
    print()

    # Initialize pass generator
    pass_gen = PassGenerator()

    try:
        # Generate passes for exhibitor
        pass_files = pass_gen.generate_passes_for_entry(exhibitor, exhibitor.username)

        if not pass_files:
            print(f"⚠️  No pass files generated!")
            return

        print(f"📎 Generated {len(pass_files)} pass file(s):")
        for pf in pass_files:
            print(f"   - {pf.name}")
        print()

        # Send email to test address (using exhibitor's name but test email)
        result = email_service.send_pass_email(
            recipient_email="abhishekvardhan86@gmail.com",  # Test email
            recipient_name=exhibitor.name,
            pass_files=pass_files,
            pass_type="exhibitor"
        )

        if result:
            print("✅ Test email sent successfully to abhishekvardhan86@gmail.com")
            print()
            print("=" * 70)
            print("PLEASE VALIDATE:")
            print("=" * 70)
            print("1. Schedule change notice appears at the top")
            print("2. All attachments are correct (QR pass, invitations, event flows)")
            print("3. Email formatting is correct")
            print("4. All timings and dates are updated")
            print()
        else:
            print("❌ Test email failed to send")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    send_test_email()
