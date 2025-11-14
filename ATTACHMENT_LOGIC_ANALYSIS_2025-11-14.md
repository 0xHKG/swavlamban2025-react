# 📎 COMPLETE ATTACHMENT LOGIC ANALYSIS - November 14, 2025

## 🎯 OBJECTIVE
Map all email attachments based on the **NEW program schedule** (25 Nov AM + PM | 26 Nov Interactive Sessions).

---

## 📂 CURRENT IMAGE INVENTORY

### 1. **DND (Do's & Don'ts) Folder** - `images/DND/`
| File Name | Size | Description | Status |
|-----------|------|-------------|---------|
| `DND_Exhibition.png` | 2.1 MB | Guidelines for Exhibition Hall | ✅ EXISTS - OLD |
| `DND_Interactive.png` | 2.2 MB | Guidelines for Interactive Sessions (Zorawar Hall) | ✅ EXISTS - **NEW** (Nov 13) |
| `DND_Plenary.png` | 2.2 MB | Guidelines for Plenary Session (Zorawar Hall) | ✅ EXISTS - **NEW** (Nov 13) |

**Analysis**: DND files updated with new timing (Be seated by 0945 hrs for Interactive, 1430 hrs for Plenary)

---

### 2. **EF (Event Flow) Folder** - `images/EF/`
| File Name | Size | Description | Status |
|-----------|------|-------------|---------|
| `EF-25.png` | 1.8 MB | **NEW PROGRAM** Day 1 - 25 Nov (AM + PM) | ✅ EXISTS - **NEW** (Nov 13) |
| `EF26.png` | 1.9 MB | **NEW PROGRAM** Day 2 - 26 Nov (Interactive Sessions) | ✅ EXISTS - **NEW** (Nov 13) |
| `EF-PM25.png` | 2.0 MB | **NEW PROGRAM** Day 1 Afternoon - Plenary Session | ✅ EXISTS - **NEW** (Nov 13) |

**Analysis**: Event flow completely redesigned for new program structure

**❌ PROBLEM IDENTIFIED**: The uploaded images show these schedules:
- **EFAM25.png** - Morning schedule (1000-1145 hrs)
- **EFPM25.png** - Afternoon/Plenary schedule (1500-1700 hrs)
- **EF26.png** - Day 2 schedule (0930-1600 hrs)

But the actual files in folder have different names. Need to map correctly.

---

### 3. **Invitation Folder** - `images/Invitation/`
| File Name | Size | Description | Target Audience | Status |
|-----------|------|-------------|----------------|---------|
| `Inv-25.png` | 1.4 MB | Invitation for **25 Nov at 0930 Hrs** | Exhibition Day 1 visitors | ✅ **NEW** (Nov 14) |
| `Inv-Interactive.png` | 1.4 MB | Invitation for **26 Nov at 0930 Hrs** (Interactive) | Interactive Sessions attendees | ✅ **NEW** (Nov 14) |
| `Inv-Plenary.png` | 1.4 MB | Invitation for **25 Nov at 1430 Hrs** (Plenary) | Plenary Session attendees | ✅ **NEW** (Nov 14) |
| `Inv-26-Exhibition.png` | 561 KB | Invitation for **26 Nov at 1000 Hrs** | Exhibition Day 2 ONLY visitors | ✅ OLD (Nov 9) |
| `Inv-Exhibitors.png` | 581 KB | Invitation for **25 & 26 Nov at 0930 Hrs** | Exhibitors (both days) | ✅ OLD (Nov 9) |

**🔴 CRITICAL ANALYSIS - INVITATION CHANGES**:

**OLD INVITATIONS (Before Nov 14)**:
- Inv-25.png → Day 1 Exhibition
- Inv-26-Exhibition.png → Day 2 Exhibition ONLY
- Inv-Exhibitors.png → Exhibitors (both days)
- Inv-Interactive.png → Interactive Sessions
- Inv-Plenary.png → Plenary Session

**NEW PROGRAM STRUCTURE** (After Nov 14):
The images I analyzed show:

1. **Inv-25.png** (1.4 MB - NEW):
   - "on 25 November 2025 at **0930 Hrs**"
   - This is for the **MORNING session** (Exhibition Inauguration + AM activities)

2. **Inv-Interactive.png** (1.4 MB - NEW):
   - "on 26 November 2025 at **0930 Hrs**"
   - For Interactive Sessions (arrive by 0930 for registration, sessions start 1030)

