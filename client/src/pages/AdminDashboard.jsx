import { useState, useEffect } from "react";
import "../styles/admin.css";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminOverview from "../components/admin/AdminOverview";
import ComplaintManagement from "../components/admin/ComplaintManagement";
import AdminAnalytics from "../components/admin/AdminAnalytics";
import ComplaintDetailsModal from "../components/admin/ComplaintDetailsModal";

import { sampleAdminComplaints } from "../data/adminSampleComplaints";
import { getComplaints } from "../services/api";
import { updateComplaintStatus } from "../services/adminApi";
import { getFriendlyErrorMessage } from "../utils/adminHelpers";

// ------------------------------------------------------------------
// true  = use the sample data (no backend needed)
// false = load complaints from the Express API and save status changes
//         there (needs GET /api/complaints and the proposed
//         PATCH /api/complaints/:id/status - see services/adminApi.js)
// ------------------------------------------------------------------
const USE_SAMPLE_DATA = true;

// Heading and sub-heading for each page.
const pageTitles = {
  overview: {
    title: "Admin Overview",
    subtitle: "A quick summary of campus maintenance complaints.",
  },
  complaints: {
    title: "Complaint Management",
    subtitle: "Search, filter and update complaints.",
  },
  analytics: {
    title: "Analytics",
    subtitle: "See how complaints are distributed across the campus.",
  },
};

export default function AdminDashboard() {
  // All complaints. Every page reads from this single list.
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Changing this number makes the effect below run again (Refresh button).
  const [reloadCount, setReloadCount] = useState(0);

  // Which page is shown, and which complaint is open in the pop-up.
  const [activeView, setActiveView] = useState("overview");
  const [selectedId, setSelectedId] = useState(null);

  // Search and filter choices of the Complaints page. They are kept here so
  // they are not lost when the admin switches between pages.
  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    category: "All",
  });

  // State for saving a status change.
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  // Load the complaints when the page opens and whenever Refresh is clicked.
  useEffect(() => {
    const controller = new AbortController();

    async function loadComplaints() {
      setIsLoading(true);
      setLoadError("");

      try {
        const data = USE_SAMPLE_DATA
          ? sampleAdminComplaints
          : await getComplaints(controller.signal);
        setComplaints(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setLoadError(getFriendlyErrorMessage(error, "load"));
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadComplaints();

    // Cancel the request if the page is closed before it finishes.
    return () => controller.abort();
  }, [reloadCount]);

  // We store only the ID, then look the complaint up. This way the pop-up
  // always shows the latest status after a change.
  const selectedComplaint = complaints.find((item) => item.id === selectedId);

  function openComplaint(id) {
    setUpdateError("");
    setSelectedId(id);
  }

  function closeComplaint() {
    setSelectedId(null);
  }

  // Changes one search / filter choice on the Complaints page.
  function changeFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  // Changes the status of one complaint.
  async function handleStatusChange(id, newStatus) {
    setIsUpdating(true);
    setUpdateError("");

    try {
      // With the real backend, save the change first.
      if (!USE_SAMPLE_DATA) {
        await updateComplaintStatus(id, newStatus);
      }

      // Then update the list so every page shows the new status.
      setComplaints((current) =>
        current.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      setUpdateError(getFriendlyErrorMessage(error, "save"));
    } finally {
      setIsUpdating(false);
    }
  }

  // Decide what to show below the header (conditional rendering).
  function renderContent() {
    if (isLoading) {
      return <div className="message-box">Loading complaints...</div>;
    }

    if (loadError) {
      return (
        <div className="message-box">
          <p className="error-text">{loadError}</p>
        </div>
      );
    }

    if (activeView === "complaints") {
      return (
        <ComplaintManagement
          complaints={complaints}
          onView={openComplaint}
          filters={filters}
          onFilterChange={changeFilter}
        />
      );
    }

    if (activeView === "analytics") {
      return <AdminAnalytics complaints={complaints} />;
    }

    return <AdminOverview complaints={complaints} onView={openComplaint} />;
  }

  const { title, subtitle } = pageTitles[activeView];

  return (
    <div className="app-layout admin-layout">
      <AdminSidebar activeView={activeView} onChangeView={setActiveView} />

      <main className="main-content">
        <header className="page-header">
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>

          <button
            type="button"
            className="refresh-button"
            onClick={() => setReloadCount((count) => count + 1)}
          >
            Refresh
          </button>
        </header>

        {USE_SAMPLE_DATA && (
          <div className="demo-banner">
            Demo mode: showing sample data. Status changes are not saved and
            reset when you refresh.
          </div>
        )}

        {renderContent()}
      </main>

      {selectedComplaint && (
        <ComplaintDetailsModal
          complaint={selectedComplaint}
          onClose={closeComplaint}
          onStatusChange={handleStatusChange}
          isUpdating={isUpdating}
          updateError={updateError}
        />
      )}
    </div>
  );
}
