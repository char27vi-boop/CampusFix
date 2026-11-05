import { useEffect, useRef } from "react";
import { StatusBadge, PriorityBadge } from "./Badges";
import StatusUpdater from "./StatusUpdater";

// Pop-up window showing everything about one complaint, plus the controls
// to change its status.
// Props:
//   complaint      - the complaint to show
//   onClose        - function that closes the pop-up
//   onStatusChange - function called with (complaintId, newStatus)
//   isUpdating     - true while a status change is being saved
//   updateError    - error text to show if saving failed ("" if none)
function ComplaintDetailsModal({
  complaint,
  onClose,
  onStatusChange,
  isUpdating,
  updateError,
}) {
  const cardRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Always call the newest onClose without re-adding the key listener on
  // every render.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Move keyboard focus into the pop-up when it opens, and give it back to
  // the button that opened it when it closes.
  useEffect(() => {
    const opener = document.activeElement;
    closeButtonRef.current.focus();

    return () => {
      if (opener instanceof HTMLElement) {
        opener.focus();
      }
    };
  }, []);

  // Escape closes the pop-up. Tab stays inside it (aria-modal="true" promises
  // this), so keyboard users cannot reach the page behind the overlay.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const buttons = cardRef.current.querySelectorAll("button:not(:disabled)");
      if (buttons.length === 0) {
        return;
      }

      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      const focusIsInside = cardRef.current.contains(document.activeElement);

      if (!focusIsInside) {
        // Focus was lost (for example a button was disabled while saving).
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup: remove the listener when the pop-up closes.
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className="modal-overlay"
      onClick={(event) => {
        // Only close when the dark background itself is clicked.
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={cardRef}
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="complaint-modal-title"
      >
        <div className="modal-header">
          <div>
            <p className="complaint-id">{complaint.id}</p>
            <h2 id="complaint-modal-title">{complaint.title}</h2>
          </div>

          <StatusBadge status={complaint.status} />
        </div>

        <div>
          <p className="detail-label">Description</p>
          <p className="detail-description">{complaint.description}</p>
        </div>

        <div className="detail-grid">
          <div>
            <p className="detail-label">Category</p>
            <p className="detail-value">{complaint.category}</p>
          </div>

          <div>
            <p className="detail-label">Location</p>
            <p className="detail-value">{complaint.location}</p>
          </div>

          <div>
            <p className="detail-label">Priority</p>
            <PriorityBadge priority={complaint.priority} />
          </div>

          <div>
            <p className="detail-label">Submitted</p>
            <p className="detail-value">{complaint.date}</p>
          </div>
        </div>

        <StatusUpdater
          currentStatus={complaint.status}
          disabled={isUpdating}
          onChange={(newStatus) => onStatusChange(complaint.id, newStatus)}
        />

        {updateError && (
          <p className="error-text" role="alert">
            {updateError}
          </p>
        )}

        <div className="modal-footer">
          <button
            type="button"
            ref={closeButtonRef}
            className="refresh-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetailsModal;
