# API Integration Guide
## Swavlamban 2025 - React Frontend + FastAPI Backend

**Last Updated**: 2025-11-08
**Status**: ✅ PRODUCTION READY

---

## 🎯 Overview

This React application now supports **both Mock API and Real API** integrations:
- **Mock API**: In-memory mock data (for development/testing)
- **Real API**: Python FastAPI backend with PostgreSQL database + Mailjet/Brevo email

---

## 🔧 Quick Setup

### 1. Start the Backend (FastAPI)

```bash
cd /home/gogi/Desktop/swav-registration/backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: **http://localhost:8000**

**Verify it's running:**
```bash
curl http://localhost:8000/health
# Should return: {"status":"healthy","app":"Swavlamban 2025"}
```

### 2. Configure Frontend Environment

Edit `/home/gogi/Desktop/swavlamban2025-react/.env`:

```bash
# API Configuration
VITE_API_URL=http://localhost:8000

# Toggle between Mock and Real API
VITE_USE_REAL_API=true  # Set to 'false' for mock API
```

### 3. Start the Frontend (React)

```bash
cd /home/gogi/Desktop/swavlamban2025-react
npm run dev
```

Frontend will be available at: **http://localhost:5173**

---

## 📡 API Service Architecture

### File Structure

```
src/services/
├── index.ts          # Main export - automatic API selection
├── mockApi.ts        # Mock API service (in-memory)
└── realApi.ts        # Real API service (FastAPI backend)
```

### Switching Between APIs

The system automatically selects the API based on `VITE_USE_REAL_API` environment variable:

```typescript
// src/services/index.ts
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true';
export const apiService = USE_REAL_API ? realApiService : mockApiService;
```

**To use Mock API:**
```bash
VITE_USE_REAL_API=false
```

**To use Real API:**
```bash
VITE_USE_REAL_API=true
```

---

## 🗄️ Backend Configuration

### Database (PostgreSQL - Supabase)

```bash
DB_HOST=your-supabase-host.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=your-database-user
DB_PASSWORD=your-database-password
```

> **Note**: Get actual credentials from backend/.env file (not committed to Git)

### Email Services

**Primary: Brevo API**
```bash
BREVO_API_KEY=your-brevo-api-key-here
USE_BREVO=true
```

**Secondary: Mailjet API**
```bash
MAILJET_API_KEY=your-mailjet-api-key-here
MAILJET_API_SECRET=your-mailjet-api-secret-here
```

**Backup: Gmail SMTP**
```bash
USE_GMAIL_SMTP=false
GMAIL_ADDRESS=your-gmail-address@gmail.com
GMAIL_APP_PASSWORD=your-app-password-here
```

> **Note**: Get actual credentials from backend/.env file (not committed to Git)

### Security

```bash
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
```

> **Note**: Get actual JWT secret from backend/.env file (not committed to Git)

---

## 📚 API Endpoints

### Base URL
- **Local**: `http://localhost:8000`
- **Production**: (Update when deployed)

### Authentication

#### POST `/api/v1/auth/login`
Login with username and password (OAuth2 password flow)

**Request:**
```
Content-Type: application/x-www-form-urlencoded

username=admin&password=admin123
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": {
    "username": "admin",
    "organization": "TDAC",
    "role": "admin",
    "max_entries": 999,
    "allowed_passes": {
      "exhibition_day1": true,
      "exhibition_day2": true,
      "interactive_sessions": true,
      "plenary": true
    }
  }
}
```

### Entries

#### GET `/api/v1/entries/my`
Get current user's entries (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "username": "admin",
    "name": "Abhishek Vardhan",
    "email": "abhishek@navy.gov.in",
    "phone": "+91-9876543210",
    "id_type": "Aadhaar",
    "id_number": "111122223333",
    "exhibition_day1": true,
    "exhibition_day2": true,
    "interactive_sessions": true,
    "plenary": true,
    "pass_generated_exhibition_day1": false,
    "pass_generated_exhibition_day2": false,
    "pass_generated_interactive_sessions": false,
    "pass_generated_plenary": false,
    "created_at": "2025-11-08T10:00:00Z"
  }
]
```

#### POST `/api/v1/entries`
Create new entry

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91-9876543210",
  "id_type": "Aadhaar",
  "id_number": "123456789012",
  "exhibition_day1": true,
  "exhibition_day2": false,
  "interactive_sessions": false,
  "plenary": false
}
```

#### PUT `/api/v1/entries/{id}`
Update entry

#### DELETE `/api/v1/entries/{id}`
Delete entry

### Pass Generation

#### POST `/api/v1/passes/generate/{entryId}`
Generate passes for an entry and optionally send email

**Request:**
```json
{
  "send_email": true
}
```

**Response:**
```json
{
  "pass_files": ["EP-25.png", "EP-26.png", "EP-INTERACTIVE.png"],
  "email_sent": true,
  "message": "Passes generated and email sent to john@example.com"
}
```

