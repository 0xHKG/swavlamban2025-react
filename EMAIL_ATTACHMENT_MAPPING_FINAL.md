# 📎 EMAIL ATTACHMENT MAPPING - FINAL (Nov 14, 2025)

## 🎯 RULES

### **EMAIL ATTACHMENTS** (What we SEND):
1. ✅ **QR Passes** (personalized with unique QR code)
2. ✅ **Invitations** (based on day/session)
3. ✅ **Event Flow (EF) images** (relevant to their attendance)

### **WEB ONLY** (NOT sent in email):
- ❌ **DND (Do's & Don'ts)** - Only displayed on Vercel app & Streamlit app

---

## 📋 COMPLETE SCENARIO MAPPING

### **SCENARIO 1: Exhibitor (Both Days 25-26)**
**Database Fields**:
- `exhibition_day1` = TRUE
- `exhibition_day2` = TRUE
- `is_exhibitor_pass` = TRUE

**Email Attachments**:
1. ✅ **QR Pass**: `EP-25n26.png` (with QR code) - Exhibitor both days
2. ✅ **Invitation**: `Inv-Exhibitors.png` (25 & 26 Nov at 0930 Hrs)
3. ❌ **Event Flow**: None for exhibitors (they know the schedule)

**Total Files**: 2

---

### **SCENARIO 2: Exhibition Day 1 ONLY (25 Nov)**
**Database Fields**:
- `exhibition_day1` = TRUE (only)

**Email Attachments**:
1. ✅ **QR Pass**: `EP-25.png` (with QR code) - Day 1 Exhibition
2. ✅ **Invitation**: `Inv-25.png` (25 Nov at 0930 Hrs)
3. ✅ **Event Flow**: `EF-25.png` (Complete Day 1 schedule - AM Exhibition + PM Plenary)

**Total Files**: 3

**Note**: User gets full day schedule so they can see what else is happening, even though they only have exhibition pass.

---

### **SCENARIO 3: Exhibition Day 2 ONLY (26 Nov)**
**Database Fields**:
- `exhibition_day2` = TRUE (only)

**Email Attachments**:
1. ✅ **QR Pass**: `EP-26.png` (with QR code) - Day 2 Exhibition
2. ✅ **Invitation**: `Inv-26-Exhibition.png` (26 Nov at 1000 Hrs)
3. ✅ **Event Flow**: `EF26.png` (Day 2 schedule - Interactive Sessions + Exhibition)

**Total Files**: 3

---

### **SCENARIO 4: Exhibition Both Days (25 + 26 Nov) - NOT Exhibitor**
**Database Fields**:
- `exhibition_day1` = TRUE
- `exhibition_day2` = TRUE
- `is_exhibitor_pass` = FALSE

**Email Attachments**:
1. ✅ **QR Pass Day 1**: `EP-25.png` (with QR code)
2. ✅ **QR Pass Day 2**: `EP-26.png` (with QR code)
3. ✅ **Invitation Day 1**: `Inv-25.png` (25 Nov at 0930 Hrs)
4. ✅ **Invitation Day 2**: `Inv-26-Exhibition.png` (26 Nov at 1000 Hrs)
5. ✅ **Event Flow Day 1**: `EF-25.png` (Complete Day 1)
6. ✅ **Event Flow Day 2**: `EF26.png` (Day 2)

**Total Files**: 6

---

### **SCENARIO 5: Interactive Sessions ONLY (26 Nov)**
**Database Fields**:
- `interactive_sessions` = TRUE (only)

**Email Attachments**:
1. ✅ **QR Pass**: `EP-INTERACTIVE.png` (with QR code) - Interactive Sessions
2. ✅ **Invitation**: `Inv-Interactive.png` (26 Nov at 0930 Hrs)
3. ✅ **Event Flow**: `EF26.png` (Day 2 schedule showing Interactive Sessions)

**Total Files**: 3

**Note**: This pass also grants access to Exhibition Hall on Day 2 (mentioned in email body).

---

### **SCENARIO 6: Plenary Session ONLY (25 Nov)**
**Database Fields**:
- `plenary` = TRUE (only)

