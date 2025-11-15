#!/usr/bin/env python3
"""
Send test exhibitor email via Render API
"""
import requests
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

def send_test_via_api():
    """Send test exhibitor email via Render API"""

    print("=" * 70)
    print("TEST EXHIBITOR EMAIL VIA API")
    print("=" * 70)
    print()

    # Get database session
    db = next(get_db())

    # Get first exhibitor as a test case
    exhibitor = db.query(Entry).filter(Entry.is_exhibitor_pass == True).first()

    if not exhibitor:
        print("❌ No exhibitor found in database!")
        return

    print(f"📋 Using exhibitor: {exhibitor.name} (ID: {exhibitor.id})")
    print(f"   Username: {exhibitor.username}")
    print(f"   Original email: {exhibitor.email}")
    print()

    # Temporarily update email to test address
    original_email = exhibitor.email
    exhibitor.email = "abhishekvardhan86@gmail.com"
    db.commit()

    print(f"✏️  Temporarily changed email to: abhishekvardhan86@gmail.com")
    print()

    # Call API to generate and send passes
    api_url = f"https://swavlamban2025-backend.onrender.com/api/v1/passes/generate/{exhibitor.id}"

    payload = {
        "send_email": True
    }

    print(f"📡 Calling API: {api_url}")
    print(f"   Payload: {payload}")
    print()

    try:
        response = requests.post(api_url, json=payload, timeout=120)

        print(f"📊 Response Status: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            print("✅ API call successful!")
            print(f"   Message: {result.get('message', 'N/A')}")
            print()
            print("=" * 70)
            print("PLEASE VALIDATE EMAIL:")
            print("=" * 70)
            print("1. Check abhishekvardhan86@gmail.com inbox")
            print("2. Verify schedule change notice at the top")
            print("3. Check all attachments (QR pass + invitation)")
            print("4. Validate email formatting and content")
            print()
        else:
            print(f"❌ API call failed: {response.status_code}")
            print(f"   Response: {response.text}")

    except Exception as e:
        print(f"❌ Error calling API: {e}")
        import traceback
        traceback.print_exc()

    finally:
        # Restore original email
        exhibitor.email = original_email
        db.commit()
        print(f"✏️  Restored original email: {original_email}")

if __name__ == "__main__":
    send_test_via_api()
