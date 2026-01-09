#!/bin/bash


set -e
#stop on error

API_URL="http://localhost:3001"
MEDIA_DIR="./sample_media"


GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Starting Database Seeding...${NC}"


if [ ! -d "$MEDIA_DIR" ]; then
    echo "Error: Directory $MEDIA_DIR not found."
    exit 1
fi


register_and_login() {
    local email=$1
    local password=$2
    local name=$3

    echo "  Creating user: $name ($email)..."
    
    
    curl -s -X POST "$API_URL/auth/register" \
        -H "Content-Type: application/json" \
        -d "{\"email\": \"$email\", \"password\": \"$password\", \"username\": \"$name\"}" > /dev/null

    
    local response=$(curl -s -X POST "$API_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\": \"$email\", \"password\": \"$password\"}")
    
    
    echo $response | jq -r '.token'
}


TOKEN_ALICE=$(register_and_login "alice@test.com" "password123" "AliceWanderlust")

if [ "$TOKEN_ALICE" == "null" ]; then echo "Login failed for Alice"; exit 1; fi

echo -e "${GREEN}   Alice is posting 'Weekend in Paris'...${NC}"


curl -X POST "$API_URL/frames" \
  -H "Authorization: Bearer $TOKEN_ALICE" \
  -F "title=Weekend in Paris" \
  -F "description=Loving the city of lights! The food is amazing." \
  -F "visibility=public" \
  -F "photos=@$MEDIA_DIR/paris_eiffel.jpg" \
  -F "photos=@$MEDIA_DIR/paris_louvre.jpg" \
  -F "photoMetadata=[{\"latitude\": 48.8584, \"longitude\": 2.2945}, {\"latitude\": 48.8606, \"longitude\": 2.3376}]"

echo ""

echo -e "${GREEN}   Alice is posting 'Coffee Break'...${NC}"
curl -X POST "$API_URL/frames" \
  -H "Authorization: Bearer $TOKEN_ALICE" \
  -F "title=Morning Coffee" \
  -F "description=Best croissant in town." \
  -F "visibility=public" \
  -F "photos=@$MEDIA_DIR/paris_cafe.jpg" \
  -F "photoMetadata=[{\"latitude\": 48.8570, \"longitude\": 2.3524}]"

echo ""



TOKEN_BOB=$(register_and_login "bob@test.com" "password123" "BobHiker")

echo -e "${GREEN}   Bob is posting 'Kyoto & Fuji'...${NC}"


curl -X POST "$API_URL/frames" \
  -H "Authorization: Bearer $TOKEN_BOB" \
  -F "title=Japan Adventure" \
  -F "description=From the mountains to the temples. Unforgettable." \
  -F "visibility=public" \
  -F "photos=@$MEDIA_DIR/japan_fuji.jpg" \
  -F "photos=@$MEDIA_DIR/japan_temple.jpg" \
  -F "photoMetadata=[{\"latitude\": 35.3606, \"longitude\": 138.7274}, {\"latitude\": 35.0394, \"longitude\": 135.7292}]"

echo ""



TOKEN_CHARLIE=$(register_and_login "charlie@test.com" "password123" "CharlieNYC")

echo -e "${GREEN}   Charlie is posting 'Big Apple Life'...${NC}"



curl -X POST "$API_URL/frames" \
  -H "Authorization: Bearer $TOKEN_CHARLIE" \
  -F "title=City that never sleeps" \
  -F "description=Walking around Manhattan." \
  -F "visibility=public" \
  -F "photos=@$MEDIA_DIR/nyc_times_square.jpg" \
  -F "photos=@$MEDIA_DIR/nyc_park.jpg" \
  -F "photoMetadata=[{\"latitude\": 40.7580, \"longitude\": -73.9855}, {\"latitude\": 40.7829, \"longitude\": -73.9654}]"

echo ""
echo -e "${BLUE}Seeding completed.${NC}"

