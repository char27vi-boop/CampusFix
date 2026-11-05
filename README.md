# CampusFix

CampusFix is a modern campus maintenance complaint management system built to streamline how campus facilities, infrastructure, and repairs are reported, tracked, and resolved.

Students can report maintenance issues across campus (such as electrical, plumbing, carpentry, and Wi-Fi problems), toggle between their personal complaints and campus-wide requests, and manage pending tickets in real time. Campus administration and staff can review complaints, update resolution statuses, inspect details, and analyze facility metrics.

---

## Features

- **User Authentication & Security**:
  - Secure signup and login powered by JSON Web Tokens (JWT) and `bcryptjs` password hashing.
  - Profile verification endpoint (`/api/auth/me`) validating active sessions.
- **Role-Based Access Control (RBAC)**:
  - **Student Role**: File complaints (automatically associated with the student's `user_id`), view isolated personal complaints by default, toggle to view campus-wide complaints, and cancel/delete or edit their own pending requests.
  - **Admin Role**: Exclusive access to the `/admin` portal to review all campus complaints, update statuses (`Pending`, `In Progress`, `Resolved`), inspect details in an accessible modal, and review distribution analytics. Non-admins attempting access are blocked.
  - **Staff Role**: Maintenance staff access to review tickets and update resolution statuses.
- **Student Dashboard**:
  - **"My Complaints" vs. "All Campus Complaints" Tabs**: Instant scope toggling between personal requests and campus-wide status updates.
  - **Self-Service Management**: Cancel or delete own pending requests directly from complaint cards.
  - **Live Overview**: Real-time summary statistics for Total, Pending, In Progress, and Resolved complaints.
  - **Real-Time Search & Filters**: Search complaints by title or location and filter by category or status.
- **Admin Dashboard**:
  - Searchable, sortable complaints table with priority and status chips.
  - One-click status updates (`Pending` $\rightarrow$ `In Progress` $\rightarrow$ `Resolved`).
  - Interactive distribution analytics with pure CSS bar charts showing category breakdowns and resolution rates.
- **Modern Light Theme UI**:
  - Consistent light theme across Student and Admin portals, cards, sidebars, modals, and authentication screens.
  - Standardized primary blue (`#2563eb`), crisp white surfaces, soft borders (`#e2e8f0`), and harmonized status/priority badges.
- **Automated Integration Test Suite**:
  - 7 comprehensive end-to-end integration test suites run via `npm test` in the `server` directory.

---

## Tech Stack

### Frontend
- **React.js** (v19)
- **React Router** (`react-router-dom` v7)
- **Vite**
- **Custom CSS** (Cohesive modern light theme design system)

### Backend
- **Node.js** & **Express.js**
- **SQLite3**
- **JSON Web Tokens (JWT)** for authentication
- **bcryptjs** for secure password hashing
- **CORS**

---

## Default Demo Accounts

The database automatically initializes and seeds standard demo accounts upon first start:

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@campusfix.edu` | `admin123` | Full access: Admin Dashboard (`/admin`), status management, analytics |
| **Student** | `student@campusfix.edu` | `student123` | Student Dashboard (`/dashboard`), file complaints (`/submit`), cancel own pending |
| **Staff** | `staff@campusfix.edu` | `staff123` | Complaint status updates and viewing |

*(You can also register brand new accounts directly on the Signup page with selectable roles).*

---

## How to Run the Project

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 1. Clone the repository
```bash
git clone https://github.com/char27vi-boop/CampusFix.git
cd CampusFix
```

### 2. Start the Backend Server
Open a terminal and run:
```bash
cd server
npm install
node server.js
```
The backend server will run on `http://localhost:5000` and automatically initialize `server/database/campusfix.db`.

### 3. Run Automated Tests
In the `server` directory, run:
```bash
npm test
```
This runs the full end-to-end test suite (`server/tests/integration.test.js`) validating registration, login, complaint submission, student isolation, status updates, and cancellation.

### 4. Start the Frontend Client
In a new terminal window, navigate to the `client` directory:
```bash
cd client
npm install
npm run dev
```
Open the local URL displayed in the terminal (usually `http://localhost:5173`) in your browser.

---

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/signup`: Register a new user (`name`, `email`, `password`, `role`).
- `POST /api/auth/login`: Authenticate and receive a JWT Bearer token.
- `GET /api/auth/me`: Validate current session and retrieve profile details (`Bearer` token required).

### Complaints (`/api/complaints`)
- `GET /api/complaints`: Retrieve complaints (supports `?scope=mine` (default for students), `?scope=all`, `?status=...`, `?category=...`).
- `GET /api/complaints/:id`: Get a single complaint by ID.
- `POST /api/complaints`: Submit a new complaint (attaches authenticated `user_id`).
- `PUT /api/complaints/:id`:
  - **Admin / Staff**: Update resolution status (`Pending`, `In Progress`, `Resolved`) and priority.
  - **Student**: Update details (`title`, `description`, `category`, `location`) of own pending complaints.
- `DELETE /api/complaints/:id`:
  - **Admin**: Delete any complaint.
  - **Student**: Cancel / delete own pending complaints.

---

## Project Status

- [x] Express REST API with SQLite database persistence & automatic seeding
- [x] Student Dashboard with "My Complaints" isolation & "All Campus" toggle
- [x] Student self-service: cancel and update own pending complaints
- [x] Complaint Submission Form with client validation & foreign-key binding (`user_id`)
- [x] Admin Dashboard for complaint resolution, modal inspection & analytics
- [x] User Authentication & Auth Middleware (JWT & bcryptjs)
- [x] Role-Based Access Control (RBAC) protecting endpoints and routes
- [x] Client routing with `react-router-dom` and route guards
- [x] Modern, harmonized Light Theme across student and admin portals
- [x] Automated integration test suite (`npm test`) in backend
