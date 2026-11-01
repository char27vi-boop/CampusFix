
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function getComplaints(signal) {
  const response = await fetch(
    `${API_BASE_URL}/api/complaints`,
    { signal }
  );

  if (!response.ok) {
    throw new Error(
      `Unable to load complaints. Server returned ${response.status}.`
    );
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Invalid complaint data received from server.");
  }

  return data;
}
