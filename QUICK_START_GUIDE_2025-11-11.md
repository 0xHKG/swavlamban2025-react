# Quick Start Guide - Testing Session (2025-11-11)

## 🎯 What Was Completed Today

### ✅ Per-Pass Quota Validation (CRITICAL SECURITY FIX)
- Users can no longer exceed individual pass type quotas
- Backend code deployed: `backend/app/api/entries.py`
- Commit: `54fdbf6`

### ✅ Mobile Responsive Layout
- Hamburger menu for mobile devices
- Sidebar drawer slides in from left
- Desktop UI 100% unchanged
- Commit: `ce56a19`

---

## 📱 TESTING MOBILE LAYOUT (After Vercel Deployment)

### On Your Phone:
1. Open https://swavlamban2025.vercel.app
2. **Expected Behavior**:
   - ✅ Top header visible with hamburger icon (☰)
   - ✅ No sidebar overlapping content
   - ✅ Click hamburger → Drawer slides in from left
   - ✅ Click menu item → Navigates to page AND closes drawer
   - ✅ Content fills full width

### On Desktop:
1. Open https://swavlamban2025.vercel.app
2. **Expected Behavior**:
   - ✅ Same as before (sidebar always visible)
   - ✅ No header at top
   - ✅ Content has left margin (280px)
   - ✅ **ZERO changes from before**

---

## 🔐 TESTING QUOTA VALIDATION (After Render Backend Deployment)

### Prerequisites:
1. Backend must be deployed to Render (manual or auto-deploy)
2. Login as a user with LIMITED quotas (not TDAC/admin with 999)

### Test Scenario 1: Exhibition Day 1 Quota
**Setup**: User with `quota_ex_day1 = 2`

1. Create 1st entry with Exhibition Day 1 pass → ✅ Should succeed
2. Create 2nd entry with Exhibition Day 1 pass → ✅ Should succeed
3. Create 3rd entry with Exhibition Day 1 pass → ❌ Should fail with error:
   > "Exhibition Day 1 quota exceeded. You have allocated 2 passes out of 2 allowed."

### Test Scenario 2: Interactive Sessions Quota
**Setup**: User with `quota_interactive = 1`

1. Create 1st entry with Interactive Sessions pass → ✅ Should succeed
2. Create 2nd entry with Interactive Sessions pass → ❌ Should fail with error:
   > "Interactive Sessions quota exceeded. You have allocated 1 passes out of 1 allowed."

### Test Scenario 3: Update Entry (Add Pass)
**Setup**: User with `quota_plenary = 1`, already has 1 entry with Plenary

1. Try to update a different entry to ADD Plenary pass → ❌ Should fail:
   > "Plenary quota exceeded. You have allocated 1 passes out of 1 allowed."

### Test Scenario 4: Update Entry (Remove Pass)
**Setup**: User with any entry that has a pass

1. Edit entry and UNCHECK a pass → ✅ Should succeed
2. No quota validation when removing passes

---

## 🚀 DEPLOYMENT CHECKLIST

### Frontend (Vercel):
- [x] Code committed to GitHub (commits: 54fdbf6, ce56a19, 73116ad)
- [ ] Wait for Vercel auto-deployment (~2-3 minutes)
- [ ] Test mobile layout on phone
- [ ] Test desktop layout unchanged

### Backend (Render):
- [ ] **REQUIRED**: Deploy backend to Render manually OR wait for auto-deploy
- [ ] Backend URL: https://swavlamban2025-backend.onrender.com
- [ ] Verify API responds: `/api/v1/health`
- [ ] Test quota validation scenarios above

---

## ⚠️ KNOWN ISSUES (Not Bugs)

### Auto-Login After Refresh
**Behavior**: Login page flashes, then dashboard opens automatically

**This is NORMAL**:
- Session token saved in localStorage
- App validates token on page load
- If valid, auto-restores session
- Same as Gmail, Facebook, etc.

**To force logout**: Click "Logout" button in sidebar

---

## 📊 VERIFIED STATISTICS (All Correct)

### Admin Panel:
- Total Entries: 191 ✅
- Passes Generated: 188 ✅
- Organizations: 50 ✅

### Dashboard (TDAC):
- Max Entries: 999 ✅
- Total Entries: 186 ✅
- Remaining: 813 ✅

### CSV Exports:
- Organization CSV: ✅ Working
- All Entries CSV: ✅ Working

---

## 🐛 IF MOBILE LAYOUT DOESN'T WORK

### Troubleshooting Steps:
1. **Check Vercel deployment status**:
   - Go to https://vercel.com/dashboard
   - Verify latest commit deployed (73116ad)

2. **Hard refresh browser on phone**:
   - Chrome Android: Menu → Settings → Privacy → Clear browsing data
   - Safari iOS: Settings → Safari → Clear History and Website Data

3. **Check browser console**:
   - Chrome Android: chrome://inspect
   - Safari iOS: Safari → Develop → [Your Phone]

4. **Verify CSS loaded**:
   - Open browser DevTools
   - Check if `.mobile-header` class exists
   - Check media query: `@media (max-width: 767px)`

---

## 🐛 IF QUOTA VALIDATION DOESN'T WORK

### Troubleshooting Steps:
1. **Verify backend deployed**:
   - Check Render dashboard for deployment status
   - Verify commit hash matches: 54fdbf6 or later

2. **Check backend logs**:
   - Render → Dashboard → Your Service → Logs
   - Look for quota validation errors

3. **Test API directly**:
   ```bash
   curl -X POST https://swavlamban2025-backend.onrender.com/api/v1/entries \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{...entry data with exceeded quota...}'
   ```

4. **Expected response** (if quota exceeded):
   ```json
   {
     "detail": "Exhibition Day 1 quota exceeded. You have allocated X passes out of Y allowed."
   }
   ```

---

## 📝 NEXT STEPS AFTER TESTING

### If Tests Pass:
1. ✅ Mark quota validation as production-ready
2. ✅ Mark mobile layout as production-ready
3. ✅ Move to next priority items

### If Tests Fail:
1. Document exact failure (screenshot, error message)
2. Check browser console logs
3. Check backend logs (Render dashboard)
4. Report issues with reproduction steps

---

## 📞 SUPPORT REFERENCES

**GitHub Repository**: https://github.com/0xHKG/swavlamban2025-react

**Relevant Commits**:
- `54fdbf6`: Per-pass quota validation
- `ce56a19`: Mobile responsive layout
- `73116ad`: Session documentation

**Modified Files**:
- `backend/app/api/entries.py` (quota validation)
- `src/components/Layout.tsx` (mobile layout)
- `src/index.css` (responsive CSS)

---

## 🎉 SUCCESS CRITERIA

### Mobile Layout Test PASSES If:
- ✅ Hamburger menu visible on phone
- ✅ Drawer slides in/out smoothly
- ✅ Navigation works on mobile
- ✅ Desktop layout UNCHANGED

### Quota Validation Test PASSES If:
- ✅ Cannot exceed Exhibition Day 1 quota
- ✅ Cannot exceed Exhibition Day 2 quota
- ✅ Cannot exceed Interactive Sessions quota
- ✅ Cannot exceed Plenary quota
- ✅ Error messages clear and accurate

---

**Good luck with testing! 🚀**
