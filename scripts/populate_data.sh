#!/bin/bash

# Configuration
BASE_URL="http://localhost:8080/api"
ADMIN_EMAIL="admin@moomoo.local"
ADMIN_PASS="Admin123!"

echo "Logging in to get fresh token..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$ADMIN_EMAIL\",
    \"password\": \"$ADMIN_PASS\"
  }")

TOKEN=$(echo $LOGIN_RESPONSE | grep -oP '"accessToken":"\K[^"]+')

if [ -z "$TOKEN" ]; then
  echo "Failed to get token. Is the backend running?"
  exit 1
fi

echo "Token acquired successfully."

# Increase population count to 25 cows
COW_COUNT=25
echo "Populating $COW_COUNT cows for the default farm..."

for i in {1..25}
do
  TAG="COW-$(printf "%03d" $i)"
  NAME="Bessie_$i"
  STATUS="LACTATING"
  
  # Distribute statuses
  if [ $((i % 4)) -eq 0 ]; then STATUS="PREGNANT"; fi
  if [ $((i % 7)) -eq 0 ]; then STATUS="DRY"; fi
  if [ $((i % 10)) -eq 0 ]; then STATUS="HEIFER"; fi
  
  COW_ID=$(curl -s -X POST "$BASE_URL/animals" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"tagNumber\": \"$TAG\",
      \"name\": \"$NAME\",
      \"breed\": \"Holstein-Friesian\",
      \"dateOfBirth\": \"2020-0$(($i%9+1))-15\",
      \"status\": \"$STATUS\",
      \"notes\": \"Premium herd member $i\"
    }" | grep -oP '"id":"\K[^"]+')
    
  echo "Added $TAG (ID: $COW_ID)"
  
  # Add 7 days of milk records for lactating cows
  if [ "$STATUS" == "LACTATING" ]; then
    echo "  -> Adding 7 days of milk history..."
    for d in {0..6}
    do
      DATE=$(date -d "$d days ago" +%Y-%m-%d)
      YIELD_MORNING=$(echo "scale=2; 12 + $i/5 + $d/3" | bc)
      YIELD_EVENING=$(echo "scale=2; 10 + $i/6 + $d/4" | bc)
      
      curl -s -X POST "$BASE_URL/milk-records" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
          \"animalId\": \"$COW_ID\",
          \"recordDate\": \"$DATE\",
          \"session\": \"BOTH\",
          \"morningYield\": $YIELD_MORNING,
          \"eveningYield\": $YIELD_EVENING,
          \"fatPct\": 3.8,
          \"proteinPct\": 3.2
        }" > /dev/null
    done
  fi

  # Add a weight record
  curl -s -X POST "$BASE_URL/animals/$COW_ID/weight" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"weightKg\": $((450 + i * 2)),
      \"recordedDate\": \"$(date +%Y-%m-%d)\",
      \"recordedBy\": \"Auto-Populator\"
    }" > /dev/null
done

echo "Generating Financial Records..."
# Revenue - Milk Sales
curl -s -X POST "$BASE_URL/finance/revenue" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "MILK_SALES",
    "amountPkr": 450000,
    "buyerName": "Nestle Pakistan",
    "recordDate": "2024-05-01",
    "notes": "Bulk monthly collection"
  }' > /dev/null

# Expenses - Feed and Meds
curl -s -X POST "$BASE_URL/finance/expenses" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "FEED",
    "amountPkr": 180000,
    "vendor": "Agri-Feeds Ltd",
    "recordDate": "2024-05-02",
    "notes": "Concentrate batch purchase"
  }' > /dev/null

curl -s -X POST "$BASE_URL/finance/expenses" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "VETERINARY",
    "amountPkr": 25000,
    "vendor": "Livestock Health Services",
    "recordDate": "2024-05-03",
    "notes": "Herd-wide vaccination"
  }' > /dev/null

echo "Massive population complete! 25 cows and hundreds of records injected."
