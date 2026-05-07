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
  echo "Failed to get token. Is the backend running? Response: $LOGIN_RESPONSE"
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
  
  # Try to find if animal exists
  EXISTING_ID=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/animals?search=$TAG" | grep -oP '"id":"\K[^"]+')
  
  if [ ! -z "$EXISTING_ID" ]; then
    COW_ID=$EXISTING_ID
    echo "Animal $TAG already exists (ID: $COW_ID). Skipping creation."
  else
    RESPONSE=$(curl -s -X POST "$BASE_URL/animals" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"tagNumber\": \"$TAG\",
        \"name\": \"$NAME\",
        \"breed\": \"Holstein-Friesian\",
        \"dateOfBirth\": \"2020-0$(($i%9+1))-15\",
        \"status\": \"$STATUS\",
        \"notes\": \"Premium herd member $i\"
      }")
    COW_ID=$(echo $RESPONSE | grep -oP '"id":"\K[^"]+')
    if [ -z "$COW_ID" ]; then
      echo "Failed to add $TAG. Response: $RESPONSE"
      continue
    fi
    echo "Added $TAG (ID: $COW_ID)"
  fi
  
  # Add 3 days of milk records for lactating cows
  if [ "$STATUS" == "LACTATING" ]; then
    echo "  -> Adding milk history..."
    for d in {0..2}
    do
      DATE=$(date -d "$d days ago" +%Y-%m-%d)
      YIELD_MORNING=$(awk "BEGIN {print 12 + $i/5 + $d/3}")
      YIELD_EVENING=$(awk "BEGIN {print 10 + $i/6 + $d/4}")
      
      # Trigger an alert for every 5th cow by setting high SCC
      SCC=150000
      if [ $((i % 5)) -eq 0 ]; then SCC=250000; fi
      
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
          \"proteinPct\": 3.2,
          \"scc\": $SCC
        }" > /dev/null
    done
  fi

  # Add a weight record
  # Trigger alert for every 7th cow by setting low weight
  WEIGHT=$((450 + i * 2))
  if [ $((i % 7)) -eq 0 ]; then WEIGHT=350; fi
  
  curl -s -X POST "$BASE_URL/animals/$COW_ID/weight" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"weightKg\": $WEIGHT,
      \"recordedDate\": \"$(date +%Y-%m-%d)\",
      \"recordedBy\": \"Auto-Populator\"
    }" > /dev/null
done

echo "Generating Feed Inventory..."
# Create a Feed Type first
FEED_TYPE_ID=$(curl -s -X POST "$BASE_URL/feed/types" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "High-Yield Concentrate",
    "description": "Premium dairy meal for lactating cows",
    "unit": "KG"
  }' | grep -oP '"id":"\K[^"]+')

if [ ! -z "$FEED_TYPE_ID" ]; then
  # Create initial inventory
  curl -s -X POST "$BASE_URL/feed/inventory" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"feedTypeId\": \"$FEED_TYPE_ID\",
      \"quantityKg\": 2500,
      \"lastRestockedDate\": \"$(date +%Y-%m-%d)\",
      \"minimumThreshold\": 500
    }" > /dev/null
    
  echo "Feed inventory initialized: 2500kg of High-Yield Concentrate."
fi

echo "Generating AI Alerts..."
echo "Generating Financial Records..."
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

curl -s -X POST "$BASE_URL/finance/expenses" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "FEED",
    "amountPkr": 120000,
    "vendor": "Agri-Solutions Ltd",
    "recordDate": "2024-05-02",
    "notes": "Bulk silage purchase"
  }' > /dev/null

curl -s -X POST "$BASE_URL/finance/expenses" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "MEDICAL",
    "amountPkr": 15000,
    "vendor": "Dr. Fazal (Vet)",
    "recordDate": "2024-05-03",
    "notes": "Monthly health checkup"
  }' > /dev/null

echo "Massive population complete! 25 cows, alerts triggered via SCC/Weight, and records injected."
