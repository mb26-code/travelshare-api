# TravelShare API

Production: https://api.travelshare.mb-labs.dev/

## Description

The TravelShare API is the gateway to the backend service for the TravelShare Android application. It is a RESTful-ish API built with Node.js and Express that manages user authentication, travel "frames" (posts), photo uploads, and geolocation metadata.

The architecture follows the Model-View-Controller (MVC) pattern with a Service layer to separate business logic from HTTP handling.

## Tech Stack

- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** MySQL 8.4 (running in a Docker container)
- **Authentication:** JSON Web Tokens (JWT) and bcrypt
- **File Handling:** Multer (for image uploads)
- **Deployment:** PM2 (Process Manager)

## Project Structure

```text
.
├── config/           # Database configuration
├── controllers/      # Request handling logic
├── middleware/       # Auth, rate limiting, and upload middleware
├── routes/           # API route definitions
├── services/         # Business logic and database interactions
├── sql/              # Database schema definitions
├── scripts/          # Utility scripts for database management and deployment
├── sample_media/     # Source images used for database seeding
└── uploads/          # Directory for user-generated content (photos/avatars)
```