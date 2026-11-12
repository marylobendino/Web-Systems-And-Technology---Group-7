# Kumarites — Terminal Assessment (TA)
## Full-Stack Community Buzz Platform

**Project:** Kumarites  
**Assessment:** Terminal Assessment (TA)  
**Frontend:** React and Vite  
**Backend:** Node.js and Express.js  
**Data Persistence:** JSON files  
**Authentication:** JWT and bcrypt  

---

## 1. Project Overview

Kumarites is a community-driven web application that allows users to discover, publish, save, and mark useful community Buzz posts. The application integrates a React frontend with a Node.js and Express.js backend to support account authentication, API-based data access, server-side validation, and persistent community interactions.

The application demonstrates a full-stack web architecture in which the React frontend communicates with a REST API, the backend validates and processes requests, and JSON files retain application records between server restarts.

The primary objective of the Terminal Assessment is to demonstrate the integration of frontend and backend components, establish consistent data flow across the application, associate user actions with authenticated accounts, and validate system functionality through internal testing.

### Project Objectives

- Integrate the React frontend with an Express.js REST API.
- Implement account registration and login using password hashing and JWT authentication.
- Allow authenticated users to publish community Buzz posts.
- Maintain consistent Buzz data across Home, BuzzFeed, Stores, and Categories.
- Persist Buzz posts, saved actions, and Useful actions.
- Provide an account-specific Profile page showing authored, saved, and Useful Buzz posts.
- Validate backend behavior through functional testing, security checks, and persistence verification.
- Address development and usability feedback through improved integration, quality assurance, documentation, and task prioritization.

## 2. Technology Stack

| Technology | Purpose |
|---|---|
| React | Component-based frontend interface. |
| Vite | Frontend development server, HMR, and production builds. |
| Node.js | JavaScript runtime for backend execution. |
| Express.js | REST API routing and request processing. |
| JWT | Authentication tokens for protected requests. |
| bcrypt | Password hashing for account credentials. |
| JSON files | Local application data persistence. |
| npm | Dependency installation and script execution. |
| ESLint | Frontend code-quality checks, if configured. |

## 3. System Architecture

The application separates the frontend presentation layer from the backend API and persistence layer.

```text
+------------------------------------------+
|           React + Vite Frontend          |
|                                          |
| Home | BuzzFeed | Stores | Categories    |
| Login | Signup | Create Buzz | My Profile|
+---------------------+--------------------+
                      |
                      | HTTP / JSON
                      | /api/*
                      v
+------------------------------------------+
|          Node.js + Express Backend       |
|                                          |
| Authentication | Validation | REST API   |
| JWT Middleware | Buzz Management         |
| User Profile   | Save / Useful Actions    |
+---------------------+--------------------+
                      |
                      | File-based persistence
                      v
+------------------------------------------+
|               JSON Storage               |
|                                          |
| users.json | buzzes.json                 |
| buzzes.seed.json (demo seed data)        |
+------------------------------------------+
```

### Request and Data Flow

1. A user interacts with a React component.
2. The frontend sends an HTTP request to the appropriate `/api` endpoint.
3. Express.js parses the request and applies the relevant validation and authentication checks.
4. The backend processes the request and reads or updates the relevant data.
5. Updated records are persisted to the appropriate JSON file.
6. The backend returns an HTTP response containing the result or an appropriate error.
7. The frontend updates its displayed state using the API response or a subsequent data refresh.

This separation improves maintainability by keeping presentation, request handling, business logic, and persistence responsibilities distinct.

## 4. Project Structure

The project uses two main application directories: `backend/` and `react-setup/`.

```text
Kumarites/
├── README.md
├── MS2-IMPLEMENTATION-NOTES.md
├── MS2-RUBRIC-ALIGNMENT.md
│
├── backend/
│   ├── README.md
│   ├── package.json
│   ├── server.cjs
│   ├── .env
│   ├── users.json
│   ├── buzzes.json
│   └── buzzes.seed.json
│
└── react-setup/
    ├── README.md
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── data/
        │   └── buzzes.js
        └── ...
```

### Key Files

| File | Responsibility |
|---|---|
| `backend/server.cjs` | Express server, API routes, middleware, and backend operations. |
| `backend/.env.example` | Template for local environment configuration. |
| `backend/users.json` | Local account records. |
| `backend/buzzes.json` | Runtime Buzz records and persisted interactions. |
| `backend/buzzes.seed.json` | Demo records used to initialize an empty or missing runtime Buzz store. |
| `react-setup/src/data/buzzes.js` | Shared frontend Buzz data access and Useful-count API action. |
| `react-setup/vite.config.js` | Vite configuration, including the development API proxy. |
| `MS2-IMPLEMENTATION-NOTES.md` | Supporting implementation notes and verification checklist. |
| `MS2-RUBRIC-ALIGNMENT.md` | Supporting rubric mapping and evaluation evidence. |

