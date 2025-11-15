#!/usr/bin/env python3
"""
Send exhibitor passes to ALL registered exhibitors via Render API
Uses production API with admin authentication
"""
import requests
import sys
import os
from pathlib import Path
import time

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

def send_all_exhibitor_passes():
    """Send passes to all exhibitors via production API"""

    print("=" * 80)
    print("SEND EXHIBITOR PASSES TO ALL REGISTERED EXHIBITORS")
    print("=" * 80)
    print()

    # Step 1: Login as admin
    print("🔐 Step 1: Logging in as admin...")
    login_url = f"{BASE_URL}/auth/login"
    login_data = {
        "username": "admin",
        "password": "QAZWSXqazwsx@123456"
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
        print()

    except Exception as e:
        print(f"❌ Login error: {e}")
        return

    # Step 2: Get all exhibitors from database
    print("📊 Step 2: Getting all exhibitors from database...")
    db = next(get_db())
    exhibitors = db.query(Entry).filter(Entry.is_exhibitor_pass == True).all()

    if not exhibitors:
        print("❌ No exhibitors found!")
        return

    print(f"✅ Found {len(exhibitors)} exhibitors")
    print()

    # Step 3: Send passes to each exhibitor
    print("=" * 80)
    print(f"📧 Step 3: Sending passes to {len(exhibitors)} exhibitors...")
    print("=" * 80)
    print()

    success_count = 0
    failed_count = 0
    failed_list = []

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    payload = {"send_email": True}

    for idx, exhibitor in enumerate(exhibitors, 1):
        print(f"[{idx}/{len(exhibitors)}] Processing: {exhibitor.name}")
        print(f"   Email: {exhibitor.email}")
        print(f"   ID: {exhibitor.id}")

        api_url = f"{BASE_URL}/passes/generate/{exhibitor.id}"

        try:
            response = requests.post(api_url, json=payload, headers=headers, timeout=120)

            if response.status_code == 200:
                result = response.json()
                print(f"   ✅ Success! {result.get('message', 'Pass generated and email sent')}")
                success_count += 1
            else:
                print(f"   ❌ Failed: {response.status_code}")
                print(f"   Response: {response.text}")
                failed_count += 1
                failed_list.append({
                    "id": exhibitor.id,
                    "name": exhibitor.name,
                    "email": exhibitor.email,
                    "error": f"HTTP {response.status_code}"
                })

        except Exception as e:
            print(f"   ❌ Error: {e}")
            failed_count += 1
            failed_list.append({
                "id": exhibitor.id,
                "name": exhibitor.name,
                "email": exhibitor.email,
                "error": str(e)
            })

        print()

        # Ping health endpoint every 5 requests to keep Render alive
        if idx % 5 == 0:
            try:
                health_url = f"{BASE_URL}/health"
                requests.get(health_url, timeout=5)
                print(f"   💓 Health check ping sent (request {idx}/{len(exhibitors)})")
            except Exception as health_error:
                # Don't fail the whole process if health check fails
                print(f"   ⚠️ Health check failed (non-critical): {health_error}")

        # Small delay to avoid overwhelming the API
        if idx < len(exhibitors):
            time.sleep(2)

    # Step 4: Summary
    print()
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"✅ Success: {success_count}")
    print(f"❌ Failed: {failed_count}")
    print(f"📊 Total: {len(exhibitors)}")
    print()

    if failed_list:
        print("=" * 80)
        print("FAILED EXHIBITORS:")
        print("=" * 80)
        for fail in failed_list:
            print(f"- {fail['name']} ({fail['email']}) - ID: {fail['id']}")
            print(f"  Error: {fail['error']}")
            print()

    print("=" * 80)
    print("DONE!")
    print("=" * 80)

if __name__ == "__main__":
    send_all_exhibitor_passes()