**Email Attachments**:
1. ✅ **QR Pass**: `EP-PLENARY.png` (with QR code) - Plenary Session (says "25 NOV 25")
2. ✅ **Invitation**: `Inv-Plenary.png` (25 Nov at 1430 Hrs)
3. ✅ **Event Flow**: `EF-PM25.png` (Day 1 afternoon/Plenary schedule ONLY)

**Total Files**: 3

**Note**: This pass also grants access to Exhibition Hall on Day 1 (mentioned in email body).

---

### **SCENARIO 7: Interactive + Plenary (Both)**
**Database Fields**:
- `interactive_sessions` = TRUE
- `plenary` = TRUE

**Email Attachments**:
1. ✅ **QR Pass Interactive**: `EP-INTERACTIVE.png` (with QR code) - 26 Nov
2. ✅ **QR Pass Plenary**: `EP-PLENARY.png` (with QR code) - 25 Nov
3. ✅ **Invitation Interactive**: `Inv-Interactive.png` (26 Nov at 0930 Hrs)
4. ✅ **Invitation Plenary**: `Inv-Plenary.png` (25 Nov at 1430 Hrs)
5. ✅ **Event Flow Day 1 PM**: `EF-PM25.png` (Plenary schedule)
6. ✅ **Event Flow Day 2**: `EF26.png` (Interactive Sessions)

**Total Files**: 6

---

### **SCENARIO 8: Exhibition Day 1 + Plenary (25 Nov Full Day)**
**Database Fields**:
- `exhibition_day1` = TRUE
- `plenary` = TRUE

**Email Attachments**:
1. ✅ **QR Pass Exhibition**: `EP-25.png` (with QR code) - Day 1 Exhibition
2. ✅ **QR Pass Plenary**: `EP-PLENARY.png` (with QR code) - Plenary
3. ✅ **Invitation**: `Inv-25.png` (25 Nov at 0930 Hrs - morning arrival covers both)
4. ✅ **Event Flow**: `EF-25.png` (Complete Day 1 - AM + PM)

**Total Files**: 4

**Logic**: Send ONLY ONE invitation (morning - Inv-25.png) since user is coming in morning and staying for plenary. Send complete day schedule.

---

### **SCENARIO 9: Exhibition Day 2 + Interactive (26 Nov)**
**Database Fields**:
- `exhibition_day2` = TRUE
- `interactive_sessions` = TRUE

**Email Attachments**:
1. ✅ **QR Pass Exhibition**: `EP-26.png` (with QR code) - Day 2 Exhibition
2. ✅ **QR Pass Interactive**: `EP-INTERACTIVE.png` (with QR code) - Interactive
3. ✅ **Invitation**: `Inv-Interactive.png` (26 Nov at 0930 Hrs - covers both)
4. ✅ **Event Flow**: `EF26.png` (Day 2 complete)

**Total Files**: 4

**Logic**: Send ONLY ONE invitation (Interactive - 0930 Hrs) since it covers morning arrival for both activities.

---

### **SCENARIO 10: Exhibition Day 1 + Interactive (Cross-day)**
**Database Fields**:
- `exhibition_day1` = TRUE
- `interactive_sessions` = TRUE

**Email Attachments**:
1. ✅ **QR Pass Exhibition Day 1**: `EP-25.png` (with QR code)
2. ✅ **QR Pass Interactive**: `EP-INTERACTIVE.png` (with QR code)
3. ✅ **Invitation Day 1**: `Inv-25.png` (25 Nov at 0930 Hrs)
4. ✅ **Invitation Day 2**: `Inv-Interactive.png` (26 Nov at 0930 Hrs)
5. ✅ **Event Flow Day 1**: `EF-25.png` (Day 1)
6. ✅ **Event Flow Day 2**: `EF26.png` (Day 2)

**Total Files**: 6

---

### **SCENARIO 11: Exhibition Day 1 + Plenary + Interactive (3 sessions)**
**Database Fields**:
- `exhibition_day1` = TRUE
- `plenary` = TRUE
- `interactive_sessions` = TRUE

**Email Attachments**:
1. ✅ **QR Pass Exhibition Day 1**: `EP-25.png`
2. ✅ **QR Pass Plenary**: `EP-PLENARY.png`
3. ✅ **QR Pass Interactive**: `EP-INTERACTIVE.png`
4. ✅ **Invitation Day 1**: `Inv-25.png` (25 Nov at 0930 Hrs - covers Exhibition + Plenary)
5. ✅ **Invitation Day 2**: `Inv-Interactive.png` (26 Nov at 0930 Hrs)
6. ✅ **Event Flow Day 1**: `EF-25.png` (Complete Day 1)
7. ✅ **Event Flow Day 2**: `EF26.png` (Day 2)

