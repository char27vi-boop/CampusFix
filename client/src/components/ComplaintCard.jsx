
function ComplaintCard({ complaint }) {
  return (
    <div className="complaint-card">
      <div className="complaint-top">
        <div>
          <p className="complaint-id">{complaint.id}</p>
          <h3>{complaint.title}</h3>
        </div>
        <div className="status">
          {complaint.status}
        </div>
      </div>

      <p className="complaint-description">
        {complaint.description}
      </p>

      <div className="complaint-details">
        <p>Category: {complaint.category}</p>
        <p>Location: {complaint.location}</p>
        <p>Priority: {complaint.priority}</p>
      </div>
      <div className="complaint-footer">
        <p>Reported: {complaint.date}</p>
      </div>

    </div>
  );
}

export default ComplaintCard;
