# CampusFix

CampusFix is a campus maintenance complaint management system built to streamline how campus facilities and repairs are reported, tracked, and resolved.

Students can report maintenance issues across campus (such as electrical, plumbing, carpentry, and Wi-Fi problems) and track their progress in real time. Campus administration and staff can review complaints, assign priorities, and update statuses.

---

## Features

- **Student Dashboard**: Live overview displaying complaint statistics (Total, Pending, In Progress, and Resolved).
- **Complaint Submission Form**: Student form to submit new complaints with fields for title, category, location, and detailed description, along with client-side validation.
- **Search & Filter**: Search complaints by title or location and filter by category and status in real time.
- **Complaint Cards**: Structured details including unique Complaint ID, status badge, timestamp, location, and priority.
- **Backend REST API**: Express.js backend for managing and persisting maintenance complaints.
- **Admin Dashboard**: Manage and update complaint statuses (in development).

---

## Tech Stack

### Frontend
- **React.js** (v19)
- **Vite**
- **CSS** (Custom dashboard design system)

### Backend
- **Node.js** & **Express.js**
- **CORS**
- **SQLite** (In progress)

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

## Project Status

- [x] Express REST API for complaints management
- [x] Student Dashboard frontend with search and filtering
- [x] Complaint Submission Form with client validation
- [ ] SQLite database persistence
- [ ] Admin Dashboard for complaint resolution
