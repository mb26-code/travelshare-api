# TravelShare API Documentation

**Base URL (Prod):** `https://api.travelshare.mb-labs.dev`

**Base URL (Local):** `http://localhost:3001`

---

Here is the rest of the documentation, rewritten in professional US English. I have added a **"General Information"** section at the very beginning to cover the **Rate Limiting** and **Middleware** details you requested.

You should place the **General Information** section right after the **Base URL** definitions at the top of your file. The other sections (Frames, Photos, Comments, Media) can follow the Authentication section.

---

## ℹ️ 0. General Information & Limits

### Rate Limiting

To ensure fair usage and service stability, this API implements rate limiting via the `express-rate-limit` middleware. No API key is required at this stage, but limits are enforced based on IP address.

* **Global Limit:** 420 requests per minute per IP.
* **Authentication Limit:** 10 login/registration attempts per hour per IP (to prevent brute-force attacks).

Headers containing rate limit status (e.g., `RateLimit-Limit`, `RateLimit-Remaining`) are included in the response.

### File Uploads

Image uploads are handled using `Multer`. Files are processed, renamed with a unique UUID, and stored locally on the server.

* **Max Count:** Up to 8 photos per Frame.
* **Accepted Format:** Standard image formats (JPEG, PNG, ...).


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

## 🖼️ 2. Frames

The core content of the application. Frames represent travel posts that can contain multiple photos, descriptions, and geolocation data.

### Get All Frames (Feed)

Retrieves a list of frames, typically used to populate the main feed (Discovery Wall).

* **URL:** `GET /frames`
* **Query Parameters:**
* `limit` (Optional): Maximum number of frames to return (default: `100`).
* `q` (Optional): Search query string to filter by title or description.


* **Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Sunset in Kyoto",
    "description": "Walking through the Arashiyama bamboo grove.",
    "createdAt": "2025-11-23T10:00:00.000Z",
    "visibility": "public",
    "userGroupId": null,
    "size": 2,
    "authorId": 42,
    "authorName": "Alice Traveler",
    "authorAvatar": "avatar_42.jpg",
    "likeCount": 15,
    "isLiked": true,
    "photos": [
      {
        "id": 101,
        "order_": 0,
        "latitude": 35.0116,
        "longitude": 135.7681,
        "image": "photo_1700000000.jpg"
      }
    ]
  }
]

```



### Get Frame Details

Retrieves the complete information for a specific frame.

* **URL:** `GET /frames/:id`
* **Response (200 OK):**
```json
{
  "id": 1,
  "title": "Sunset in Kyoto",
  "description": "Walking through the Arashiyama bamboo grove.",
  "createdAt": "2025-11-23T10:00:00.000Z",
  "visibility": "public",
  "authorId": 42,
  "authorName": "Alice Traveler",
  "authorAvatar": "avatar_42.jpg",
  "likeCount": 15,
  "isLiked": false,
  "photos": [
    { "id": 101, "order_": 0, "image": "img1.jpg", "latitude": 35.0, "longitude": 135.7 },
    { "id": 102, "order_": 1, "image": "img2.jpg", "latitude": 35.0, "longitude": 135.7 }
  ]
}

```



### Post a Frame

Creates a new frame with photos. This endpoint accepts `multipart/form-data`.

* **URL:** `POST /frames`
* **Headers:**
* `Authorization: Bearer <YOUR_TOKEN>`
* `Content-Type: multipart/form-data`


* **Form Data Fields:**
* `title` (String): The title of the frame.
* `description` (String): The description/caption.
* `visibility` (String): One of `public`, `user_group`, or `private`.
* `userGroupId` (Integer, Optional): Required if visibility is `user_group`.
* `photos` (Files): Array of image files (max 8).
* `photoMetadata` (String JSON): A JSON string array containing metadata for each photo index.
* Example: `[{"latitude": 48.85, "longitude": 2.35}, {}]`




* **Response (201 Created):**
```json
{
  "frameId": 15,
  "message": "Frame created successfully"
}

