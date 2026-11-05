import BarChart from "./BarChart";
import {
  STATUSES,
  OTHER_STATUS,
  countByField,
  countStatuses,
} from "../../utils/adminHelpers";

// "Analytics" page: summary numbers and two CSS bar charts.
// Props:
//   complaints - the full list of complaints
function AdminAnalytics({ complaints }) {
  const total = complaints.length;
  const statusCounts = countStatuses(complaints);
  const categoryCounts = countByField(complaints, "category");

  // Chart data: one entry per status (always in the same order). An
  // "Other Status" bar is added only when some complaints need it, so the
  // bars always add up to the total.
  const chartStatuses =
    statusCounts[OTHER_STATUS] > 0 ? [...STATUSES, OTHER_STATUS] : STATUSES;
  const statusData = chartStatuses.map((status) => ({
    label: status,
    value: statusCounts[status],
  }));

  // Chart data: one entry per category, largest first.
  const categoryData = Object.keys(categoryCounts)
    .map((category) => ({ label: category, value: categoryCounts[category] }))
    .sort((a, b) => b.value - a.value);

  // Summary numbers.
  const resolved = statusCounts["Resolved"];
  const resolutionRate = total === 0 ? 0 : Math.round((resolved / total) * 100);
  const openHighPriority = complaints.filter(
    (item) => item.priority === "High" && item.status !== "Resolved"
  ).length;
  const topCategory = categoryData.length > 0 ? categoryData[0].label : "-";

  return (
    <>
      <section className="stats-grid">
        <div className="stat-card">
          <p>Total Complaints</p>
          <h2>{total}</h2>
        </div>

        <div className="stat-card">
          <p>Resolution Rate</p>
          <h2>{resolutionRate}%</h2>
        </div>

        <div className="stat-card">
          <p>Open High Priority</p>
          <h2>{openHighPriority}</h2>
        </div>

        <div className="stat-card">
          <p>Most Reported Category</p>
          <h2>{topCategory}</h2>
        </div>
      </section>

      <section className="chart-grid">
        <BarChart
          title="Complaints by Category"
          data={categoryData}
          total={total}
        />
        <BarChart
          title="Complaints by Status"
          data={statusData}
          total={total}
          tone
        />
      </section>
    </>
  );
}

export default AdminAnalytics;