3. **Inv-Plenary.png** (1.4 MB - NEW):
   - "on 25 November 2025 at **1430 Hrs**"
   - For Plenary Session (afternoon session on Day 1)

4. **Inv-26-Exhibition.png** (561 KB - OLD):
   - "on 26 November 2025 at **1000 Hrs**"
   - For Exhibition Day 2 ONLY visitors (no other sessions)

5. **Inv-Exhibitors.png** (581 KB - OLD):
   - "on 25 & 26 November 2025 at **0930 Hrs**"
   - For Exhibitors (both days)

---

### 4. **Passes Folder** - `images/Passes/`
| File Name | Size | Description | Valid For | Status |
|-----------|------|-------------|-----------|---------|
| `EP-25.png` | 652 KB | Visitor Entry Pass - **25 NOV 25** (Exhibition Only) | Day 1 Exhibition | ✅ EXISTS |
| `EP-26.png` | 656 KB | Visitor Entry Pass - **26 NOV 25** (Exhibition Only) | Day 2 Exhibition | ✅ EXISTS |
| `EP-25n26.png` | 626 KB | Exhibitor Entry Pass - **25 & 26 NOV 25** | Exhibitors (both days) | ✅ EXISTS |
| `EP-INTERACTIVE.png` | 885 KB | Entry Pass - **26 NOV 25** (Interactive Sessions) | Interactive Sessions | ✅ EXISTS |
| `EP-PLENARY.png` | 880 KB | Entry Pass - **25 NOV 25** (Plenary Session) | Plenary Session | ✅ **NEW** (Nov 14) |

**🔴 CRITICAL CHANGE**:
- **EP-PLENARY.png** now says **"25 NOV 25"** (was "26 NOV 25" before)
- **This matches the new program** - Plenary Session moved to Day 1 afternoon

---

## 🔄 NEW ATTACHMENT LOGIC MAPPING

### **SCENARIO 1: EXHIBITOR (Both Days 25-26)**
**Checkbox Selection**: `exhibition_day1` + `exhibition_day2` + `is_exhibitor_pass` = TRUE

**Attachments to send**:
1. ✅ **QR Pass**: `EP-25n26.png` (with QR code)
2. ✅ **Invitation**: `Inv-Exhibitors.png`
3. ❌ **DND**: ~~DND_Exhibition.png~~ (Not sending - exhibitors know the drill)
4. ❌ **Event Flow**: ~~Not needed for exhibitors~~

**Total**: 2 files (1 QR pass + 1 invitation)

---

### **SCENARIO 2: DAY 1 EXHIBITION ONLY VISITOR (25 Nov)**
**Checkbox Selection**: `exhibition_day1` = TRUE (only)

**Attachments to send**:
1. ✅ **QR Pass**: `EP-25.png` (with QR code)
2. ✅ **Invitation**: `Inv-25.png` (0930 Hrs arrival)
3. ✅ **DND**: `DND_Exhibition.png`
4. ✅ **Event Flow**: `EF-25.png` (Day 1 complete schedule)

**Total**: 4 files

---

### **SCENARIO 3: DAY 2 EXHIBITION ONLY VISITOR (26 Nov)**
**Checkbox Selection**: `exhibition_day2` = TRUE (only)

**Attachments to send**:
1. ✅ **QR Pass**: `EP-26.png` (with QR code)
2. ✅ **Invitation**: `Inv-26-Exhibition.png` (1000 Hrs arrival)
3. ✅ **DND**: `DND_Exhibition.png`
4. ✅ **Event Flow**: `EF26.png` (Day 2 schedule)

**Total**: 4 files

---

### **SCENARIO 4: BOTH DAYS EXHIBITION VISITOR (25 + 26 Nov)**
**Checkbox Selection**: `exhibition_day1` + `exhibition_day2` = TRUE (NOT exhibitor)

**Attachments to send**:
1. ✅ **QR Pass Day 1**: `EP-25.png` (with QR code)
2. ✅ **QR Pass Day 2**: `EP-26.png` (with QR code)
3. ✅ **Invitation Day 1**: `Inv-25.png`
4. ✅ **Invitation Day 2**: `Inv-26-Exhibition.png`
5. ✅ **DND**: `DND_Exhibition.png`
6. ✅ **Event Flow Day 1**: `EF-25.png`
7. ✅ **Event Flow Day 2**: `EF26.png`

