#!/bin/bash

# Configuration
API_URL="http://localhost:3001/media/frames"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkB0cmF2ZWxzaGFyZS5jb20iLCJpYXQiOjE3Njc4MTM2MTEsImV4cCI6MTc2NzkwMDAxMX0.z2Oox36r062tt8UN-pC9LEzkFdTA3FKJtc_SJk83Zw0"

echo "=========================================="
echo " Starting Database Population for TravelShare"
echo "=========================================="

# Add Tokyo Tower first post

# 1. Montpellier Group (4 Photos)
echo -e "\n1. Uploading Montpellier City Tour..."
curl -X POST "$API_URL" \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Sunny day in Montpellier" \
  -F "description=Walking around the city center. From Comédie to Antigone!" \
  -F "geolocationLat=43.6112" \
  -F "geolocationLon=3.8767" \
  -F "visibilityType=public" \
  -F "photos=@Montpellier_Place_de_la_Comédie.jpg" \
  -F "photos=@Montpellier_Arc_de_triomphe.jpg" \
  -F "photos=@Montpellier_Esplanade_de_l_Europe.jpg" \
  -F "photos=@Montpellier_Polygone.jpg"

# 2. Paris Group (2 Photos)
echo -e "\n2. Uploading Paris by Night..."
curl -X POST "$API_URL" \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Parisian Nights" \
  -F "description=The City of Lights never sleeps. Stunning views of the Eiffel Tower and Arc de Triomphe." \
  -F "geolocationLat=48.8584" \
  -F "geolocationLon=2.2945" \
  -F "visibilityType=public" \
  -F "photos=@eiffel_tower_at_night.jpg" \
  -F "photos=@Paris_Arc_de_Triomphe_crepuscule.jpg"

# 3. Lyon Group (2 Photos)
echo -e "\n3. Uploading Lyon Architecture..."
curl -X POST "$API_URL" \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Modern Lyon" \
  -F "description=Checking out the Confluence museum and the Part-Dieu district." \
  -F "geolocationLat=45.7485" \
  -F "geolocationLon=4.8257" \
  -F "visibilityType=public" \
  -F "photos=@Lyon_Confluence.jpg" \
  -F "photos=@Lyon_La_Part_Dieu.jpg"

# 4. London Group (2 Photos)
echo -e "\n4. Uploading London Trip..."
curl -X POST "$API_URL" \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Weekend in London" \
  -F "description=Riding the London Eye and visiting museums." \
  -F "geolocationLat=51.5033" \
  -F "geolocationLon=-0.1195" \
  -F "visibilityType=public" \
  -F "photos=@London_eye.jpg" \
  -F "photos=@London_MoMa_musuem.jpg"

# 5. New York (1 Photo)
echo -e "\n5. Uploading New York View..."
curl -X POST "$API_URL" \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Empire State Views" \
  -F "description=Incredible rooftop view of the Empire State Building." \
  -F "geolocationLat=40.7484" \
  -F "geolocationLon=-73.9857" \
  -F "visibilityType=public" \
  -F "photos=@New-York_Empire_state_building_rooftop_view.jpg"

# 6. Osaka (1 Photo)
echo -e "\n6. Uploading Osaka Vibes..."
curl -X POST "$API_URL" \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Dotonbori Lights" \
  -F "description=The food and lights in Osaka are unmatched." \
  -F "geolocationLat=34.6687" \
  -F "geolocationLon=135.5013" \
  -F "visibilityType=public" \
  -F "photos=@Osaka_Dotonbori.jpg"

# 7. Marseille (1 Photo)
echo -e "\n7. Uploading Marseille Port..."
curl -X POST "$API_URL" \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Le Vieux Port" \
  -F "description=Sunny afternoon at the Old Port of Marseille." \
  -F "geolocationLat=43.2951" \
  -F "geolocationLon=5.3744" \
  -F "visibilityType=public" \
  -F "photos=@Marseille_Vieux_Port.jpg"

echo -e "\n\n=========================================="
echo " Done! All frames posted."
echo "=========================================="
