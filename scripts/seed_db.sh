#!/bin/bash

# Stop execution if any command fails
set -e

# --- Configuration ---
API_URL="http://localhost:3001"
MEDIA_DIR="./sample_media"

# Colors for logging
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Database Seeding Process...${NC}"

# 1. Verification
if [ ! -d "$MEDIA_DIR" ]; then
    echo "Error: Directory $MEDIA_DIR not found. Please create it and add photos."
    exit 1
fi

if ! command -v jq &> /dev/null; then
    echo "Error: 'jq' is not installed. Please install it (sudo apt install jq)."
    exit 1
fi

# 2. Helper function to register and login
get_auth_token() {
    local email=$1
    local password=$2
    local name=$3

    # Attempt register (silently fail if exists)
    # FIX: Changed 'username' to 'name' to match auth.controller.js
    curl -s -X POST "$API_URL/auth/register" \
        -H "Content-Type: application/json" \
        -d "{\"email\": \"$email\", \"password\": \"$password\", \"name\": \"$name\"}" > /dev/null

    # Login
    local response=$(curl -s -X POST "$API_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\": \"$email\", \"password\": \"$password\"}")
    
    # Extract token
    local token=$(echo $response | jq -r '.token')
    
    if [ "$token" == "null" ]; then
        echo "Error: Failed to get token for $email" >&2
        exit 1
    fi
    
    echo $token
}

# ==========================================
# USER 1: Thomas (Local from South of France)
# ==========================================
echo -e "${YELLOW}Creating data for User: Thomas (Montpellier/Lyon/Marseille)...${NC}"
TOKEN_THOMAS=$(get_auth_token "thomas@local.fr" "password123" "ThomasSud")

