# 📋 TODO LIST - Next Session

**Created**: 2025-01-09
**Priority Items**: Vercel login fix + Admin panel testing
**Status**: Ready for execution

---

## 🔴 CRITICAL (Do First - 5 minutes)

### 1. Fix Vercel Login Issue
**Priority**: HIGHEST - Blocking production
**Time**: 2-5 minutes
**Status**: ⏳ PENDING

**Steps**:
1. [ ] Open Vercel Dashboard (https://vercel.com/dashboard)
2. [ ] Select `swavlamban2025-react` project
3. [ ] Go to Settings → Environment Variables
4. [ ] Add/Update: `VITE_API_URL` = `https://swavlamban2025.streamlit.app`
5. [ ] Select Environment: Production (check the box)
6. [ ] Click "Save"
7. [ ] Go to Deployments tab
8. [ ] Find latest deployment → Click "..." menu → "Redeploy"
9. [ ] Wait 2-3 minutes for deployment
10. [ ] Test login on: https://swavlamban2025-react-hhlk711jj-0xhkgs-projects.vercel.app/
11. [ ] Verify: Login with admin / password works

**Success Criteria**:
- ✅ No "Invalid credentials" error
- ✅ Can login and access dashboard
- ✅ All pages load correctly

**Documentation**: [VERCEL_LOGIN_ISSUE_FIX.md](VERCEL_LOGIN_ISSUE_FIX.md)

---

## ⚠️ HIGH PRIORITY (Browser Testing - 10 minutes)

### 2. Test Admin Panel Table Fixes
**Priority**: HIGH - User requested features
**Time**: 5-10 minutes
**Status**: ⏳ PENDING

**Steps**:
1. [ ] Open http://localhost:5175/ in browser
2. [ ] **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. [ ] Login as admin
4. [ ] Go to Admin Panel page

**Test 1: Page Size Selector**:
5. [ ] Scroll to "All Registered Entries" table
6. [ ] Look at bottom-right corner
7. [ ] Click "10 / page" dropdown
8. [ ] Select "20 / page"
9. [ ] Verify: Table shows 20 entries (not 10)
10. [ ] Select "50 / page"
11. [ ] Verify: Table shows 50 entries
12. [ ] Test "Organization Statistics" table (same steps)
13. [ ] Test "User Management" table (same steps)

**Test 2: Exhibitor Pass Display**:
14. [ ] Scroll to "All Registered Entries" table
15. [ ] Find entries where "Entry Type" = 🏢 Exhibitor
16. [ ] Look at "Passes" column for exhibitor entries
17. [ ] Verify: Shows "Ex-1, Ex-2" (NOT "None")
18. [ ] If exhibitor has additional passes, verify shows: "Ex-1, Ex-2, Interactive" or "Ex-1, Ex-2, Plenary"

**Success Criteria**:
- ✅ Page size selector works on all 3 tables
- ✅ State persists when navigating between pages
- ✅ Exhibitor passes show "Ex-1, Ex-2" in Passes column
- ✅ Total count updates correctly (e.g., "1-50 of 165 entries")

**Documentation**: [ADMIN_PANEL_TABLE_FIX.md](ADMIN_PANEL_TABLE_FIX.md)

---

## 📊 MEDIUM PRIORITY (Optional Testing - 15 minutes)

### 3. Test Bulk Upload Features (Optional)
**Priority**: MEDIUM - Already verified in code
**Time**: 10-15 minutes
**Status**: ⏳ OPTIONAL

**Test Files Prepared**:
- `/tmp/test_user_bulk.csv` - 3 visitor test entries
- `/tmp/test_exhibitor_bulk.csv` - 5 exhibitor test entries

**Test 1: Normal User Bulk Upload**:
1. [ ] Go to "Add Entry" page
2. [ ] Scroll to "Bulk Upload" section
3. [ ] Click "Download CSV Template"
4. [ ] Upload `/tmp/test_user_bulk.csv`
5. [ ] Verify: 3 entries created successfully
6. [ ] Check quota reduced by 3

**Test 2: Admin Exhibitor Bulk Upload**:
7. [ ] Go to "Admin Panel" page
8. [ ] Click "Bulk Upload Exhibitors" tab (Tab 4)
9. [ ] Upload `/tmp/test_exhibitor_bulk.csv`
10. [ ] Verify: 5 exhibitor entries created
11. [ ] Go to "All Registered Entries"
12. [ ] Verify: New exhibitor entries show "Ex-1, Ex-2" in Passes column

**Cleanup** (IMPORTANT):
13. [ ] Delete 8 test entries (3 users + 5 exhibitors)
14. [ ] Verify entry count returns to original

**Documentation**: [BULK_UPLOAD_VERIFICATION_REPORT.md](BULK_UPLOAD_VERIFICATION_REPORT.md)

---

## 📝 LOW PRIORITY (Documentation Review - 5 minutes)

### 4. Review Session Documentation
**Priority**: LOW - Already complete
**Time**: 5 minutes
**Status**: ✅ READY

**Files to Review**:
1. [ ] [SESSION_2025-01-08_SUMMARY.md](SESSION_2025-01-08_SUMMARY.md) - Complete session summary
2. [ ] [TODAY_SUMMARY.md](TODAY_SUMMARY.md) - Quick reference
3. [ ] [VERCEL_LOGIN_ISSUE_FIX.md](VERCEL_LOGIN_ISSUE_FIX.md) - Vercel fix guide
4. [ ] [ADMIN_PANEL_TABLE_FIX.md](ADMIN_PANEL_TABLE_FIX.md) - All 3 fixes documented

---

## 🚀 OPTIONAL (Future Enhancements)

### 5. Deploy FastAPI Backend (Optional - Future)
**Priority**: LOW - Can use Streamlit backend for now
**Time**: 30-60 minutes
**Status**: ⏳ FUTURE

**Options**:
- **Option A**: Deploy to Render.com (FREE)
- **Option B**: Deploy to Railway.app (FREE)
- **Option C**: Keep using Streamlit backend (current)

**When Ready**:
1. [ ] Choose deployment platform
2. [ ] Follow deployment guide
3. [ ] Update Vercel environment variable to new backend URL
4. [ ] Test all functionality with new backend

**Documentation**: [BACKEND_DEPLOYMENT_ISSUE.md](BACKEND_DEPLOYMENT_ISSUE.md)

### 6. Add Fullscreen Modal for Tables (Optional - Future)
**Priority**: LOW - Page size selector is working alternative
**Time**: 30 minutes
**Status**: ⏳ FUTURE

**What to Add**:
1. [ ] Fullscreen button next to Download button
2. [ ] Modal component with table rendered inside
3. [ ] Maximize to full viewport with close button
4. [ ] All pagination features maintained in fullscreen view
5. [ ] Keyboard shortcut (ESC to close)

---

## 📊 SESSION SUMMARY

**Total Tasks**: 6
**Critical**: 1 (Vercel login fix)
**High Priority**: 1 (Browser testing)
**Medium Priority**: 1 (Bulk upload testing - optional)
**Low Priority**: 1 (Documentation review)
**Future**: 2 (Backend deployment, fullscreen modal)

**Estimated Time**:
- Critical tasks: 5 minutes
- High priority: 10 minutes
- Medium priority: 15 minutes (optional)
- **Total minimum**: 15 minutes
- **Total with optional**: 30 minutes

---

## ✅ CHECKLIST QUICK VIEW

**Must Do**:
- [ ] Fix Vercel login (5 min)
- [ ] Test admin panel fixes (10 min)

**Should Do**:
- [ ] Test bulk upload features (15 min - optional)
- [ ] Review documentation (5 min)

**Nice to Have**:
- [ ] Deploy FastAPI backend (future)
- [ ] Add fullscreen modal (future)

---

## 📞 HELP & RESOURCES

**If Stuck**:
- Vercel login issue: See [VERCEL_LOGIN_ISSUE_FIX.md](VERCEL_LOGIN_ISSUE_FIX.md)
- Admin panel testing: See [ADMIN_PANEL_TABLE_FIX.md](ADMIN_PANEL_TABLE_FIX.md)
- Bulk upload testing: See [BULK_UPLOAD_VERIFICATION_REPORT.md](BULK_UPLOAD_VERIFICATION_REPORT.md)

**GitHub Status**:
- Latest commit: `c6598b1`
- All changes synced ✅
- Ready for deployment ✅

---

**Created**: 2025-01-09 00:30 IST
**For**: Next session (when feeling better)
**Priority**: Fix Vercel first, then test admin panel
**Estimated Total Time**: 15-30 minutes
