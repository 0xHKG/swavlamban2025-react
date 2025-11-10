-- ============================================================================
-- FIX MAX_ENTRIES FOR ALL USERS
-- ============================================================================
--
-- This SQL script calculates max_entries from individual quotas:
-- max_entries = max(quota_ex_day1, quota_ex_day2, quota_interactive, quota_plenary)
--
-- Run this directly in Supabase SQL Editor
--
-- ============================================================================

-- Update all users
UPDATE users
SET max_entries = GREATEST(
    quota_ex_day1,
    quota_ex_day2,
    quota_interactive,
    quota_plenary
)
WHERE max_entries != GREATEST(
    quota_ex_day1,
    quota_ex_day2,
    quota_interactive,
    quota_plenary
);

-- Show results
SELECT
    username,
    organization,
    max_entries,
    quota_ex_day1,
    quota_ex_day2,
    quota_interactive,
    quota_plenary,
    GREATEST(quota_ex_day1, quota_ex_day2, quota_interactive, quota_plenary) as calculated_max
FROM users
ORDER BY username;
