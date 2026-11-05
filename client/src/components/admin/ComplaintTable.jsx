import { StatusBadge, PriorityBadge } from "./Badges";

// Table listing complaints. Used by both the Overview (recent complaints)
// and the Complaints page (all complaints).
// Props:
//   complaints - the complaints to display
//   onView     - function called with a complaint ID when "View" is clicked
//   emptyMessage - text shown instead of the table when there is nothing to list
function ComplaintTable({
  complaints,
  onView,
  emptyMessage = "No complaints to display.",
}) {
  // Conditional rendering: show a message instead of an empty table.
  if (complaints.length === 0) {
    return <div className="message-box">{emptyMessage}</div>;
  }

  return (
    // The wrapper lets the table scroll sideways on small screens.
    <div className="table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Location</th>
            <th>Priority</th>
            <th>Submitted</th>
            <th>Status</th>
            <th className="cell-action">Action</th>
          </tr>
        </thead>

        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint.id}>
              <td className="cell-id">{complaint.id}</td>
              <td className="cell-title">{complaint.title}</td>
              <td>{complaint.category}</td>
              <td>{complaint.location}</td>
              <td>
                <PriorityBadge priority={complaint.priority} />
              </td>
              <td className="cell-date">{complaint.date}</td>
              <td>
                <StatusBadge status={complaint.status} />
              </td>
              <td className="cell-action">
                <button
                  type="button"
                  className="view-button"
                  aria-label={`View complaint ${complaint.id}`}
                  onClick={() => onView(complaint.id)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ComplaintTable;
