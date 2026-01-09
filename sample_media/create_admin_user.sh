#!/bin/bash

# Configuration
API_URL="http://127.0.0.1:3001/auth"
EMAIL="admin@travelshare.com"
PASSWORD="AdminPassword123!"
NAME="Admin TravelShare"

echo "1. Création du compte utilisateur..."
curl -s -X POST "$API_URL/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\", \"name\": \"$NAME\"}"

echo -e "\n\n2. Connexion pour récupérer le token..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

echo -e "\n\nRéponse complète :"
echo $LOGIN_RESPONSE

echo -e "\n\n=============================================="
echo "COPIE CE TOKEN (tout ce qu'il y a entre les guillemets après 'token':)"
echo "=============================================="
