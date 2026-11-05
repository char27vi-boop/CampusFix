import {
  STATUSES,
  OTHER_STATUS,
  countStatuses,
} from "../../utils/adminHelpers";

// The summary cards: Total, Pending, In Progress and Resolved.
// If some complaints have an unrecognised status, a fifth "Other Status" card
// appears so the cards always add up to the total.
// Uses the same ".stats-grid" and ".stat-card" styles as the Student Dashboard.
// Props:
//   complaints - the full list of complaints
function StatsCards({ complaints }) {
  const statusCounts = countStatuses(complaints);
  const otherCount = statusCounts[OTHER_STATUS];

  return (
    <section
      className={otherCount > 0 ? "stats-grid stats-grid-with-other" : "stats-grid"}
    >
      <div className="stat-card">
        <p>Total Complaints</p>
        <h2>{complaints.length}</h2>
      </div>

      {STATUSES.map((status) => (
        <div className="stat-card" key={status}>
          <p>{status}</p>
          <h2>{statusCounts[status]}</h2>
        </div>
      ))}

      {otherCount > 0 && (
        <div className="stat-card">
          <p>{OTHER_STATUS}</p>
          <h2>{otherCount}</h2>
        </div>
      )}
    </section>
  );
}

export default StatsCards;
