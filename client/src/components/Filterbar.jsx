
export default function FilterBar({
  search,
  setSearch,
  status,
  setStatus,
  category,
  setCategory,
  categories
}) {
  return (
    <div className="filter-bar">
      <input
        type="search"
        placeholder="Search by title or location..."
        aria-label="Search complaints"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <select
        aria-label="Filter by status"
        value={status}
        onChange={(event) => setStatus(event.target.value)}
      >
        <option value="All">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Resolved">Resolved</option>
      </select>

      <select
        aria-label="Filter by category"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      >
        <option value="All">All Categories</option>
        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}
