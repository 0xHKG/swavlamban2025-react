# COMPREHENSIVE PASS AUDIT - ALL COMBINATIONS
**Date:** 2025-11-15
**Audit Type:** THOROUGH verification of ALL pass types, QR codes, email texts, and attachments

---

## AUDIT METHODOLOGY
1. Read actual code from git (pass_generator.py + email_service.py)
2. Verify QR code SESSION_DETAILS data
3. Verify email template text for each pass type
4. Verify attachment logic (Invitations + Event Flows)
5. Cross-check ALL timings, dates, venues
6. Identify ALL discrepancies

---

## PASS TYPE 1: EXHIBITOR (Both Days)
**Entry Type:** `is_exhibitor_pass = True`

### QR Code Data (pass_generator.py lines 51-56)
```
Pass Type: exhibition_both_days_exhibitor
Session Name: Exhibition - 25 & 26 Nov
Date: 2025-11-25 to 2025-11-26
Time: 1000-1730 hrs
Venue: Exhibition Hall, Manekshaw Centre
```

### Email Template (email_service.py lines 490-534)
**Subject:**
```
Your Exhibitor Pass for Swavlamban 2025
```

**Body Content:**
```
🏛️ EXHIBITOR PASS (Both Days)
• Day 1: 25 November 2025 (Tuesday) - 1000-1730 hrs
• Day 2: 26 November 2025 (Wednesday) - 1000-1730 hrs
• Venue: Exhibition Hall, Manekshaw Centre

STALL SETUP:
• Venue available for stall setup on AM 24 Nov 25
• Dimensions: 3m X 2.5m
```

### Attachments (pass_generator.py lines 239-244, 282)
**QR Passes:** 1 file
- `{Name}_{ID}_exhibition_both_days.png` (EP-25n26.png template)

**Invitations:** 1 file
- `Inv-Exhibitors.png`

**Event Flows:** NONE (line 282: `if not entry.is_exhibitor`)

**Total Attachments:** 2 files

### ✅ VERIFICATION STATUS: CORRECT
- QR shows: 1000-1730 hrs ✅
- Email shows: 1000-1730 hrs (both days) ✅
- Attachments: 1 QR + 1 Invitation ✅
- No Event Flows (correct for exhibitors) ✅

---

## PASS TYPE 2: VISITOR - Exhibition Day 1 ONLY
**Entry Type:** `exhibition_day1 = True`, all others = False

### QR Code Data (pass_generator.py lines 30-35)
```
Pass Type: exhibition_day1
Session Name: Exhibition - 25 Nov
Date: 2025-11-25
Time: 1000-1730 hrs
Venue: Exhibition Hall, Manekshaw Centre
```

### Email Template (email_service.py lines 257-261)
**In Multi-Pass Email:**
```
📅 EXHIBITION DAY 1 (25 November 2025)
- Time: 1100 - 1730 hrs ⚠️ DISCREPANCY!
- Venue: Exhibition Hall, Manekshaw Centre
- Access: Exhibition viewing, Industry booths
```

### Attachments (pass_generator.py)
**QR Passes:** 1 file
- `{Name}_{ID}_exhibition_day1.png` (EP-25.png template)

**Invitations:** 1 file (lines 250-255)
- `Inv-25.png` (Day 1 morning, 0930 Hrs)

**Event Flows:** 1 file (lines 284-289)
- `EF-25.png` (Day 1 complete schedule)

**Total Attachments:** 3 files

### ❌ CRITICAL DISCREPANCY FOUND!
- **QR Code shows:** 1000-1730 hrs ✅
- **Email template shows:** **1100-1730 hrs** ❌ WRONG START TIME!
- **Should be:** 1000-1730 hrs

**Location of Error:** `email_service.py` line 258

---

## PASS TYPE 3: VISITOR - Exhibition Day 2 ONLY
**Entry Type:** `exhibition_day2 = True`, all others = False

### QR Code Data (pass_generator.py lines 37-42)
```
Pass Type: exhibition_day2
Session Name: Exhibition - 26 Nov
Date: 2025-11-26
Time: 1000-1730 hrs
Venue: Exhibition Hall, Manekshaw Centre
```

### Email Template (email_service.py lines 264-268)
**In Multi-Pass Email:**
```
📅 EXHIBITION DAY 2 (26 November 2025)
- Time: 1000 - 1730 hrs ✅
- Venue: Exhibition Hall, Manekshaw Centre
- Access: Exhibition viewing, Industry booths
```

