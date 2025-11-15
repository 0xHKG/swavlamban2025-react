#!/usr/bin/env python3
"""
Test the production Render API with authentication
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

BASE_URL = "https://swavlamban2025-backend.onrender.com/api/v1"

def test_production_api():
    print("=" * 70)
    print("TESTING PRODUCTION RENDER API")
    print("=" * 70)
    print()

    # Step 1: Login as admin
    print("🔐 Step 1: Logging in as admin...")
    login_url = f"{BASE_URL}/auth/login"
    login_data = {
        "username": "admin",
        "password": "QAZWSXqazwsx@123456"  # Production admin password
    }

    try:
        response = requests.post(login_url, json=login_data, timeout=30)
        if response.status_code != 200:
            print(f"❌ Login failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return

        token_data = response.json()
        access_token = token_data.get("access_token")
        print(f"✅ Login successful!")
        print(f"   Token: {access_token[:20]}...")
        print()

    except Exception as e:
        print(f"❌ Login error: {e}")
        return

    # Step 2: Get an exhibitor from database
    print("📊 Step 2: Getting exhibitor from database...")
    db = next(get_db())
    exhibitor = db.query(Entry).filter(Entry.is_exhibitor_pass == True).first()

    if not exhibitor:
        print("❌ No exhibitor found!")
        return

    print(f"✅ Found exhibitor: {exhibitor.name} (ID: {exhibitor.id})")
    print(f"   Original email: {exhibitor.email}")
    print()

    # Step 3: Temporarily change email to test address
    print("✏️  Step 3: Temporarily changing email to abhishekvardhan86@gmail.com...")
    original_email = exhibitor.email
    exhibitor.email = "abhishekvardhan86@gmail.com"
    db.commit()
    print("✅ Email changed")
    print()

    # Step 4: Call API to generate and send passes
    print("📡 Step 4: Calling Render API to generate & send passes...")
    api_url = f"{BASE_URL}/passes/generate/{exhibitor.id}"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    payload = {
        "send_email": True
    }

    print(f"   URL: {api_url}")
    print(f"   Payload: {payload}")
    print()

    try:
        response = requests.post(api_url, json=payload, headers=headers, timeout=120)

        print(f"📊 Response Status: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            print("✅ API call successful!")
            print(f"   Message: {result.get('message', 'N/A')}")
            print(f"   Email sent: {result.get('email_sent', False)}")
            print()
            print("=" * 70)
            print("PLEASE VALIDATE EMAIL:")
            print("=" * 70)
            print("Check abhishekvardhan86@gmail.com for:")
            print("1. ✅ Schedule change notice at the top")
            print("2. ✅ All correct attachments (QR passes + invitation)")
            print("3. ✅ Proper formatting and content")
            print()
        else:
            print(f"❌ API call failed: {response.status_code}")
            print(f"   Response: {response.text}")

    except Exception as e:
        print(f"❌ API call error: {e}")
        import traceback
        traceback.print_exc()

    finally:
        # Step 5: Restore original email
        print()
        print("✏️  Step 5: Restoring original email...")
        exhibitor.email = original_email
        db.commit()
        print(f"✅ Restored email to: {original_email}")

if __name__ == "__main__":
    test_production_api()
