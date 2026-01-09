# Documentation API TravelShare

**Base URL (Prod):** `https://api.travelshare.mb-labs.dev`
**Base URL (Local):** `http://localhost:3001`

---

## 🔐 1. Authentification

### Inscription

* **URL:** `POST /auth/register`
* **Body (JSON):**
```json
{
  "email": "florian-vmax@xiaomi.com",
  "password": "strong_password",
  "name": "Florian Lachièze"
}

```


* **Réponse (201):** Objet User `{ id, email, name, ... }`

### Connexion

* **URL:** `POST /auth/login`
* **Body (JSON):**
```json
{
  "email": "florian-vmax@xiaomi.com",
  "password": "strong_password"
}

```


* **Réponse (200):**
```json
{
  "token": "eyJhbGciOi...",
  "user": { "id": 1, "email": "...", "name": "..." }
}

```


⚠️ **Important :** Stocker le `token` pour les requêtes authentifiées.

---

## 🖼️ 2. Frames (Publications)

### Récupérer toutes les frames (Fil d'actu)

* **URL:** `GET /frames`
* **Query Params (Optionnels):**
* `?limit=20` (Défaut: 20)
* `?q=Paris` (Recherche textuelle dans titre/description)


* **Réponse (200):** Liste d'objets Frame.
```json
[
  {
    "id": 1,
    "title": "Trip to Japan",
    "description": "Tokyo Tower view!",
    "authorName": "Mehdi",
    "authorAvatar": "avatar.jpg", // ou null
    "photos": [
       { "id": 10, "image": "abc-123.jpg", "latitude": 35.6, "longitude": 139.7 }
    ]
  }
]

```



### Détails d'une frame

* **URL:** `GET /frames/:id`
* **Réponse (200):** Objet Frame complet (même structure que ci-dessus).

### Publier une frame (Authentifié 🔒)

* **URL:** `POST /frames`
* **Header:** `Authorization: Bearer <VOTRE_TOKEN>`
* **Body (Multipart/Form-Data):**
* `title` (String)
* `description` (String)
* `visibility` (String: 'public', 'user_group', 'private')
* `photos` (Fichiers, min 1, max 10)
* `photoMetadata` (String JSON) : Tableau d'objets pour la géolocalisation de chaque photo. L'ordre correspond à l'ordre d'upload des fichiers.
* Exemple : `[{"latitude": 48.85, "longitude": 2.35}, {"latitude": 43.61, "longitude": 3.87}]`





---

## 📷 3. Photos (Recherche & Carte)

### Récupérer les photos (Mode Carte)

* **URL:** `GET /photos`
* **Query Params (Pour filtrer par zone):**
* `?latitude=48.85`
* `?longitude=2.35`
* `?radiusKm=10` (Rayon de recherche)


* **Réponse (200):** Liste de Photos.
```json
[
  {
    "id": 10,
    "frame_id": 1,
    "image": "abc-123.jpg",
    "latitude": 48.85,
    "longitude": 2.35,
    "distance": 0.5 // Si recherche géo
  }
]

```



### Photos d'une frame spécifique

* **URL:** `GET /frames/:id/photos`
* **Réponse (200):** Liste des photos de cette frame uniquement.

---

## 📂 4. Accès aux Fichiers (Images)

Pour afficher une image dans l'application Android (Glide/Picasso) :

* **Photo de voyage :** `<Base URL>/media/photos/<filename>`
* Ex: `https://api.travelshare.mb-labs.dev/media/photos/c6d0fc48-ae49.jpg`


* **Avatar utilisateur :** `<Base URL>/media/avatars/<filename>`

---

