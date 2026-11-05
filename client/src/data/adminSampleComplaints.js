// ------------------------------------------------------------------
// SAMPLE DATA - for the Admin Dashboard demonstration only.
//
// The Express + SQLite backend does not exist yet, so the Admin
// Dashboard uses this list. It has the same fields as the sample data
// in StudentDashboard.jsx, so real API data can replace it later
// without changing any component.
//
// To switch to the real backend, set USE_SAMPLE_DATA to false in
// src/pages/AdminDashboard.jsx.
// ------------------------------------------------------------------

export const sampleAdminComplaints = [
  {
    id: "CF101",
    title: "Wi-Fi not working",
    description: "Internet connection is frequently disconnecting.",
    category: "Internet",
    location: "Academic Block",
    priority: "High",
    status: "Pending",
    date: "01 Nov 2026",
  },
  {
    id: "CF102",
    title: "Projector issue",
    description: "Projector is not displaying properly.",
    category: "Electrical",
    location: "Classroom 204",
    priority: "Medium",
    status: "In Progress",
    date: "30 Oct 2026",
  },
  {
    id: "CF103",
    title: "Water cooler not working",
    description: "Water cooler needs maintenance.",
    category: "Water",
    location: "Hostel Block A",
    priority: "High",
    status: "Resolved",
    date: "28 Oct 2026",
  },
  {
    id: "CF104",
    title: "Broken classroom chair",
    description: "One of the classroom chairs is damaged.",
    category: "Furniture",
    location: "Academic Block",
    priority: "Low",
    status: "Pending",
    date: "01 Nov 2026",
  },
  {
    id: "CF105",
    title: "Corridor light flickering",
    description:
      "The tube light near the staircase on the second floor keeps flickering and goes off every few minutes.",
    category: "Electrical",
    location: "Library Building",
    priority: "Medium",
    status: "Pending",
    date: "02 Nov 2026",
  },
  {
    id: "CF106",
    title: "Leaking tap in washroom",
    description:
      "The wash basin tap is leaking continuously and the floor stays wet.",
    category: "Water",
    location: "Hostel Block B",
    priority: "Medium",
    status: "In Progress",
    date: "29 Oct 2026",
  },
  {
    id: "CF107",
    title: "Lab computers not booting",
    description:
      "Five computers in the networking lab do not start. They show a black screen after the logo.",
    category: "Internet",
    location: "Computer Lab 2",
    priority: "High",
    status: "In Progress",
    date: "31 Oct 2026",
  },
  {
    id: "CF108",
    title: "Broken window latch",
    description:
      "The window latch is broken, so the window will not close during rain.",
    category: "Furniture",
    location: "Classroom 108",
    priority: "Low",
    status: "Resolved",
    date: "25 Oct 2026",
  },
  {
    id: "CF109",
    title: "Overflowing dustbin",
    description:
      "Dustbins near the canteen entrance are overflowing and have not been cleared for two days.",
    category: "Cleanliness",
    location: "Canteen",
    priority: "Medium",
    status: "Resolved",
    date: "27 Oct 2026",
  },
  {
    id: "CF110",
    title: "Ceiling fan making noise",
    description:
      "The ceiling fan makes a loud rattling sound when running at full speed.",
    category: "Electrical",
    location: "Classroom 204",
    priority: "Low",
    status: "Pending",
    date: "03 Nov 2026",
  },
];
