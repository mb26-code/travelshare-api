# TravelShare API Documentation

**Base URL (Prod):** `https://api.travelshare.mb-labs.dev`

**Base URL (Local):** `http://localhost:3001`

---


## 🔐 1. Authentication

### Registration

Registers a new user account. The account will be created in a "locked" state until the email address is verified using the confirmation endpoint.

* **URL:** `POST /auth/register`
* **Content-Type:** `application/json`
* **Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}

```


* **Response (201 Created):**
```json
{
  "message": "Verification code sent.",
  "email": "john.doe@example.com"
}

```



### Confirm Email

Verifies the email address using the 8-character alphanumeric code sent to the user's inbox. This step is required before logging in.

* **URL:** `POST /auth/register/confirm`
* **Content-Type:** `application/json`
* **Body:**
```json
{
  "email": "john.doe@example.com",
  "code": "A1B2C3D4"
}

```


* **Response (200 OK):**
```json
{
  "message": "Email verified successfully. You can now login."
}

```



### Login

Authenticates a user and returns a JSON Web Token (JWT). The user must have a verified account.

* **URL:** `POST /auth/login`
* **Content-Type:** `application/json`
* **Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}

```


* **Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "name": "John Doe",
    "profilePicture": null
  }
}

```


* **Error (403 Forbidden):**
```json
{
  "error": "Account not verified. Please verify your email."
}

```



### Get Current User Profile

Retrieves the profile information of the currently authenticated user based on the provided token.

* **URL:** `GET /auth/me`
* **Headers:** `Authorization: Bearer <YOUR_TOKEN>`
* **Response (200 OK):**
```json
{
  "id": 1,
  "email": "john.doe@example.com",
  "name": "John Doe",
  "profilePicture": null,
  "createdAt": "2026-01-18T12:39:36.000Z"
}

```



### Password Reset Request

Initiates the password reset process. If the email exists in the database, a reset code will be sent to that address.

* **URL:** `POST /auth/password-reset`
* **Content-Type:** `application/json`
* **Body:**
```json
{
  "email": "john.doe@example.com"
}

```


* **Response (200 OK):**
```json
{
  "message": "If the e-mail exists, a code has been sent."
}

```



### Password Reset Confirmation

Verifies the reset code and updates the user's password.

* **URL:** `POST /auth/password-reset/confirm`
* **Content-Type:** `application/json`
* **Body:**
```json
{
  "email": "john.doe@example.com",
  "code": "X9Y8Z7W6",
  "newPassword": "NewStrongPassword456!"
}

```


* **Response (200 OK):**
```json
{
  "message": "Password updated successfully."
}

```



### Logout

Formally logs the user out. Since JWTs are stateless, this endpoint is primarily for client-side acknowledgment and potential future session tracking.

* **URL:** `POST /auth/logout`
* **Headers:** `Authorization: Bearer <YOUR_TOKEN>`
* **Response (200 OK):**
```json
{
  "message": "Logged out successfully."
}

```

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