### Attachments (pass_generator.py)
**QR Passes:** 1 file
- `{Name}_{ID}_exhibition_day2.png` (EP-26.png template)

**Invitations:** 1 file (lines 270-275)
- `Inv-26-Exhibition.png` (Day 2 exhibition only, 1000 Hrs)

**Event Flows:** 1 file (lines 299-303)
- `EF26.png` (Day 2 schedule)

**Total Attachments:** 3 files

### ✅ VERIFICATION STATUS: CORRECT
- QR shows: 1000-1730 hrs ✅
- Email shows: 1000-1730 hrs ✅
- Attachments: 1 QR + 1 Invitation + 1 Event Flow ✅

---

## PASS TYPE 4: VISITOR - Interactive Sessions ONLY
**Entry Type:** `interactive_sessions = True`, all others = False

### QR Code Data (pass_generator.py lines 58-63)
```
Pass Type: interactive_sessions
Session Name: Interactive Sessions I & II - 26 Nov
Date: 2025-11-26
Time: 1030-1330 hrs
Venue: Zorawar Hall, Manekshaw Centre
```

### Email Template (email_service.py lines 278-282)
**In Multi-Pass Email:**
```
💡 INTERACTIVE SESSIONS (26 November 2025)
- Session I: Future & Emerging Technologies (1030-1130 hrs)
- Session II: Boosting iDEX Ecosystem (1200-1330 hrs)
- Venue: Zorawar Hall, Manekshaw Centre
```

### Attachments (pass_generator.py)
**QR Passes:** 1 file
- `{Name}_{ID}_interactive_sessions.png` (EP-INTERACTIVE.png template)

**Invitations:** 1 file (lines 264-269)
- `Inv-Interactive.png` (Day 2 morning, 0930 Hrs)

**Event Flows:** 1 file (lines 299-303)
- `EF26.png` (Day 2 schedule - includes interactive sessions)

**Total Attachments:** 3 files

### ⚠️ BONUS ACCESS NOTE (email_service.py lines 300-305)
Email includes:
```
📝 BONUS ACCESS - EXHIBITION DAY 2:
Your Interactive Sessions pass also grants you access to the Exhibition Hall
on 26 November 2025 (1000-1600 hrs).
```

### ❌ DISCREPANCY IN BONUS ACCESS!
- **Email bonus access says:** 1000-1600 hrs ❌
- **Actual exhibition ends at:** 1730 hrs
- **Should say:** 1000-1730 hrs

**Location of Error:** `email_service.py` line 303

### ✅ VERIFICATION STATUS (QR & Main Content): CORRECT
- QR shows: 1030-1330 hrs ✅
- Email shows: 1030-1130 and 1200-1330 hrs ✅
- Attachments: 1 QR + 1 Invitation + 1 Event Flow ✅
- **But:** Bonus access time is wrong ❌

---

## PASS TYPE 5: VISITOR - Plenary Session ONLY
**Entry Type:** `plenary = True`, all others = False

### QR Code Data (pass_generator.py lines 65-70)
```
Pass Type: plenary
Session Name: Plenary Session - 25 Nov
Date: 2025-11-25
Time: 1500-1700 hrs
Venue: Zorawar Hall, Manekshaw Centre
```

### Email Template (email_service.py lines 271-275)
**In Multi-Pass Email:**
```
🎤 PLENARY SESSION (25 November 2025)
- Time: 1500 - 1700 hrs ✅
- Venue: Zorawar Hall, Manekshaw Centre
- Highlights: Chief Guest Address, Book/MoU Releases
```

### Attachments (pass_generator.py)
**QR Passes:** 1 file
- `{Name}_{ID}_plenary.png` (EP-PLENARY.png template)

**Invitations:** 1 file (lines 256-261)
- `Inv-Plenary.png` (Day 1 afternoon ONLY, 1430 Hrs)

**Event Flows:** 1 file (lines 291-296)
- `EF-PM25.png` (Day 1 plenary/afternoon session only)

**Total Attachments:** 3 files

### ⚠️ BONUS ACCESS NOTE (email_service.py lines 294-299)
Email includes:
```
📝 BONUS ACCESS - EXHIBITION DAY 1:
Your Plenary pass also grants you access to the Exhibition Hall
on 25 November 2025 (1000-1700 hrs).
```

### ❌ DISCREPANCY IN BONUS ACCESS!
- **Email bonus access says:** 1000-1700 hrs ❌
- **Actual exhibition ends at:** 1730 hrs
- **Should say:** 1000-1730 hrs

