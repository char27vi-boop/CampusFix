import { useState, useEffect } from "react";
import { getComplaints, deleteComplaint } from "../services/api";
import { useAuth } from "../context/useAuth";
import ComplaintCard from "../components/ComplaintCard";
import FilterBar from "../components/Filterbar";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [scope, setScope] = useState("mine"); // "mine" (default) vs "all"
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getComplaints(controller.signal, { scope })
      .then((data) => {
        setComplaints(data);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load complaints.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [scope, refreshIndex]);

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

  function handleRefresh() {
    setLoading(true);
    setError("");
    setRefreshIndex((prev) => prev + 1);
  }

  function handleScopeChange(newScope) {
    if (newScope !== scope) {
      setLoading(true);
      setError("");
      setScope(newScope);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to cancel and delete this pending complaint?")) {
      return;
    }

    try {
      await deleteComplaint(id);
      setComplaints((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.message || "Failed to cancel complaint.");
    }
  }

  return (
    <main className="main-content" id="dashboard">
      <header className="page-header">
        <div>
          <h1>Student Dashboard</h1>
          <p>Track, manage, and view campus maintenance complaints.</p>
        </div>

        <button className="refresh-button" onClick={handleRefresh}>
          Refresh
        </button>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <p>{scope === "mine" ? "My Total Complaints" : "Campus Total"}</p>
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
          <h2>Complaints Overview</h2>
          <p>Filter between your own personal requests or campus-wide updates.</p>
        </div>

        {/* Scope Toggle: My Complaints (Default) vs All Campus Complaints */}
        <div className="dashboard-scope-tabs">
          <button
            type="button"
            className={scope === "mine" ? "scope-tab scope-tab-active" : "scope-tab"}
            onClick={() => handleScopeChange("mine")}
          >
            👤 My Complaints
          </button>
          <button
            type="button"
            className={scope === "all" ? "scope-tab scope-tab-active" : "scope-tab"}
            onClick={() => handleScopeChange("all")}
          >
            🏫 All Campus Complaints
          </button>
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
            {scope === "mine"
              ? "You have not submitted any complaints yet. Use the 'Submit Complaint' tab to file one."
              : "No campus complaints match your current filters."}
          </div>
        ) : (
          <div className="complaint-list">
            {filteredComplaints.map((complaint) => {
              const isOwner = user && complaint.user_id === user.user_id;
              return (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  isOwner={isOwner}
                  onDelete={isOwner && complaint.status === "Pending" ? handleDelete : null}
                />
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