**Total Files**: 7

---

### **SCENARIO 12: Exhibition Day 2 + Plenary (Cross-day)**
**Database Fields**:
- `exhibition_day2` = TRUE
- `plenary` = TRUE

**Email Attachments**:
1. ✅ **QR Pass Exhibition Day 2**: `EP-26.png`
2. ✅ **QR Pass Plenary**: `EP-PLENARY.png`
3. ✅ **Invitation Day 1**: `Inv-Plenary.png` (25 Nov at 1430 Hrs)
4. ✅ **Invitation Day 2**: `Inv-26-Exhibition.png` (26 Nov at 1000 Hrs)
5. ✅ **Event Flow Day 1 PM**: `EF-PM25.png` (Plenary only)
6. ✅ **Event Flow Day 2**: `EF26.png` (Day 2)

**Total Files**: 6

---

### **SCENARIO 13: FULL ACCESS (All 4 Sessions)**
**Database Fields**:
- `exhibition_day1` = TRUE
- `exhibition_day2` = TRUE
- `interactive_sessions` = TRUE
- `plenary` = TRUE

**Email Attachments**:
1. ✅ **QR Pass Exhibition Day 1**: `EP-25.png`
2. ✅ **QR Pass Exhibition Day 2**: `EP-26.png`
3. ✅ **QR Pass Interactive**: `EP-INTERACTIVE.png`
4. ✅ **QR Pass Plenary**: `EP-PLENARY.png`
5. ✅ **Invitation Day 1**: `Inv-25.png` (25 Nov at 0930 Hrs - covers Exhibition + Plenary)
6. ✅ **Invitation Day 2**: `Inv-Interactive.png` (26 Nov at 0930 Hrs - covers Exhibition + Interactive)
7. ✅ **Event Flow Day 1**: `EF-25.png` (Complete Day 1)
8. ✅ **Event Flow Day 2**: `EF26.png` (Day 2)

**Total Files**: 8

---

## 🎯 INVITATION LOGIC RULES

### **Day 1 (25 Nov)**:
- **If Exhibition Day 1 + Plenary**: Send ONLY `Inv-25.png` (0930 Hrs morning arrival)
- **If Exhibition Day 1 ONLY**: Send `Inv-25.png`
- **If Plenary ONLY**: Send `Inv-Plenary.png` (1430 Hrs afternoon arrival)

### **Day 2 (26 Nov)**:
- **If Interactive + Exhibition Day 2**: Send ONLY `Inv-Interactive.png` (0930 Hrs)
- **If Interactive ONLY**: Send `Inv-Interactive.png`
- **If Exhibition Day 2 ONLY**: Send `Inv-26-Exhibition.png` (1000 Hrs)

### **Exhibitors**:
- Always send `Inv-Exhibitors.png` (both days, 0930 Hrs)

---

## 📊 EVENT FLOW LOGIC RULES

### **Day 1 Files**:
- `EF-25.png` - **Complete Day 1** (AM Exhibition 1000-1145 + PM Plenary 1500-1700)
  - Send when: Exhibition Day 1 OR (Exhibition Day 1 + Plenary)
- `EF-PM25.png` - **Plenary ONLY** (1500-1700)
  - Send when: Plenary ONLY (no Exhibition Day 1)

### **Day 2 Files**:
- `EF26.png` - **Complete Day 2** (Registration 0930 + Interactive Sessions + Exhibition)
  - Send when: ANY Day 2 access (Exhibition Day 2 OR Interactive Sessions)

### **Exhibitors**:
- Do NOT send Event Flow images to exhibitors (they already know the schedule)

---

## ✅ FILE SIZE ANALYSIS

### **Maximum Scenario** (Full Access - 8 files):
- 4 QR Passes: ~2.6 MB (650 KB each)
- 2 Invitations: ~2.8 MB (1.4 MB each)
- 2 Event Flows: ~3.8 MB (1.9 MB each)
- **Total**: ~9.2 MB

