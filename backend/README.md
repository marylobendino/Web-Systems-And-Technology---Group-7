# Kumarites — Milestone 2 Express.js Backend

## Overview

The Kumarites backend extends the Milestone 1 React frontend by introducing a REST API built with Node.js and Express.js.

It demonstrates how a web application processes client requests, validates input, authenticates users, and persists community Buzz posts using JSON files.

### Technology Stack

- **Node.js** — JavaScript runtime for the backend.
- **Express.js** — HTTP server and REST API routing.
- **JSON** — Lightweight file-based data persistence.
- **JWT (JSON Web Token)** — Authentication for protected API requests.
- **bcrypt** — Password hashing.
- **React + Vite** — Frontend application.

## Requirements

- Node.js LTS and npm.
- The React frontend located in `../react-setup`.
- Visual Studio Code or another code editor.

Verify that Node.js and npm are installed:

```powershell
node -v
npm -v
```

## Installation and Setup

### 1. Start the Backend

Open the project in VS Code and open a PowerShell terminal.

Navigate to the backend directory:

```powershell
cd backend
```

Install dependencies:

```powershell
npm.cmd install
```

Run the project's validation or check script:

```powershell
npm.cmd run check
```

Start the development server:

```powershell
npm.cmd run dev
```

The API should be available at:

`http://localhost:3001`

Keep this terminal running while using the frontend.

> **Note:** The `check` and `dev` commands must be defined in the backend's `package.json`.

### 2. Start the React Frontend

Open a second terminal in VS Code and navigate to the frontend directory:

```powershell
cd react-setup
```

Install the frontend dependencies:

```powershell
npm.cmd install
```

Verify that the frontend builds successfully:

```powershell
npm.cmd run build
```

Start the Vite development server:

```powershell
npm.cmd run dev
```

Open the URL printed in the terminal, normally:

`http://localhost:5173`

Run the backend and frontend in separate terminals so both services remain available during development.

## API Reference

The backend exposes the following endpoints.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check backend availability. |
| GET | `/api/categories` | Retrieve category records. |
| GET | `/api/stores` | Retrieve store records. |
| GET | `/api/stores/:slug` | Retrieve a store by slug; returns `404` if not found. |
| POST | `/api/auth/signup` | Validate registration data and create an account. |
| POST | `/api/auth/login` | Verify credentials and return a signed JWT. |
| GET | `/api/auth/test` | Check whether the authentication route group is reachable. |
| GET | `/api/buzzes?q=&category=` | Retrieve community Buzz posts with optional filters. |
| POST | `/api/buzzes` | Create a Buzz post using a JSON request body and a valid bearer token. |

### Query Parameters

The Buzz listing endpoint supports optional filtering:

- `q` — Search term.
- `category` — Category filter.

Example:

```http
GET /api/buzzes?q=school&category=school-supplies
```

The exact filtering behavior depends on the backend implementation.

## Authentication

Creating a Buzz requires authentication. The client must first register or log in and obtain a JWT.

### Authentication Workflow

1. Submit registration details to `POST /api/auth/signup`, or log in through `POST /api/auth/login`.
2. Obtain the token returned by the authentication endpoint.
3. Include the token in the `Authorization` header when creating a Buzz.
4. The backend validates the token before processing the protected request.

The required header format is:

```http
Authorization: Bearer YOUR_TOKEN
```

Do not commit real tokens, passwords, or application secrets to source control.

## Creating a Buzz

### Example Request

Send a `POST` request to `/api/buzzes` with a valid JWT.

```http
POST /api/buzzes
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```

Request body:

```json
{
  "title": "Affordable school supplies",
  "description": "Found a useful school supply bundle at a reasonable price.",
  "category": "school-supplies",
  "type": "find",
  "store": "National Book Store",
  "location": "Local branch",
  "price": "199"
}
```

### Expected Behavior

The backend validates the request, processes the Buzz data, and saves the resulting record.

A successful creation returns **`201 Created`** with the saved record.

Validation rules include the following title and description limits:

- **Title:** 3–120 characters.
- **Description:** 10–2,000 characters.

Other required fields and accepted values are determined by the backend's validation logic.

## Frontend Integration

The React frontend communicates with the Express API through `/api` requests.

During local development, Vite proxies these requests to:

`http://127.0.0.1:3001`

This allows the frontend to use API paths such as `/api/buzzes` without hardcoding the backend origin in every request.

### Publish a Buzz Through the UI

1. Start the backend and frontend in separate terminals.
2. Open the frontend in your browser.
3. Navigate to the login or signup page.
4. Sign in or create an account.
5. Open BuzzFeed and select **Create a Buzz**.
6. Enter the required title, description, and category. Add optional store, location, and price details where applicable.
7. Publish the Buzz.
8. Confirm the success message and verify that the new post appears in the feed.

The frontend sends the Buzz data as JSON and includes the authenticated user's bearer token.

If the backend is unavailable, the frontend may continue to display sample cards and show a notice. Sample content does not, by itself, confirm that the API is working.

## Data Persistence

The backend uses JSON files for lightweight persistence as part of the course activity.

| File | Purpose |
|---|---|
| `users.json` | Stores account records. |
| `buzzes.json` | Stores community Buzz records. |

The backend uses bcrypt to hash passwords rather than storing them as plaintext.

JSON writes use a temporary file followed by a rename operation to reduce the risk of leaving a partially written file.

### Verify Persistence

1. Publish a Buzz through the frontend.
2. Confirm that the request succeeds.
3. Inspect `buzzes.json` to verify that the record was saved.
4. Refresh the frontend and check whether the post remains visible.
5. Restart the backend.
6. Check again to verify that the saved record remains available.

This verifies persistence across a server restart. It does not establish that JSON file storage is suitable for concurrent production workloads.

## Validation and Security

The backend includes the following protections:

- JWT authentication for creating Buzz posts.
- bcrypt password hashing.
- Input validation for submitted data.
- JSON request parsing through `express.json()`.
- A request-body size limit of 100 KB.
- Temporary