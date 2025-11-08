# ✅ QUICK FIX: Vercel Login Issue

**Problem**: Login was working before, now showing "Invalid credentials"

**Root Cause**: Recent commit changed `.env` from Streamlit backend to localhost

---

## WHAT HAPPENED

**Before (Working)**:
```env
VITE_API_URL=https://swavlamban2025.streamlit.app
```

**After commit 97152be (Broken)**:
```env
VITE_API_URL=http://localhost:8000
VITE_USE_REAL_API=true
```

---

## SOLUTION 1: Use Streamlit Backend (Quickest - 2 minutes)

Update Vercel environment variable to use existing Streamlit backend:

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard
   - Select `swavlamban2025-react` project

2. **Settings → Environment Variables**
   - Find or Add: `VITE_API_URL`
   - Value: `https://swavlamban2025.streamlit.app`
   - Environment: Production

3. **Redeploy**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

**Result**: Login will work immediately with Streamlit backend

---

## SOLUTION 2: Use Local FastAPI Backend (For Development)

This is what you're using locally now. To keep using FastAPI:

### Option A: Deploy FastAPI Backend

1. Deploy backend to Render.com / Railway.app
2. Update Vercel `VITE_API_URL` to deployed backend URL
3. Redeploy

### Option B: Keep Both Configurations

**Local `.env` (for development)**:
```env
VITE_API_URL=http://localhost:8000
VITE_USE_REAL_API=true
```

**Vercel Environment Variables (for production)**:
```env
VITE_API_URL=https://swavlamban2025.streamlit.app
```

This way local dev uses FastAPI, production uses Streamlit.

---

## RECOMMENDED: Solution 1 (Use Streamlit Backend)

**Why?**
- ✅ Already working and deployed
- ✅ 2-minute fix
- ✅ No backend deployment needed
- ✅ Can switch to FastAPI later when ready

**Steps**:
1. Vercel Dashboard → swavlamban2025-react
2. Settings → Environment Variables
3. Add/Update `VITE_API_URL` = `https://swavlamban2025.streamlit.app`
4. Deployments → Redeploy

---

**Status**: Ready to fix - choose solution 1 or 2
**Time to fix**: 2 minutes (Solution 1) or 30 minutes (Solution 2)