**Total**: 7 files (2 QR passes + 2 invitations + 1 DND + 2 event flows)

---

### **SCENARIO 5: INTERACTIVE SESSIONS ONLY (26 Nov)**
**Checkbox Selection**: `interactive_sessions` = TRUE (only)

**Attachments to send**:
1. ✅ **QR Pass**: `EP-INTERACTIVE.png` (with QR code)
2. ✅ **Invitation**: `Inv-Interactive.png` (0930 Hrs arrival)
3. ✅ **DND**: `DND-Interactive.png`
4. ✅ **Event Flow**: `EF26.png` (Day 2 schedule showing Interactive Sessions)
5. ❌ **DND_Exhibition**: ~~Not needed~~ (but user CAN access exhibition with this pass)

**Total**: 4 files

**Note**: User can also access Exhibition Hall on 26 Nov with this pass (email body mentions this bonus)

---

### **SCENARIO 6: PLENARY SESSION ONLY (25 Nov Afternoon)**
**Checkbox Selection**: `plenary` = TRUE (only)

**Attachments to send**:
1. ✅ **QR Pass**: `EP-PLENARY.png` (with QR code) - **NOW SAYS "25 NOV 25"**
2. ✅ **Invitation**: `Inv-Plenary.png` (1430 Hrs arrival)
3. ✅ **DND**: `DND-Plenary.png`
4. ✅ **Event Flow**: `EF-PM25.png` (Day 1 afternoon/plenary schedule)

**Total**: 4 files

**Note**: User can also access Exhibition Hall on 25 Nov with this pass (email body mentions this bonus)

---

### **SCENARIO 7: INTERACTIVE + PLENARY (26 Nov + 25 Nov)**
**Checkbox Selection**: `interactive_sessions` + `plenary` = TRUE

**Attachments to send**:
1. ✅ **QR Pass Interactive**: `EP-INTERACTIVE.png` (with QR code)
2. ✅ **QR Pass Plenary**: `EP-PLENARY.png` (with QR code)
3. ✅ **Invitation Interactive**: `Inv-Interactive.png` (26 Nov 0930 Hrs)
4. ✅ **Invitation Plenary**: `Inv-Plenary.png` (25 Nov 1430 Hrs)
5. ✅ **DND Interactive**: `DND-Interactive.png`
6. ✅ **DND Plenary**: `DND-Plenary.png`
7. ✅ **Event Flow Day 2**: `EF26.png` (Interactive Sessions)
8. ✅ **Event Flow Day 1 PM**: `EF-PM25.png` (Plenary Session)

**Total**: 8 files

---

### **SCENARIO 8: EXHIBITION DAY 1 + PLENARY (25 Nov Full Day)**
**Checkbox Selection**: `exhibition_day1` + `plenary` = TRUE

**Attachments to send**:
1. ✅ **QR Pass Exhibition**: `EP-25.png` (with QR code)
2. ✅ **QR Pass Plenary**: `EP-PLENARY.png` (with QR code)
3. ✅ **Invitation**: `Inv-25.png` (0930 Hrs for morning) **OR** `Inv-Plenary.png` (1430 Hrs)
   - **DECISION**: Send BOTH? Or just one?
   - **RECOMMENDATION**: Send **ONLY `Inv-25.png`** (covers full day - morning arrival)
4. ✅ **DND Exhibition**: `DND_Exhibition.png`
5. ✅ **DND Plenary**: `DND-Plenary.png`
6. ✅ **Event Flow Day 1**: `EF-25.png` (covers full day AM + PM)

**Total**: 6 files (2 QR passes + 1 invitation + 2 DNDs + 1 event flow)

---

### **SCENARIO 9: EXHIBITION DAY 2 + INTERACTIVE (26 Nov)**
**Checkbox Selection**: `exhibition_day2` + `interactive_sessions` = TRUE

**Attachments to send**:
1. ✅ **QR Pass Exhibition**: `EP-26.png` (with QR code)
2. ✅ **QR Pass Interactive**: `EP-INTERACTIVE.png` (with QR code)
3. ✅ **Invitation**: `Inv-Interactive.png` (0930 Hrs - covers morning arrival for both)
4. ✅ **DND Exhibition**: `DND_Exhibition.png`
5. ✅ **DND Interactive**: `DND-Interactive.png`
6. ✅ **Event Flow Day 2**: `EF26.png` (covers full day)

