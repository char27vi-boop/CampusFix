// Small helper functions shared by the Admin Dashboard components.

// The three statuses an Admin can choose from.
export const STATUSES = ["Pending", "In Progress", "Resolved"];

// Label for complaints whose status is missing or is not one of the three above.
export const OTHER_STATUS = "Other Status";

// Counts complaints by status. Any status that is not one of STATUSES (for
// example "Closed", or no status at all) is counted under OTHER_STATUS, so the
// numbers always add up to the total number of complaints.
// Example: countStatuses(complaints) -> { Pending: 3, "In Progress": 2, Resolved: 4, "Other Status": 1 }
export function countStatuses(complaints) {
  const counts = Object.fromEntries(
    [...STATUSES, OTHER_STATUS].map((status) => [status, 0])
  );

  complaints.forEach((complaint) => {
    const key = STATUSES.includes(complaint.status)
      ? complaint.status
      : OTHER_STATUS;
    counts[key] += 1;
  });

  return counts;
}

// Counts complaints by a field.
// Example: countByField(complaints, "status") -> { Pending: 3, Resolved: 2 }
export function countByField(complaints, field) {
  const counts = {};

  complaints.forEach((complaint) => {
    const key = complaint[field];
    counts[key] = (counts[key] || 0) + 1;
  });

  return counts;
}

// Turns "In Progress" into "in-progress" so it can be used in a CSS class name.
export function toClassName(text) {
  return String(text).toLowerCase().replace(/\s+/g, "-");
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Converts a date into a number so complaints can be sorted by date.
// Understands "01 Nov 2026" (the format used by the sample data) and also
// ISO / SQLite style dates such as "2026-11-01" or "2026-11-01 09:00:00".
// Returns 0 if the text is not a date.
export function dateToNumber(dateText) {
  const text = String(dateText);
  const [day, month, year] = text.split(" ");
  const monthIndex = MONTHS.indexOf(month);

  if (monthIndex !== -1) {
    return new Date(Number(year), monthIndex, Number(day)).getTime();
  }

  const parsed = Date.parse(text.replace(" ", "T"));
  return Number.isNaN(parsed) ? 0 : parsed;
}

// Returns the newest complaints first (newest date, then highest ID).
// IDs are compared as numbers inside the text, so "CF10" comes after "CF9"
// and 10 comes after 9.
export function getRecentComplaints(complaints, limit = 5) {
  return [...complaints]
    .sort(
      (a, b) =>
        dateToNumber(b.date) - dateToNumber(a.date) ||
        String(b.id).localeCompare(String(a.id), undefined, { numeric: true })
    )
    .slice(0, limit);
}

// Turns an error into a short message a student or admin can understand.
// "action" is "load" (reading complaints) or "save" (changing a status).
// Only a failed network request throws a TypeError in fetch(), which is what
// the browser reports as "Failed to fetch" / "Load failed" / "NetworkError...".
export function getFriendlyErrorMessage(error, action = "load") {
  if (error instanceof TypeError) {
    return action === "save"
      ? "Cannot reach the server, so the status was not changed. Please try again."
      : "Cannot reach the server. Please make sure the backend is running, then press Refresh.";
  }

  // The server answered, but not with valid JSON.
  if (error instanceof SyntaxError) {
    return "The server sent a response that could not be read. Please try again.";
  }

  return error?.message || "Something went wrong. Please try again.";
}
