// API functions used by the Admin Dashboard.

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function updateComplaintStatus(id, status) {
  const response = await fetch(
    `${API_BASE_URL}/api/complaints/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || `Unable to update status. Server returned ${response.status}.`
    );
  }

  return data;
}