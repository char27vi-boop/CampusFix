# CampusFix

CampusFix is a campus maintenance complaint management system built to streamline how campus facilities and repairs are reported, tracked, and resolved.

Students can report maintenance issues across campus (such as electrical, plumbing, carpentry, and Wi-Fi problems) and track their progress in real time. Campus administration and staff can review complaints, assign priorities, and update statuses.

---

## Features

- **User Authentication**: Secure signup and login powered by JSON Web Tokens (JWT) and `bcryptjs` password hashing.
- **Role-Based Access Control (RBAC)**:
  - **Student Role**: Submit complaints (automatically associated with the logged-in student), track live status, filter and search personal or campus-wide complaints.
  - **Admin Role**: Exclusive access to the `/admin` portal to review incoming complaints, update resolution statuses, inspect details, and review analytics.
  - Non-admin attempts to access `/admin` are blocked and redirected to an access-denied safeguard.
- **Client Routing**: Full multi-page navigation using `react-router-dom` with protected routes and session verification.
- **Student Dashboard**: Live overview displaying complaint statistics (Total, Pending, In Progress, and Resolved).
- **Complaint Submission Form**: Student form to submit new complaints with fields for title, category, location, and detailed description, along with client-side validation and backend foreign-key association (`user_id`).
- **Search & Filter**: Search complaints by title or location and filter by category and status in real time.
- **Complaint Cards**: Structured details including unique Complaint ID, status badge, timestamp, location, priority, and reporter information.
- **Admin Dashboard**: Comprehensive management interface featuring overview statistics, search and status updates, details modal, and distribution analytics bar charts.
- **Backend REST API**: Express.js backend with SQLite persistence, validation, and JWT authorization middleware.

---

## Tech Stack

### Frontend
- **React.js** (v19)
- **React Router** (`react-router-dom` v7)
- **Vite**
- **CSS** (Custom responsive design system for student & admin portals)

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
| **Admin** | `admin@campusfix.edu` | `admin123` | Full access: Admin Dashboard (`/admin`), status management, analytics, delete |
| **Student** | `student@campusfix.edu` | `student123` | Student Dashboard (`/dashboard`), file complaints (`/submit`) |
| **Staff** | `staff@campusfix.edu` | `staff123` | Complaint status updates and viewing |

*(You can also create brand new accounts directly on the Signup page with selectable roles).*

---

## How to Run the Project

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/CampusFix.git
cd CampusFix
```

### 2. Start the Backend Server
Open a terminal and run:
```bash
cd server
npm install
node server.js
```
The backend server will run on `http://localhost:5000`.

### 3. Start the Frontend Client
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
- `GET /api/complaints`: Retrieve all complaints (supports `?status=...`, `?category=...`, and `?mine=true`).
- `GET /api/complaints/:id`: Get a single complaint by ID.
- `POST /api/complaints`: Submit a new complaint (attaches authenticated `user_id` if logged in).
- `PUT /api/complaints/:id`: Update complaint fields or status *(Protected: Admin or Staff role only)*.
- `DELETE /api/complaints/:id`: Delete a complaint *(Protected: Admin role only)*.

---

## Project Status

- [x] Express REST API for complaints management
- [x] Student Dashboard frontend with search and filtering
- [x] Complaint Submission Form with client validation
- [x] SQLite database persistence & automatic seeding
- [x] Admin Dashboard for complaint resolution & analytics
- [x] User Authentication & Auth Middleware (JWT & bcryptjs)
- [x] Role-Based Access Control (RBAC) protecting endpoints and routes
- [x] Formal client routing with `react-router-dom` and route guards