**Location of Error:** `email_service.py` line 297

### ✅ VERIFICATION STATUS (QR & Main Content): CORRECT
- QR shows: 1500-1700 hrs ✅
- Email shows: 1500-1700 hrs ✅
- Attachments: 1 QR + 1 Invitation + 1 Event Flow ✅
- **But:** Bonus access time is wrong ❌

---

## PASS TYPE 6: VISITOR - Exhibition Day 1 + Plenary
**Entry Type:** `exhibition_day1 = True`, `plenary = True`

### QR Code Data
**2 QR Passes Generated:**
1. Exhibition Day 1: 1000-1730 hrs
2. Plenary: 1500-1700 hrs

### Email Template
**Combined email showing both passes:**
```
📅 EXHIBITION DAY 1 (25 November 2025)
- Time: 1100 - 1730 hrs ⚠️ WRONG START TIME!

🎤 PLENARY SESSION (25 November 2025)
- Time: 1500 - 1700 hrs ✅
```

### Attachments (pass_generator.py)
**QR Passes:** 2 files
- Exhibition Day 1 QR pass
- Plenary QR pass

**Invitations:** 1 file (lines 250-255)
- `Inv-25.png` (Day 1 morning - covers BOTH exhibition and plenary)
- **NO** Inv-Plenary.png (logic: if exhibition_day1, use morning invitation)

**Event Flows:** 2 files
- `EF-25.png` (lines 284-289 - Day 1 morning schedule)
- `EF-PM25.png` (lines 291-296 - Day 1 plenary afternoon)

**Total Attachments:** 5 files (2 QR + 1 Invitation + 2 Event Flows)

### ❌ DISCREPANCY FOUND!
- **Exhibition Day 1 email shows:** 1100-1730 hrs ❌
- **Exhibition Day 1 QR shows:** 1000-1730 hrs ✅
- **Should be:** 1000-1730 hrs

**NO BONUS ACCESS NOTE** (correct - already has exhibition pass)

---

## PASS TYPE 7: VISITOR - Exhibition Day 2 + Interactive Sessions
**Entry Type:** `exhibition_day2 = True`, `interactive_sessions = True`

### QR Code Data
**2 QR Passes Generated:**
1. Exhibition Day 2: 1000-1730 hrs
2. Interactive Sessions: 1030-1330 hrs

### Email Template
**Combined email showing both passes:**
```
📅 EXHIBITION DAY 2 (26 November 2025)
- Time: 1000 - 1730 hrs ✅

💡 INTERACTIVE SESSIONS (26 November 2025)
- Session I: 1030-1130 hrs
- Session II: 1200-1330 hrs
```

### Attachments (pass_generator.py)
**QR Passes:** 2 files
- Exhibition Day 2 QR pass
- Interactive Sessions QR pass

**Invitations:** 1 file (lines 264-269)
- `Inv-Interactive.png` (Day 2 morning - covers BOTH exhibition and interactive)
- **NO** Inv-26-Exhibition.png (logic: interactive takes priority)

**Event Flows:** 1 file (lines 299-303)
- `EF26.png` (Day 2 schedule - covers both exhibition and interactive)

**Total Attachments:** 4 files (2 QR + 1 Invitation + 1 Event Flow)

### ✅ VERIFICATION STATUS: CORRECT
- Exhibition Day 2: 1000-1730 hrs ✅
- Interactive: 1030-1330 hrs ✅
- **NO BONUS ACCESS NOTE** (correct - already has exhibition pass)

---

## PASS TYPE 8: VISITOR - All 4 Passes (Exhibition Both Days + Interactive + Plenary)
**Entry Type:** All flags = True (except is_exhibitor_pass)

### QR Code Data
**4 QR Passes Generated:**
1. Exhibition Day 1: 1000-1730 hrs
2. Exhibition Day 2: 1000-1730 hrs
3. Interactive Sessions: 1030-1330 hrs
4. Plenary: 1500-1700 hrs

### Email Template
**Combined email showing all 4 passes:**
```
📅 EXHIBITION DAY 1 (25 November 2025)
- Time: 1100 - 1730 hrs ⚠️ WRONG START TIME!

📅 EXHIBITION DAY 2 (26 November 2025)
- Time: 1000 - 1730 hrs ✅

🎤 PLENARY SESSION (25 November 2025)
- Time: 1500 - 1700 hrs ✅

💡 INTERACTIVE SESSIONS (26 November 2025)
- Session I: 1030-1130 hrs
- Session II: 1200-1330 hrs
```