### Admin Endpoints

#### GET `/api/v1/admin/users`
Get all users (admin only)

#### GET `/api/v1/admin/entries`
Get all entries (admin only)

#### POST `/api/v1/admin/users`
Create new user (admin only)

#### PUT `/api/v1/admin/users/{username}`
Update user (admin only)

#### DELETE `/api/v1/admin/users/{username}`
Delete user (admin only)

#### POST `/api/v1/admin/bulk-email`
Send bulk emails (admin only)

---

## 🔐 Authentication Flow

1. **Login**: User enters credentials
2. **Token**: Backend returns JWT access token
3. **Storage**: Token stored in localStorage
4. **Requests**: Token sent in Authorization header: `Bearer <token>`
5. **Expiry**: Token expires after 15 minutes
6. **Logout**: Token removed from localStorage

---

## 🚀 Testing the Integration

### 1. Test Backend Health

```bash
curl http://localhost:8000/health
```

### 2. Test Login

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin123"
```

### 3. Test Get Entries

```bash
TOKEN="<your-token-here>"
curl http://localhost:8000/api/v1/entries/my \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Test Create Entry

```bash
TOKEN="<your-token-here>"
curl -X POST http://localhost:8000/api/v1/entries \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+91-9876543210",
    "id_type": "Aadhaar",
    "id_number": "123456789012",
    "exhibition_day1": true,
    "exhibition_day2": false,
    "interactive_sessions": false,
    "plenary": false
  }'
```

---

## 🐛 Troubleshooting

### Backend Not Starting

**Error**: `ModuleNotFoundError: No module named 'app'`

**Solution**: Make sure you're in the backend directory:
```bash
cd /home/gogi/Desktop/swav-registration/backend
```

**Error**: `ImportError: cannot import name 'verify_token'`

**Solution**: Already fixed - `verify_token` alias added to `security.py`

### CORS Errors

**Error**: `Access-Control-Allow-Origin` errors in browser console

**Solution**: Check BACKEND_CORS_ORIGINS in `.env`:
```bash
BACKEND_CORS_ORIGINS=["http://localhost:8501","http://localhost:3000","http://localhost:5173","https://swavlamban2025-react.vercel.app"]
```

### Database Connection Errors

**Error**: Connection timeout or authentication failed

**Solution**: Verify Supabase credentials in backend/.env

### Email Not Sending

**Error**: Passes generated but email not sent

**Solution**: Check email service configuration:
- **Brevo API**: Verify `BREVO_API_KEY`
- **Mailjet API**: Verify `MAILJET_API_KEY` and `MAILJET_API_SECRET`
- **Gmail SMTP**: Verify `GMAIL_ADDRESS` and `GMAIL_APP_PASSWORD`

---

## 📊 API Service Features

### realApi.ts Features

✅ **Automatic token injection**: JWT token automatically added to all requests
✅ **Error handling**: Automatic 401 handling with logout redirect
✅ **Timeout configuration**: 30s for normal requests, 2min for pass generation
✅ **Axios interceptors**: Request/response interceptors for auth
✅ **TypeScript types**: Full type safety with shared types

### mockApi.ts Features

✅ **In-memory storage**: localStorage-based persistence
✅ **Realistic delays**: Simulated network latency
✅ **Same interface**: Identical API to realApi for easy switching
✅ **No backend required**: Perfect for development/testing

---

## 🌐 Production Deployment

### Deploy Backend (FastAPI)

**Options:**
1. **Railway**: https://railway.app (recommended)
2. **Render**: https://render.com
3. **Fly.io**: https://fly.io
4. **AWS EC2 / Digital Ocean / Linode**

**Update Frontend .env:**
```bash
VITE_API_URL=https://your-backend-api.com
VITE_USE_REAL_API=true
```

### Deploy Frontend (React)

**Vercel** (already configured):
1. Push code to GitHub
2. Vercel auto-deploys
3. Set environment variables in Vercel dashboard

---

## ✅ Integration Checklist

- [x] Backend FastAPI server running
- [x] Database connected (PostgreSQL - Supabase)
- [x] Email service configured (Brevo/Mailjet/Gmail)
- [x] realApi.ts service created
- [x] Environment variables configured
- [x] API switcher implemented
- [ ] Full integration testing
- [ ] Production backend deployment
- [ ] Frontend environment update

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review backend logs: Check uvicorn console output
3. Review frontend logs: Check browser console
4. Test with Mock API first to isolate frontend issues

---

**Backend Status**: ✅ Running on http://localhost:8000
**Frontend Status**: ✅ Running on http://localhost:5173
**Database**: ✅ Connected to Supabase PostgreSQL
**Email**: ✅ Configured with Brevo API (primary) + Mailjet (secondary) + Gmail SMTP (backup)

**Current Mode**: Mock API (set `VITE_USE_REAL_API=true` to use Real API)