**Total**: 6 files (2 QR passes + 1 invitation + 2 DNDs + 1 event flow)

---

### **SCENARIO 10: FULL ACCESS (All 4 Sessions)**
**Checkbox Selection**: `exhibition_day1` + `exhibition_day2` + `interactive_sessions` + `plenary` = TRUE

**Attachments to send**:
1. ✅ **QR Pass Day 1**: `EP-25.png`
2. ✅ **QR Pass Day 2**: `EP-26.png`
3. ✅ **QR Pass Interactive**: `EP-INTERACTIVE.png`
4. ✅ **QR Pass Plenary**: `EP-PLENARY.png`
5. ✅ **Invitation Day 1**: `Inv-25.png` (covers Exhibition Day 1 + Plenary)
6. ✅ **Invitation Day 2**: `Inv-Interactive.png` (covers Exhibition Day 2 + Interactive)
7. ✅ **DND Exhibition**: `DND_Exhibition.png`
8. ✅ **DND Interactive**: `DND-Interactive.png`
9. ✅ **DND Plenary**: `DND-Plenary.png`
10. ✅ **Event Flow Day 1**: `EF-25.png`
11. ✅ **Event Flow Day 2**: `EF26.png`

**Total**: 11 files (4 QR passes + 2 invitations + 3 DNDs + 2 event flows)

---

## 🔧 REQUIRED CODE CHANGES

### 1. **Update `pass_generator.py` - `get_additional_attachments()` method**

**Current Logic** (SIMPLIFIED):
```python
def get_additional_attachments(self, entry: Entry) -> List[Path]:
    attachments = []
    invitation_dir = self.images_dir / "Invitation"

    if entry.is_exhibitor:
        # Exhibitor → Inv-Exhibitors.png
        attachments.append(invitation_dir / "Inv-Exhibitors.png")
    else:
        # Visitors
        if entry.exhibition_day1:
            attachments.append(invitation_dir / "Inv-25.png")

        # Day 2 - Priority order
        if entry.interactive_sessions:
            attachments.append(invitation_dir / "Inv-Interactive.png")
        elif entry.plenary:
            attachments.append(invitation_dir / "Inv-Plenary.png")
        elif entry.exhibition_day2:
            attachments.append(invitation_dir / "Inv-26-Exhibition.png")

    return attachments
```

**🔴 PROBLEM WITH CURRENT LOGIC**:
1. **Plenary is on Day 1**, not Day 2 - need to fix priority logic
2. **Missing DND attachments** entirely
3. **Missing Event Flow attachments** entirely
4. **Invitation logic doesn't handle combinations** properly

---

### 2. **NEW PROPOSED LOGIC** - `get_additional_attachments()`

