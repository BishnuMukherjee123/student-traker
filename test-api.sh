#!/bin/bash

echo "=== StudentTracker API Testing ==="
echo ""

# Login and get token
echo "1. Testing login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@demohigh.edu",
    "password": "password123"
  }')

# Extract token (simple grep method)
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed!"
  exit 1
fi

echo "✅ Login successful! Token received."
echo ""

# Get student IDs
echo "2. Getting student IDs..."
STUDENTS_RESPONSE=$(curl -s -X GET http://localhost:5000/api/students/test-ids \
  -H "Authorization: Bearer $TOKEN")

echo "✅ Students retrieved:"
echo $STUDENTS_RESPONSE | head -c 100
echo "..."
echo ""

echo "3. Testing complete! Use the token above for manual testing:"
echo "TOKEN: $TOKEN"
echo ""
echo "Use this token with the commands in API_TESTING.md"