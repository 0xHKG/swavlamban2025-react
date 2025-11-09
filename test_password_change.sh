#!/bin/bash

# Get auth token
echo "Getting auth token..."
TOKEN=$(curl -s -X POST https://swavlamban2025-backend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.access_token')

echo "Token: ${TOKEN:0:20}..."

# Test change password with CORS
echo -e "\nTesting change-password endpoint..."
curl -X POST https://swavlamban2025-backend.onrender.com/api/v1/auth/change-password \
  -H "Origin: https://swavlamban2025.vercel.app" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"current_password":"admin123","new_password":"admin12345"}' \
  -v 2>&1 | grep -E "(< HTTP|access-control|detail)"