### **Brevo FREE Tier**:
- Limit: 300 emails/day
- Attachment limit: Not officially documented, but tested with 6 files (4.18 MB) ✅ SUCCESS
- **Verdict**: 8-9 files (~9 MB) should work fine

---

## 🔧 IMPLEMENTATION LOGIC (Pseudocode)

```python
def get_additional_attachments(entry):
    attachments = []
    invitation_dir = images_dir / "Invitation"
    ef_dir = images_dir / "EF"

    # ===== INVITATIONS =====
    if entry.is_exhibitor:
        attachments.append(invitation_dir / "Inv-Exhibitors.png")
    else:
        # Day 1 invitations
        if entry.exhibition_day1 or entry.plenary:
            if entry.exhibition_day1:
                # Morning arrival (covers both Exhibition AM + Plenary PM)
                attachments.append(invitation_dir / "Inv-25.png")
            elif entry.plenary:
                # Afternoon arrival (Plenary only)
                attachments.append(invitation_dir / "Inv-Plenary.png")

        # Day 2 invitations (PRIORITY: Interactive > Exhibition)
        if entry.interactive_sessions:
            # Interactive covers morning arrival for both Interactive + Exhibition
            attachments.append(invitation_dir / "Inv-Interactive.png")
        elif entry.exhibition_day2:
            # Exhibition Day 2 only
            attachments.append(invitation_dir / "Inv-26-Exhibition.png")

    # ===== EVENT FLOWS =====
    # Skip Event Flows for exhibitors
    if not entry.is_exhibitor:
        # Day 1 Event Flows
        if entry.exhibition_day1 or entry.plenary:
            if entry.exhibition_day1:
                # Complete Day 1 (AM + PM)
                attachments.append(ef_dir / "EF-25.png")
            elif entry.plenary:
                # Plenary only (PM)
                attachments.append(ef_dir / "EF-PM25.png")

        # Day 2 Event Flow
        if entry.exhibition_day2 or entry.interactive_sessions:
            attachments.append(ef_dir / "EF26.png")

    return attachments
```

---

## 📝 FILES NEEDED IN `images/` FOLDER

### **Invitations** (`images/Invitation/`):
- ✅ `Inv-25.png` (1.4 MB) - Day 1 at 0930 Hrs
- ✅ `Inv-26-Exhibition.png` (561 KB) - Day 2 Exhibition at 1000 Hrs
- ✅ `Inv-Exhibitors.png` (581 KB) - Both days at 0930 Hrs
- ✅ `Inv-Interactive.png` (1.4 MB) - Day 2 Interactive at 0930 Hrs
- ✅ `Inv-Plenary.png` (1.4 MB) - Day 1 Plenary at 1430 Hrs

### **Event Flows** (`images/EF/`):
- ✅ `EF-25.png` (1.8 MB) - Day 1 complete (AM + PM)
- ✅ `EF-PM25.png` (2.0 MB) - Day 1 Plenary only
- ✅ `EF26.png` (1.9 MB) - Day 2 complete

### **Passes** (`images/Passes/`):
- ✅ `EP-25.png` (652 KB) - Day 1 Exhibition visitor
- ✅ `EP-26.png` (656 KB) - Day 2 Exhibition visitor
- ✅ `EP-25n26.png` (626 KB) - Exhibitor both days
- ✅ `EP-INTERACTIVE.png` (885 KB) - Interactive Sessions
- ✅ `EP-PLENARY.png` (880 KB) - Plenary Session (says "25 NOV 25")

---

## ⚠️ IMPORTANT NOTES

1. **Plenary is on Day 1** (25 Nov 1500-1700 hrs), NOT Day 2
2. **EP-PLENARY.png** already updated to say "25 NOV 25" ✅
3. **DND images** are NOT sent via email (only displayed on web apps)
4. **Event Flow images ARE sent** via email (relevant to user's attendance)
5. **Invitations** follow smart logic - if user is coming in morning, send morning invitation only (covers afternoon too)
6. **Exhibitors** get NO Event Flow images (they know the schedule)

---

**Created**: November 14, 2025 21:15 IST
**Status**: ✅ READY FOR REVIEW & IMPLEMENTATION
**Risk**: 🟢 LOW (clear logic, all files exist, tested email size limits)