### Attachments (pass_generator.py)
**QR Passes:** 4 files

**Invitations:** 2 files
- `Inv-25.png` (lines 250-255 - Day 1 morning, covers exhibition + plenary)
- `Inv-Interactive.png` (lines 264-269 - Day 2 morning, covers exhibition + interactive)

**Event Flows:** 3 files
- `EF-25.png` (lines 284-289 - Day 1 morning)
- `EF-PM25.png` (lines 291-296 - Day 1 plenary)
- `EF26.png` (lines 299-303 - Day 2)

**Total Attachments:** 9 files (4 QR + 2 Invitations + 3 Event Flows)

### ❌ DISCREPANCY FOUND!
- **Exhibition Day 1 email shows:** 1100-1730 hrs ❌
- **Exhibition Day 1 QR shows:** 1000-1730 hrs ✅

**NO BONUS ACCESS NOTES** (correct - already has both exhibition passes)

---

## SUMMARY OF ALL DISCREPANCIES

### 🔴 CRITICAL ERROR 1: Exhibition Day 1 Start Time
**File:** `email_service.py` line 258
**Current:** `- Time: 1100 - 1730 hrs`
**Should Be:** `- Time: 1000 - 1730 hrs`
**Impact:** Affects all visitors with Exhibition Day 1 pass

### 🔴 CRITICAL ERROR 2: Bonus Access - Exhibition Day 1 (Plenary-only users)
**File:** `email_service.py` line 297
**Current:** `on 25 November 2025 (1000-1700 hrs)`
**Should Be:** `on 25 November 2025 (1000-1730 hrs)`
**Impact:** Affects visitors with ONLY plenary pass (no exhibition day 1)

### 🔴 CRITICAL ERROR 3: Bonus Access - Exhibition Day 2 (Interactive-only users)
**File:** `email_service.py` line 303
**Current:** `on 26 November 2025 (1000-1600 hrs)`
**Should Be:** `on 26 November 2025 (1000-1730 hrs)`
**Impact:** Affects visitors with ONLY interactive sessions (no exhibition day 2)

---

## ADDITIONAL VERIFICATION

### Single-Pass Email Templates (email_service.py lines 16-149)
**These are LEGACY templates - NOT USED by current logic**

Checking if they contain errors (in case they're called somewhere):

#### Exhibition Day 1 Template (lines 17-39)
```
- Time: 1000 - 1700 hrs ⚠️ WRONG END TIME!
```
**Should be:** 1000 - 1730 hrs

#### Exhibition Day 2 Template (lines 41-63)
```
- Time: 1000 - 1600 hrs ⚠️ WRONG END TIME!
```
**Should be:** 1000 - 1730 hrs

#### Exhibitor Template (lines 65-91)
```
- Time: Day 1: 1000-1700 hrs | Day 2: 1000-1600 hrs ⚠️ WRONG END TIMES!
```
**Should be:** Day 1: 1000-1730 hrs | Day 2: 1000-1730 hrs

**NOTE:** These templates appear to be UNUSED - the system uses multi-pass email logic (lines 208-458) and exhibitor bulk email (lines 460-635). However, they should still be corrected for consistency.

---

## TOTAL ERRORS FOUND: 6

### ACTIVELY USED CODE (3 errors):
1. ❌ Exhibition Day 1 visitor email: 1100 start time (line 258)
2. ❌ Plenary-only bonus access: 1700 end time (line 297)
3. ❌ Interactive-only bonus access: 1600 end time (line 303)

### LEGACY/UNUSED CODE (3 errors):
4. ⚠️ Single exhibition day1 template: 1700 end time (line 25)
5. ⚠️ Single exhibition day2 template: 1600 end time (line 49)
6. ⚠️ Single exhibitor template: wrong times (line 73)

---

## CORRECT TIMINGS (REFERENCE)

### Exhibition Hours:
- **Day 1 (25 Nov):** 1000-1730 hrs
- **Day 2 (26 Nov):** 1000-1730 hrs

### Interactive Sessions (26 Nov):
- **Session I:** 1030-1130 hrs
- **Session II:** 1200-1330 hrs
- **Combined:** 1030-1330 hrs

### Plenary Session (25 Nov):
- **Time:** 1500-1700 hrs

---

## AUDIT COMPLETED
**Status:** THOROUGH verification complete
**Errors Found:** 6 total (3 critical in active code, 3 in legacy code)
**Next Action:** Fix all 6 errors immediately
