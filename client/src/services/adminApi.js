// API functions used only by the Admin Dashboard.
//
// Reading complaints is NOT repeated here: the Admin Dashboard reuses
// getComplaints() from ./api.js.
//
// IMPORTANT: the backend does not exist in the repository yet, so the
// endpoint below is a PROPOSAL for the backend teammate to implement. It
// is only called when USE_SAMPLE_DATA is false in AdminDashboard.jsx.
//
//   PATCH /api/complaints/:id/status
//   Request body:  { "status": "Pending" | "In Progress" | "Resolved" }
//   Response:      200 OK with the updated complaint as JSON

// Same base URL logic as api.js (kept separate so api.js is not modified).
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function updateComplaintStatus(id, status) {
  const response = await fetch(
    `${API_BASE_URL}/api/complaints/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Unable to update status. Server returned ${response.status}.`
    );
  }

  // The caller does not use the reply, so an empty body (for example
  // "204 No Content") must not be treated as a failure after a successful save.
  return response.json().catch(() => null);
}