## 5. System Requirements

Install the following before running the project:

- Node.js **20.19+ or 22.12+**, as specified for this project's Vite 8 setup.
- npm.
- Visual Studio Code or another suitable editor.
- A modern web browser.

Verify the installed versions:

```powershell
node -v
npm -v
```

Use a supported Node.js release and confirm the version requirements against the installed Vite version.

## 6. Installation and Configuration

### 6.1 Configure the Backend

Open the project in VS Code. Open a PowerShell terminal and navigate to the backend directory:

```powershell
cd backend
```

Install dependencies and run the backend checks:

```powershell
npm.cmd install
npm.cmd audit
npm.cmd run check
npm.cmd run dev
```

The backend should listen on:

- API base URL: `http://localhost:3001`
- Health endpoint: `http://localhost:3001/api/health`

Keep the backend terminal running.

### 6.2 Configure the Frontend

Open a second PowerShell terminal in VS Code:

```powershell
cd react-setup
```

Install dependencies and validate the frontend:

```powershell
npm.cmd install
npm.cmd run lint
npm.cmd run build
npm.cmd run dev
```

Open the local URL printed by Vite, normally:

`http://localhost:5173`

The Vite development proxy forwards `/api` requests to the backend at `http://127.0.0.1:3001`.

Keep both terminals running during development and testing.

> **Windows note:** The `npm.cmd` commands avoid common PowerShell execution-policy issues associated with invoking `npm.ps1`.

### 6.3 Environment Configuration

| Variable | Purpose |
|---|---|
| `JWT_SECRET` | Secret used to sign and verify authentication tokens. |
| `SEED_DEMO_ACCOUNT` | Explicit opt-in for creating the local evaluator account. |
| `NODE_ENV` | Controls the runtime environment and production safeguards. |

The actual environment variables supported by the server should be confirmed in its configuration and startup code.

## 7. Core Features

### 7.1 Account Registration and Login

Users can register for an account and authenticate through the backend.

The authentication workflow includes:

1. Submit account information through the frontend.
2. Validate the request on the backend.
3. Hash passwords using bcrypt instead of storing plaintext passwords.
4. Verify credentials during login.
5. Issue a signed JWT after successful authentication.
6. Include the token in protected API requests.
7. Require reauthentication when the token expires or the user logs out.

Login and signup use the frontend's same-origin `/api/auth` proxy paths.

The frontend stores login state in browser `localStorage`. This allows the session to remain available across tabs in the same browser profile until logout or token expiration. The backend JWT lifetime is one hour, according to the supplied implementation notes.

**Security consideration:** Browser storage accessible to JavaScript can be exposed by cross-site scripting. Production deployments should assess a hardened session strategy, appropriate cookie settings, and other defenses against token theft.

### 7.2 Create a Buzz

Authenticated users can publish a community post through the Create a Buzz modal.

The form supports:

- Title
- Description
- Category
- Buzz
- Upload a Photo

---

## 8. Project Documentation and Testing

The following documents provide supporting information for the Kumarites Terminal Assessment, including the application development workflow, AI tool usage disclosure, and internal system testing.

### 8.1 TA Documentation

- **AI Use Statement:** [View AI Use Statement](https://docs.google.com/document/d/1U2OT6bfrxlslZUeDDw_FO0qLsSAw_2oquiWmlCx9QoA/edit?usp=sharing)
- **Application Development Workflow Worksheet:** [View Workflow Worksheet](https://docs.google.com/spreadsheets/d/1zuNlpsh_xMfn_F9xti85dr5v-XrY-hOGiOzh3YUXaOc/edit?usp=sharing)

### 8.2 Internal Testing and Bug Fixes

Internal testing was conducted as part of the TA system validation process to assess application functionality and identify potential issues.

The testing process involved documenting identified issues and bugs, reviewing their behavior, and implementing the necessary corrections. The bugs identified during internal testing were subsequently addressed and fixed.

- **Internal Testing Documentation:** [View Testing Results](https://docs.google.com/spreadsheets/d/1liVR4iANOdvkr4x5cl46HdqrfYT3cPRthyPZudF0MaE/edit?usp=sharing)

### 8.3 Test Account

A test account is available for authorized testing and demonstration of the application's registration and authentication features.

| Field | Details |
|---|---|
| Email | `testaccount@gmail.com` |
| Password | `Test12345!` |