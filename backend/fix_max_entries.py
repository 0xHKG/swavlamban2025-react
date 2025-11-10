"""
Fix max_entries for all users by calculating from individual quotas

Logic: max_entries = max(quota_ex_day1, quota_ex_day2, quota_interactive, quota_plenary)

This ensures max_entries represents the maximum number of people a user can invite,
which should equal their highest pass type quota.

NOTE: This script connects to Supabase PostgreSQL database via Render backend.
"""
import os
import sys
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add backend to path
backend_path = Path(__file__).parent
sys.path.insert(0, str(backend_path))

from app.models import User

# Force PostgreSQL connection (Supabase)
DB_HOST = os.getenv("DB_HOST", "db.scvzcvpyvmwzigusdjsl.supabase.co")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "postgres")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD")

if not DB_PASSWORD:
    print("❌ ERROR: DB_PASSWORD environment variable not set!")
    print("Please set DB_PASSWORD to your Supabase database password")
    print("Example: export DB_PASSWORD='your-supabase-password'")
    sys.exit(1)

# Create PostgreSQL connection string
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

print(f"🔌 Connecting to Supabase PostgreSQL: {DB_HOST}:{DB_PORT}/{DB_NAME}")

# Create engine and session
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def fix_max_entries():
    """Fix max_entries for all users based on their quota values"""
    db = SessionLocal()
    try:
        # Get ALL users (not just those with max_entries = 0)
        users = db.query(User).all()

        print("=" * 80)
        print("FIXING MAX_ENTRIES FOR ALL USERS")
        print("=" * 80)
        print(f"\nFound {len(users)} users in database\n")

        updated_count = 0

        for user in users:
            # Calculate correct max_entries from individual quotas
            calculated_max = max(
                user.quota_ex_day1,
                user.quota_ex_day2,
                user.quota_interactive,
                user.quota_plenary
            )

            # Check if update needed
            if user.max_entries != calculated_max:
                print(f"User: {user.username} ({user.organization})")
                print(f"  Current max_entries: {user.max_entries}")
                print(f"  Individual quotas:")
                print(f"    - Ex Day 1: {user.quota_ex_day1}")
                print(f"    - Ex Day 2: {user.quota_ex_day2}")
                print(f"    - Interactive: {user.quota_interactive}")
                print(f"    - Plenary: {user.quota_plenary}")
                print(f"  Calculated max_entries: {calculated_max}")

                # Update
                user.max_entries = calculated_max
                updated_count += 1
                print(f"  ✅ Updated to {calculated_max}")
                print("-" * 80)
            else:
                print(f"✓ {user.username}: Already correct (max_entries = {user.max_entries})")

        # Commit all changes
        if updated_count > 0:
            db.commit()
            print(f"\n{'=' * 80}")
            print(f"✅ Successfully updated {updated_count} users!")
            print(f"{'=' * 80}\n")
        else:
            print(f"\n{'=' * 80}")
            print(f"✅ All users already have correct max_entries values!")
            print(f"{'=' * 80}\n")

        return True

    except Exception as e:
        db.rollback()
        print(f"\n{'=' * 80}")
        print(f"❌ Error fixing max_entries: {e}")
        print(f"{'=' * 80}\n")
        import traceback
        traceback.print_exc()
        return False
    finally:
        db.close()


if __name__ == "__main__":
    print("\n" + "=" * 80)
    print("FIXING MAX_ENTRIES CALCULATION")
    print("=" * 80)
    print("\nLogic: max_entries = max(quota_ex_day1, quota_ex_day2, quota_interactive, quota_plenary)")
    print("This ensures max_entries equals the highest quota a user has.\n")

    success = fix_max_entries()

    if success:
        print("\n✅ Fix completed successfully!")
        print("All users now have correct max_entries values.")
        print("\nYou can now:")
        print("  1. Restart the backend server")
        print("  2. Hard refresh the frontend (Ctrl+Shift+R)")
        print("  3. Check Admin Panel - 0/0 should now show correct values!\n")
    else:
        print("\n❌ Fix failed. Please check the error messages above.\n")