```python
def get_additional_attachments(self, entry: Entry) -> List[Path]:
    """
    Get Invitations, DNDs, and Event Flow images based on passes allocated

    Returns list of Path objects for additional attachments:
    - Invitations (Invitation/)
    - DND guidelines (DND/)
    - Event Flow schedules (EF/)
    """
    attachments = []
    invitation_dir = self.images_dir / "Invitation"
    dnd_dir = self.images_dir / "DND"
    ef_dir = self.images_dir / "EF"

    # =============================================
    # INVITATION LOGIC
    # =============================================

    if entry.is_exhibitor:
        # Exhibitors (both days)
        inv_file = invitation_dir / "Inv-Exhibitors.png"
        if inv_file.exists():
            attachments.append(inv_file)
    else:
        # Visitors - need day-specific invitations

        # DAY 1 (25 Nov) - Morning or Full Day
        # If user has EITHER exhibition_day1 OR plenary, send Day 1 invitation
        if entry.exhibition_day1 or entry.plenary:
            # Priority: If user has BOTH exhibition AND plenary, send MORNING invitation (Inv-25.png at 0930 Hrs)
            # If user has ONLY plenary, send Plenary invitation (Inv-Plenary.png at 1430 Hrs)
            if entry.exhibition_day1:
                # Morning arrival (covers both Exhibition AM + Plenary PM)
                inv_file = invitation_dir / "Inv-25.png"
                if inv_file.exists():
                    attachments.append(inv_file)
            elif entry.plenary:
                # Afternoon arrival (Plenary only)
                inv_file = invitation_dir / "Inv-Plenary.png"
                if inv_file.exists():
                    attachments.append(inv_file)

        # DAY 2 (26 Nov) - Priority order
        if entry.interactive_sessions:
            # Interactive Sessions (morning arrival 0930 - covers Exhibition too)
            inv_file = invitation_dir / "Inv-Interactive.png"
            if inv_file.exists():
                attachments.append(inv_file)
        elif entry.exhibition_day2:
            # Exhibition Day 2 ONLY
            inv_file = invitation_dir / "Inv-26-Exhibition.png"
            if inv_file.exists():
                attachments.append(inv_file)

    # =============================================
    # DND (DO'S & DON'TS) LOGIC
    # =============================================

    # Exhibition DND - if user has ANY exhibition access
    if entry.exhibition_day1 or entry.exhibition_day2 or entry.is_exhibitor:
        dnd_file = dnd_dir / "DND_Exhibition.png"
        if dnd_file.exists():
            attachments.append(dnd_file)

    # Interactive Sessions DND
    if entry.interactive_sessions:
        dnd_file = dnd_dir / "DND-Interactive.png"
        if dnd_file.exists():
            attachments.append(dnd_file)

    # Plenary Session DND
    if entry.plenary:
        dnd_file = dnd_dir / "DND-Plenary.png"
        if dnd_file.exists():
            attachments.append(dnd_file)

    # =============================================
    # EVENT FLOW LOGIC
    # =============================================

    # Day 1 Event Flow - if user has ANY Day 1 access
    if entry.exhibition_day1 or entry.plenary:
        ef_file = ef_dir / "EF-25.png"
        if ef_file.exists():
            attachments.append(ef_file)

    # Day 2 Event Flow - if user has ANY Day 2 access
    if entry.exhibition_day2 or entry.interactive_sessions:
        ef_file = ef_dir / "EF26.png"
        if ef_file.exists():
            attachments.append(ef_file)

    return attachments
```

---

## ✅ TESTING CHECKLIST

After implementing changes, test these scenarios:

1. ✅ **Exhibitor (both days)** → 2 files (QR + Inv-Exhibitors)
2. ✅ **Day 1 Exhibition only** → 4 files (QR + Inv-25 + DND_Exhibition + EF-25)
3. ✅ **Day 2 Exhibition only** → 4 files (QR + Inv-26-Exhibition + DND_Exhibition + EF26)
4. ✅ **Both days Exhibition** → 7 files (2 QR + 2 Inv + DND_Exhibition + 2 EF)
5. ✅ **Interactive only** → 4 files (QR + Inv-Interactive + DND-Interactive + EF26)
6. ✅ **Plenary only** → 4 files (QR + Inv-Plenary + DND-Plenary + EF-25)
7. ✅ **Interactive + Plenary** → 8 files (2 QR + 2 Inv + 2 DND + 2 EF)
8. ✅ **Day 1 Exhibition + Plenary** → 6 files (2 QR + 1 Inv-25 + 2 DND + 1 EF-25)
9. ✅ **Day 2 Exhibition + Interactive** → 6 files (2 QR + 1 Inv-Interactive + 2 DND + 1 EF26)
10. ✅ **Full Access (all 4)** → 11 files (4 QR + 2 Inv + 3 DND + 2 EF)

---

## 🚨 CRITICAL RISKS

1. **File Size Limits**: Some email providers limit attachment size
   - Current max scenario: 11 files ≈ 8-10 MB
   - Brevo FREE: Should handle this (tested with 6 files = 4.18 MB)

2. **Plenary Session Date Change**:
   - OLD: 26 Nov (Day 2)
   - NEW: 25 Nov (Day 1)
   - **CRITICAL**: Must update EP-PLENARY.png template ✅ DONE

3. **Invitation Timing Updates**:
   - All invitations have specific arrival times
   - Must match event flow schedules

---

## 📝 SUMMARY OF CHANGES NEEDED

### **Files to Update**:
1. ✅ `pass_generator.py` - Rewrite `get_additional_attachments()` method
2. ✅ Test email sending with new logic
3. ✅ Verify all invitation files exist with correct content

### **No Changes Needed**:
1. ✅ `email_service.py` - Already handles multiple attachments correctly
2. ✅ Pass templates (EP-*.png) - All correct
3. ✅ Database schema - No changes needed

---

**Generated**: November 14, 2025 20:45 IST
**Status**: ⚠️ READY FOR IMPLEMENTATION
**Risk Level**: 🟡 MEDIUM (Careful testing required - don't break working system)