# Post 1: Montpellier City Center (Multiple photos)
echo "Posting: Montpellier City Walk"
curl -s -X POST "$API_URL/frames" \
  -H "Authorization: Bearer $TOKEN_THOMAS" \
  -F "title=Montpellier City Walk" \
  -F "description=Sunny afternoon walking through the Comedie and Antigone." \
  -F "visibility=public" \
  -F "photos=@$MEDIA_DIR/Montpellier_Place_de_la_Comédie.jpg" \
  -F "photos=@$MEDIA_DIR/Montpellier_Polygone.jpg" \
  -F "photos=@$MEDIA_DIR/Montpellier_Esplanade_de_l_Europe.jpg" \
  -F "photoMetadata=[
      {\"latitude\": 43.6085, \"longitude\": 3.8796}, 
      {\"latitude\": 43.6082, \"longitude\": 3.8830},
      {\"latitude\": 43.6055, \"longitude\": 3.8960}
    ]" | jq '.message // .'

# Post 2: Montpellier Arc de Triomphe (Single photo)
echo "Posting: The Arc"
curl -s -X POST "$API_URL/frames" \
  -H "Authorization: Bearer $TOKEN_THOMAS" \
  -F "title=Sunset at the Arc" \
  -F "description=Beautiful view from the Peyrou park entrance." \
  -F "visibility=public" \
  -F "photos=@$MEDIA_DIR/Montpellier_Arc_de_triomphe.jpg" \
  -F "photoMetadata=[{\"latitude\": 43.6111, \"longitude\": 3.8737}]" | jq '.message // .'

# Post 3: Weekend in Lyon (Grouped by city)
echo "Posting: Weekend in Lyon"
curl -s -X POST "$API_URL/frames" \
  -H "Authorization: Bearer $TOKEN_THOMAS" \
  -F "title=Weekend in Lyon" \
  -F "description=Visiting the capital of gastronomy. The view from Fourviere is stunning." \
  -F "visibility=public" \
  -F "photos=@$MEDIA_DIR/Lyon_Notre_Dame_de_Fourviere.jpg" \
  -F "photos=@$MEDIA_DIR/Lyon_Place_Bellecour.jpg" \
  -F "photos=@$MEDIA_DIR/Lyon_Musee_des_Confluences.jpg" \
  -F "photoMetadata=[
      {\"latitude\": 45.7624, \"longitude\": 4.8225}, 
      {\"latitude\": 45.7578, \"longitude\": 4.8322},
      {\"latitude\": 45.7328, \"longitude\": 4.8176}
    ]" | jq '.message // .'

# Post 4: Lyon Business District (Specific area)
echo "Posting: La Part-Dieu District"
curl -s -X POST "$API_URL/frames" \
  -H "Authorization: Bearer $TOKEN_THOMAS" \
  -F "title=Lyon Business District" \
  -F "description=Architecture around Part-Dieu and Charpennes." \
  -F "visibility=public" \
  -F "photos=@$MEDIA_DIR/Lyon_La_Part_Dieu.jpg" \
  -F "photos=@$MEDIA_DIR/Lyon_Charpennes_Charles-Hernu.jpeg" \
  -F "photoMetadata=[
      {\"latitude\": 45.7602, \"longitude\": 4.8604}, 
      {\"latitude\": 45.7705, \"longitude\": 4.8635}
    ]" | jq '.message // .'

# Post 5: Marseille Stopover
echo "Posting: Marseille Old Port"
curl -s -X POST "$API_URL/frames" \
  -H "Authorization: Bearer $TOKEN_THOMAS" \
  -F "title=Marseille Old Port" \
  -F "description=Fresh fish market and boats." \
  -F "visibility=public" \
  -F "photos=@$MEDIA_DIR/Marseille_Vieux_Port.jpg" \
  -F "photoMetadata=[{\"latitude\": 43.2952, \"longitude\": 5.3740}]" | jq '.message // .'


# ==========================================
# USER 2: Sarah (The International Traveler)
# ==========================================
echo -e "${YELLOW}Creating data for User: Sarah (USA/UK/Paris)...${NC}"
TOKEN_SARAH=$(get_auth_token "sarah@travel.com" "password123" "SarahWorld")

# Post 6: NYC Highlights
echo "Posting: New York City Vibes"
curl -s -X POST "$API_URL/frames" \
  -H "Authorization: Bearer $TOKEN_SARAH" \
  -F "title=New York City Vibes" \
  -F "description=Times Square madness and Central Park peace." \
  -F "visibility=public" \
  -F "photos=@$MEDIA_DIR/New-York_Times_Square.jpg" \
  -F "photos=@$MEDIA_DIR/New-York_Central_Park.jpg" \
  -F "photos=@$MEDIA_DIR/New-York_Empire_State_Building_rooftop_view.jpg" \
  -F "photoMetadata=[
      {\"latitude\": 40.7580, \"longitude\": -73.9855}, 
      {\"latitude\": 40.7829, \"longitude\": -73.9654},
      {\"latitude\": 40.7484, \"longitude\": -73.9857}
    ]" | jq '.message // .'

# Post 7: London Trip
echo "Posting: London Calling"
curl -s -X POST "$API_URL/frames" \
  -H "Authorization: Bearer $TOKEN_SARAH" \
  -F "title=London Calling" \
  -F "description=Tourist day in London." \
  -F "visibility=public" \
  -F "photos=@$MEDIA_DIR/London_London_Eye_wheel.jpg" \
  -F "photos=@$MEDIA_DIR/London_MoMA_musuem_entrance.jpg" \
  -F "photoMetadata=[
      {\"latitude\": 51.5033, \"longitude\": -0.1195}, 
      {\"latitude\": 51.5076, \"longitude\": -0.0994} 
    ]" | jq '.message // .'

# Post 8: Paris Classics
echo "Posting: Paris - The City of Lights"
curl -s -X POST "$API_URL/frames" \
  -H "Authorization: Bearer $TOKEN_SARAH" \
  -F "title=Paris - The City of Lights" \
  -F "description=Classic tourist spots: Eiffel Tower and the Louvre." \
  -F "visibility=public" \
  -F "photos=@$MEDIA_DIR/Paris_Tour_Eiffel.jpg" \
  -F "photos=@$MEDIA_DIR/paris_louvre.jpg" \
  -F "photos=@$MEDIA_DIR/Paris_Arc_de_Triomphe.jpg" \
  -F "photoMetadata=[
      {\"latitude\": 48.8584, \"longitude\": 2.2945}, 
      {\"latitude\": 48.8606, \"longitude\": 2.3376},
      {\"latitude\": 48.8738, \"longitude\": 2.2950}
    ]" | jq '.message // .'

# Post 9: Parisian Café
echo "Posting: Coffee in Paris"
curl -s -X POST "$API_URL/frames" \
  -H "Authorization: Bearer $TOKEN_SARAH" \
  -F "title=Coffee Break" \
  -F "description=A quiet moment at Cafe Ventura." \
  -F "visibility=public" \
  -F "photos=@$MEDIA_DIR/Paris_Cafe_Ventura.jpg" \
  -F "photoMetadata=[{\"latitude\": 48.8820, \"longitude\": 2.3380}]" | jq '.message // .'


# ==========================================
# USER 3: Kenji (Japan Enthusiast)
# ==========================================
echo -e "${YELLOW}Creating data for User: Kenji (Japan)...${NC}"
TOKEN_KENJI=$(get_auth_token "kenji@japan.jp" "password123" "KenjiTravels")

# Post 10: Tokyo Modern Life
echo "Posting: Tokyo Modern Life"
curl -s -X POST "$API_URL/frames" \
  -H "Authorization: Bearer $TOKEN_KENJI" \
  -F "title=Tokyo Modern Life" \
  -F "description=Shibuya crossing chaos and Tokyo Tower views." \
  -F "visibility=public" \
  -F "photos=@$MEDIA_DIR/Tokyo_Shibuya_crossing.jpg" \
  -F "photos=@$MEDIA_DIR/Tokyo_Tokyo_Tower.jpg" \
  -F "photoMetadata=[
      {\"latitude\": 35.6595, \"longitude\": 139.7004}, 
      {\"latitude\": 35.6586, \"longitude\": 139.7454}
    ]" | jq '.message // .'

# Post 11: Traditional Japan
echo "Posting: Traditional Japan"
curl -s -X POST "$API_URL/frames" \
  -H "Authorization: Bearer $TOKEN_KENJI" \
  -F "title=Spirit of Japan" \
  -F "description=Fushimi Inari shrines and the majestic Mount Fuji." \
  -F "visibility=public" \
  -F "photos=@$MEDIA_DIR/Japan_Fushimi_Inari-taisha_Shinto_shrine.jpg" \
  -F "photos=@$MEDIA_DIR/Japan_top_of_mount_Fuji.jpg" \
  -F "photoMetadata=[
      {\"latitude\": 34.9671, \"longitude\": 135.7727}, 
      {\"latitude\": 35.3606, \"longitude\": 138.7274}
    ]" | jq '.message // .'

# Post 12: Osaka Nightlife
echo "Posting: Osaka Dotonbori"
curl -s -X POST "$API_URL/frames" \
  -H "Authorization: Bearer $TOKEN_KENJI" \
  -F "title=Osaka Dotonbori" \
  -F "description=Food and lights in Osaka." \
  -F "visibility=public" \
  -F "photos=@$MEDIA_DIR/Osaka_Dotonbori.jpg" \
  -F "photoMetadata=[{\"latitude\": 34.6687, \"longitude\": 135.5013}]" | jq '.message // .'


echo -e "${GREEN}Seeding completed successfully!${NC}"