```



### Like a Frame

Adds a "like" to a frame from the current user.

* **URL:** `POST /frames/:id/likes`
* **Headers:** `Authorization: Bearer <YOUR_TOKEN>`
* **Response (200 OK):**
```json
{
  "message": "Liked"
}

```


* **Error (400 Bad Request):** If the frame is already liked.

### Unlike a Frame

Removes a "like" from a frame.

* **URL:** `DELETE /frames/:id/likes`
* **Headers:** `Authorization: Bearer <YOUR_TOKEN>`
* **Response (200 OK):**
```json
{
  "message": "Unliked"
}

```



### Get Frame Likes

Retrieves the list of users who liked a specific frame.

* **URL:** `GET /frames/:id/likes`
* **Response (200 OK):**
```json
{
  "amount": 5,
  "likers": [1, 4, 12, 42, 55]
}

```



---

## 📷 3. Photos

Endpoints dedicated to searching and retrieving individual photos, primarily for the Map view.

### Search Photos (Map / Geolocation)

Retrieves photos based on geographic coordinates or fetches all photos if no coordinates are provided.

* **URL:** `GET /photos`
* **Query Parameters:**
* `latitude` (Float): Center latitude.
* `longitude` (Float): Center longitude.
* `radiusKm` (Float, Optional): Search radius in kilometers (default: `10`).


* **Response (200 OK):**
```json
[
  {
    "id": 101,
    "frame_id": 1,
    "image": "photo_123.jpg",
    "latitude": 48.8566,
    "longitude": 2.3522,
    "distance": 0.54
  }
]

```



### Get Photos for a Frame

Retrieves all photos belonging to a specific frame ID.

* **URL:** `GET /frames/:id/photos`
* **Response (200 OK):**
```json
[
  {
    "id": 101,
    "order_": 0,
    "latitude": 48.85,
    "longitude": 2.35,
    "image": "photo_123.jpg"
  }
]

```



---

## 💬 4. Comments

Manage user comments on frames.

### Get Comments for a Frame

Retrieves all comments associated with a specific frame.

* **URL:** `GET /frames/:id/comments`
* **Response (200 OK):**
```json
[
  {
    "id": 10,
    "userId": 42,
    "authorName": "Alice",
    "authorAvatar": "alice_avatar.jpg",
    "content": "Amazing view!",
    "postedOn": "2026-01-18",
    "postedAt": "14:30",
    "edited": false
  }
]

```



### Post a Comment

Adds a new comment to a frame.

* **URL:** `POST /frames/:id/comments`
* **Headers:** `Authorization: Bearer <YOUR_TOKEN>`
* **Body (JSON):**
```json
{
  "content": "I wish I was there!"
}

```


* **Response (201 Created):**
```json
{
  "id": 11,
  "userId": 5,
  "frameId": 1,
  "content": "I wish I was there!",
  "created_at": "2026-01-18T14:35:00.000Z"
}

```



### Edit a Comment

Updates the content of an existing comment. Users can only edit their own comments.

* **URL:** `PATCH /comments/:id`
* **Headers:** `Authorization: Bearer <YOUR_TOKEN>`
* **Body (JSON):**
```json
{
  "content": "I wish I was there! (Edit: Actually, I am going next week!)"
}

```


* **Response (200 OK):**
```json
{
  "message": "Comment updated successfully"
}

```



### Delete a Comment

Permanently removes a comment. Users can only delete their own comments.

* **URL:** `DELETE /comments/:id`
* **Headers:** `Authorization: Bearer <YOUR_TOKEN>`
* **Response (200 OK):**
```json
{
  "message": "Comment deleted successfully"
}

```



---

## 📂 5. Media Assets

Static endpoints for retrieving user-uploaded content. These URLs are constructed by the client using the Base URL.

### Photos

* **URL Pattern:** `GET /media/photos/:filename`
* **Example:** `https://api.travelshare.mb-labs.dev/media/photos/upload_1700000000.jpg`

### Avatars

* **URL Pattern:** `GET /media/avatars/:filename`
* **Example:** `https://api.travelshare.mb-labs.dev/media/avatars/user_42.jpg`

