import { STATUSES, toClassName } from "../../utils/adminHelpers";

// Small coloured label for a complaint status.
// It reuses the existing ".status" pill from App.css and adds a colour.
// A status that is not Pending / In Progress / Resolved still shows its own
// text (or "Unknown" when empty) in a neutral colour.
export function StatusBadge({ status }) {
  const tone = STATUSES.includes(status) ? toClassName(status) : "other";

  return (
    <span className={`status status-badge status-${tone}`}>
      {status ? String(status) : "Unknown"}
    </span>
  );
}

// Small outlined label for a complaint priority (High / Medium / Low).
export function PriorityBadge({ priority }) {
  return (
    <span className={`priority-badge priority-${toClassName(priority)}`}>
      {priority}
    </span>
  );
}
