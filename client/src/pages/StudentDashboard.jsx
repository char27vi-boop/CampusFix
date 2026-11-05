
import { useState, useEffect } from "react";
import { getComplaints } from "../services/api";
import ComplaintCard from "../components/ComplaintCard";
import FilterBar from "../components/Filterbar";


export default function StudentDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  useEffect(() => {
  const controller = new AbortController();

  getComplaints(controller.signal)
    .then((data) => {
      setComplaints(data);
    })
    .catch((error) => {
      if (error.name !== "AbortError") {
        setError(error.message);
      }
    })
    .finally(() => {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    });

  return () => controller.abort();
}, []);

  const categories = [...new Set(
    complaints.map((item) => item.category)
  )].sort();

  const filteredComplaints = complaints.filter((item) => {
    const query = search.toLowerCase().trim();

    const matchesSearch =
      (item.title || "").toLowerCase().includes(query) ||
      (item.location || "").toLowerCase().includes(query);

    const matchesStatus =
      status === "All" || item.status === status;

    const matchesCategory =
      category === "All" || item.category === category;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const countByStatus = (value) =>
    complaints.filter((item) => item.status === value).length;

  async function refreshComplaints() {
    setLoading(true);
    setError("");

    try {
      const data = await getComplaints();
      setComplaints(data);

      setSearch("");
      setStatus("All");
      setCategory("All");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="main-content" id ="dashboard">
      <header className="page-header">
        <div>
          <h1>Student Dashboard</h1>
          <p>Track and manage campus maintenance complaints.</p>
        </div>

        <button className="refresh-button" onClick={refreshComplaints}>
          Refresh
        </button>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <p>Total Complaints</p>
          <h2>{complaints.length}</h2>
        </div>

        <div className="stat-card">
          <p>Pending</p>
          <h2>{countByStatus("Pending")}</h2>
        </div>

        <div className="stat-card">
          <p>In Progress</p>
          <h2>{countByStatus("In Progress")}</h2>
        </div>

        <div className="stat-card">
          <p>Resolved</p>
          <h2>{countByStatus("Resolved")}</h2>
        </div>
      </section>

      <section className="complaints-section">
        <div className="section-heading">
          <h2>Recent Complaints</h2>
          <p>Search and filter submitted complaints.</p>
        </div>

        <FilterBar
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          category={category}
          setCategory={setCategory}
          categories={categories}
        />

        {loading ? (
          <div className="message-box">
            Loading complaints...
          </div>
        ) : error ? (
          <div className="message-box">
            {error}
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="message-box">
            No complaints match your filters.
          </div>
        ) : (
          <div className="complaint-list">
            {filteredComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
              />
            ))}
 
          </div>
        )}
      </section>
    </main>
  );
}
