
import { useState } from "react";
import ComplaintCard from "../components/ComplaintCard";
import FilterBar from "../components/Filterbar";

const sampleComplaints = [
  {
    id: "CF101",
    title: "Wi-Fi not working",
    description: "Internet connection is frequently disconnecting.",
    category: "Internet",
    location: "Academic Block",
    priority: "High",
    status: "Pending",
    date: "01 Nov 2026"
  },
  {
    id: "CF102",
    title: "Projector issue",
    description: "Projector is not displaying properly.",
    category: "Electrical",
    location: "Classroom 204",
    priority: "Medium",
    status: "In Progress",
    date: "30 Oct 2026"
  },
  {
    id: "CF103",
    title: "Water cooler not working",
    description: "Water cooler needs maintenance.",
    category: "Water",
    location: "Hostel Block A",
    priority: "High",
    status: "Resolved",
    date: "28 Oct 2026"
  },
  {
    id: "CF104",
    title: "Broken classroom chair",
    description: "One of the classroom chairs is damaged.",
    category: "Furniture",
    location: "Academic Block",
    priority: "Low",
    status: "Pending",
    date: "01 Nov 2026"
  }
];

export default function StudentDashboard() {
  const [complaints, setComplaints] = useState(sampleComplaints);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");

  const categories = [...new Set(
    complaints.map((item) => item.category)
  )].sort();

  const filteredComplaints = complaints.filter((item) => {
    const query = search.toLowerCase().trim();

    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query);

    const matchesStatus =
      status === "All" || item.status === status;

    const matchesCategory =
      category === "All" || item.category === category;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const countByStatus = (value) =>
    complaints.filter((item) => item.status === value).length;

  function refreshComplaints() {
    setComplaints(sampleComplaints);
    setSearch("");
    setStatus("All");
    setCategory("All");
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

        {filteredComplaints.length === 0 ? (
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
