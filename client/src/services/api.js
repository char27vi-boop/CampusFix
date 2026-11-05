const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export function getAuthHeaders() {
  const token = localStorage.getItem("campusfix_token");
  const headers = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to log in.");
  }
  return data;
}

export async function signupUser(userData) {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create account.");
  }
  return data;
}

export async function getCurrentUser(token) {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Session expired or invalid.");
  }
  return data.user;
}

export async function getComplaints(signal, queryParams = {}) {
  const query = new URLSearchParams();
  if (queryParams.status && queryParams.status !== "All") {
    query.set("status", queryParams.status);
  }
  if (queryParams.category && queryParams.category !== "All") {
    query.set("category", queryParams.category);
  }
  if (queryParams.mine) {
    query.set("mine", "true");
  }
  if (queryParams.scope) {
    query.set("scope", queryParams.scope);
  }

  const queryString = query.toString() ? `?${query.toString()}` : "";
  const response = await fetch(
    `${API_BASE_URL}/api/complaints${queryString}`,
    {
      signal,
      headers: getAuthHeaders()
    }
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

export async function createComplaint(complaint) {
  const response = await fetch(
    `${API_BASE_URL}/api/complaints`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(complaint)
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to submit complaint."
    );
  }

  return data;
}

export async function updateComplaint(id, updates) {
  const response = await fetch(
    `${API_BASE_URL}/api/complaints/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to update complaint."
    );
  }

  return data;
}

export async function deleteComplaint(id) {
  const response = await fetch(
    `${API_BASE_URL}/api/complaints/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: getAuthHeaders()
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to delete complaint."
    );
  }

  return data;
}
