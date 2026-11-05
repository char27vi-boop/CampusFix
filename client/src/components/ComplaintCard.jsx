function ComplaintCard({ complaint }) {
  const statusSlug = (complaint.status || "pending").toLowerCase().replace(/\s+/g, "-");
  const prioritySlug = (complaint.priority || "medium").toLowerCase();

  return (
    <div className="complaint-card">
      <div className="complaint-top">
        <div>
          <p className="complaint-id">{complaint.id}</p>
          <h3>{complaint.title}</h3>
        </div>
        <div className={`status status-badge status-${statusSlug}`}>
          {complaint.status || "Pending"}
        </div>
      </div>

      <p className="complaint-description">
        {complaint.description}
      </p>

      <div className="complaint-details">
        <p>
          <strong>Category:</strong> {complaint.category}
        </p>
        <p>
          <strong>Location:</strong> {complaint.location}
        </p>
        <p>
          <strong>Priority:</strong>{" "}
          <span className={`priority-badge priority-${prioritySlug}`}>
            {complaint.priority || "Medium"}
          </span>
        </p>
      </div>
      <div className="complaint-footer">
        <p>Reported: {complaint.date}</p>
      </div>
    </div>
  );
}

export default ComplaintCard;
