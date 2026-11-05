import FilterBar from "../Filterbar";
import ComplaintTable from "./ComplaintTable";

// "Complaints" page: search, filter and browse every complaint.
// The existing FilterBar from the Student Dashboard is reused as it is.
// Props:
//   complaints     - the full list of complaints
//   onView         - function called with a complaint ID to open its details
//   filters        - { search, status, category } chosen by the admin
//   onFilterChange - function called with (name, value) to change one filter
//
// The filters live in AdminDashboard, not here, so they are remembered when
// the admin switches to another page and comes back.
function ComplaintManagement({ complaints, onView, filters, onFilterChange }) {
  const { search, status } = filters;

  // Build the category drop-down from the complaints themselves.
  const categories = [
    ...new Set(complaints.map((item) => item.category).filter(Boolean)),
  ].sort();

  // If the chosen category no longer exists (for example after a Refresh),
  // fall back to "All" instead of showing an empty table.
  const category = categories.includes(filters.category)
    ? filters.category
    : "All";

  // Keep only the complaints that match the search and both filters.
  const filteredComplaints = complaints.filter((item) => {
    const query = search.toLowerCase().trim();

    // "?? ''" keeps the page working if a record has no title or location.
    const matchesSearch =
      String(item.title ?? "").toLowerCase().includes(query) ||
      String(item.location ?? "").toLowerCase().includes(query);

    const matchesStatus = status === "All" || item.status === status;
    const matchesCategory = category === "All" || item.category === category;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Say why the table is empty: no complaints at all, or nothing matches.
  const emptyMessage =
    complaints.length === 0
      ? "No complaints have been submitted yet."
      : "No complaints match your filters.";

  return (
    <section className="complaints-section">
      <div className="section-heading">
        <h2>All Complaints</h2>
        <p>
          Showing {filteredComplaints.length} of {complaints.length} complaints.
        </p>
      </div>

      <FilterBar
        search={search}
        setSearch={(value) => onFilterChange("search", value)}
        status={status}
        setStatus={(value) => onFilterChange("status", value)}
        category={category}
        setCategory={(value) => onFilterChange("category", value)}
        categories={categories}
      />

      <ComplaintTable
        complaints={filteredComplaints}
        onView={onView}
        emptyMessage={emptyMessage}
      />
    </section>
  );
}

export default ComplaintManagement;
