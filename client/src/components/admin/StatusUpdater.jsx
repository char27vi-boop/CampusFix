import { STATUSES } from "../../utils/adminHelpers";

// Three buttons (Pending / In Progress / Resolved). The button matching the
// current status is highlighted. Clicking another one changes the status.
// Props:
//   currentStatus - the complaint's present status
//   onChange      - function called with the new status
//   disabled      - true while a change is being saved
function StatusUpdater({ currentStatus, onChange, disabled }) {
  // Clicking the status that is already selected does nothing (no needless save).
  function handleClick(status) {
    if (status !== currentStatus) {
      onChange(status);
    }
  }

  return (
    <div className="status-updater">
      <p className="detail-label">Update Status</p>

      <div className="status-options">
        {STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            disabled={disabled}
            aria-pressed={status === currentStatus}
            className={
              status === currentStatus
                ? "status-option status-option-active"
                : "status-option"
            }
            onClick={() => handleClick(status)}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}

export default StatusUpdater;
