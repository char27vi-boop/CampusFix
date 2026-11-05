import StatsCards from "./StatsCards";
import ComplaintTable from "./ComplaintTable";
import { getRecentComplaints } from "../../utils/adminHelpers";

// "Overview" page: summary cards and the most recent complaints.
// Props:
//   complaints - the full list of complaints
//   onView     - function called with a complaint ID to open its details
function AdminOverview({ complaints, onView }) {
  const recentComplaints = getRecentComplaints(complaints, 5);

  return (
    <>
      <StatsCards complaints={complaints} />

      <section className="complaints-section">
        <div className="section-heading">
          <h2>Recent Complaints</h2>
          <p>The latest complaints submitted by students.</p>
        </div>

        <ComplaintTable
          complaints={recentComplaints}
          onView={onView}
          emptyMessage="No complaints have been submitted yet."
        />
      </section>
    </>
  );
}

export default AdminOverview;
