import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createComplaint } from "../services/api";
import "./ComplaintForm.css";

/**
 * ComplaintForm Component
 * Allows students to submit new campus maintenance complaints.
 * Includes client-side validation and direct integration with the Express API.
 */
export default function ComplaintForm({ onSuccess, onCancel }) {
  const navigate = useNavigate();

  // Initial form values
  const initialFormState = {
    title: "",
    category: "",
    location: "",
    description: ""
  };

  // State management
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submittedComplaint, setSubmittedComplaint] = useState(null);

  // Available campus maintenance categories
  const categories = [
    "Electrical",
    "Plumbing",
    "Carpentry & Furniture",
    "Internet & Wi-Fi",
    "Housekeeping & Cleanliness",
    "Air Conditioning",
    "Other"
  ];

  /**
   * Validates form inputs and returns an errors object
   */
  const validateForm = () => {
    const newErrors = {};

    // Validate Title
    if (!formData.title.trim()) {
      newErrors.title = "Complaint title is required.";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters long.";
    } else if (formData.title.trim().length > 100) {
      newErrors.title = "Title must be less than 100 characters.";
    }

    // Validate Category
    if (!formData.category || formData.category === "") {
      newErrors.category = "Please select a maintenance category.";
    }

    // Validate Location
    if (!formData.location.trim()) {
      newErrors.location = "Campus location or room number is required.";
    } else if (formData.location.trim().length < 3) {
      newErrors.location = "Please enter a specific location (at least 3 characters).";
    }

    // Validate Description
    if (!formData.description.trim()) {
      newErrors.description = "A detailed description of the issue is required.";
    } else if (formData.description.trim().length < 15) {
      newErrors.description = "Please describe the issue in more detail (at least 15 characters).";
    }

    return newErrors;
  };

  /**
   * Handles input changes and clears error for the changed field
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field as the user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }

    // Clear server error banner once user starts modifying
    if (serverError) {
      setServerError("");
    }
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run client-side validation
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setServerError("");
    setIsSubmitting(true);

    try {
      // Send complaint to backend Express server via existing api service
      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        location: formData.location.trim(),
        description: formData.description.trim()
      };

      const result = await createComplaint(payload);

      // Save returned complaint to show confirmation card
      setSubmittedComplaint(result.complaint || payload);
      setFormData(initialFormState);

      // Trigger optional callback for parent component
      if (onSuccess) {
        onSuccess(result.complaint);
      }
    } catch (err) {
      setServerError(
        err.message || "Failed to submit complaint. Please check server connection."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Resets form to clean initial state
   */
  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
    setServerError("");
  };

  /**
   * Navigates back or resets to file another complaint
   */
  const handleFileAnother = () => {
    setSubmittedComplaint(null);
    handleReset();
  };

  const handleGoToDashboard = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <main className="main-content" id="submit-complaint">
      {/* Header section matching existing StudentDashboard layout */}
      <header className="page-header">
        <div>
          <h1>Submit Complaint</h1>
          <p>Report campus maintenance issues to the administration team.</p>
        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={handleGoToDashboard}
        >
          View Dashboard
        </button>
      </header>

      {/* Success Confirmation Card */}
      {submittedComplaint ? (
        <section className="submission-success-card">
          <div className="success-badge-icon" aria-hidden="true">✓</div>
          <h2>Complaint Submitted Successfully!</h2>
          <p>
            Your issue has been logged into the system and assigned to campus maintenance staff.
          </p>

          <div className="success-details-box">
            {submittedComplaint.id && (
              <p>
                <strong>Complaint Reference ID:</strong>{" "}
                <span className="success-id-highlight">{submittedComplaint.id}</span>
              </p>
            )}
            <p>
              <strong>Status:</strong>{" "}
              {submittedComplaint.status || "Pending"}
            </p>
            <p>
              <strong>Title:</strong> {submittedComplaint.title}
            </p>
            <p>
              <strong>Category:</strong> {submittedComplaint.category}
            </p>
            <p>
              <strong>Location:</strong> {submittedComplaint.location}
            </p>
          </div>

          <div className="form-actions" style={{ justifyContent: "center" }}>
            <button
              type="button"
              className="btn-primary"
              onClick={handleFileAnother}
            >
              Submit Another Complaint
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleGoToDashboard}
            >
              Go to Dashboard
            </button>
          </div>
        </section>
      ) : (
        /* Complaint Submission Form Card */
        <section className="complaint-form-card">
          <div className="form-card-header">
            <h2>Complaint Details</h2>
            <p>Please fill in all required fields accurately to ensure fast resolution.</p>
          </div>

          {/* Helpful tips box */}
          <div className="form-info-tip">
            <strong>Campus Maintenance Tip:</strong> Specify exact room numbers, floor levels,
            or laboratory names (e.g., "Block B, Room 204") so the maintenance staff can find and fix
            the issue promptly.
          </div>

          {/* Server Error Alert */}
          {serverError && (
            <div className="server-error-banner" role="alert">
              <strong>Error:</strong> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="complaint-form" noValidate>
            {/* Title Field */}
            <div className={`form-group ${errors.title ? "has-error" : ""}`}>
              <label htmlFor="title">
                Complaint Title <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="e.g., Leaking water pipe in 2nd floor restroom"
                value={formData.title}
                onChange={handleChange}
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "title-error" : undefined}
                disabled={isSubmitting}
              />
              {errors.title && (
                <span className="field-error" id="title-error">
                  {errors.title}
                </span>
              )}
            </div>

            {/* 2-Column Row for Category and Location */}
            <div className="form-row">
              {/* Category Field */}
              <div className={`form-group ${errors.category ? "has-error" : ""}`}>
                <label htmlFor="category">
                  Category <span className="required-star">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  aria-invalid={!!errors.category}
                  aria-describedby={errors.category ? "category-error" : undefined}
                  disabled={isSubmitting}
                >
                  <option value="">Select a category...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <span className="field-error" id="category-error">
                    {errors.category}
                  </span>
                )}
              </div>

              {/* Location Field */}
              <div className={`form-group ${errors.location ? "has-error" : ""}`}>
                <label htmlFor="location">
                  Location / Room <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="e.g., Hostel Block B, Room 302"
                  value={formData.location}
                  onChange={handleChange}
                  aria-invalid={!!errors.location}
                  aria-describedby={errors.location ? "location-error" : undefined}
                  disabled={isSubmitting}
                />
                {errors.location && (
                  <span className="field-error" id="location-error">
                    {errors.location}
                  </span>
                )}
              </div>
            </div>

            {/* Description Field */}
            <div className={`form-group ${errors.description ? "has-error" : ""}`}>
              <label htmlFor="description">
                Detailed Description <span className="required-star">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows="5"
                placeholder="Describe the problem in detail (e.g., when did it start, severity, specific fixture or equipment affected)..."
                value={formData.description}
                onChange={handleChange}
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? "description-error" : undefined}
                disabled={isSubmitting}
              />
              {errors.description ? (
                <span className="field-error" id="description-error">
                  {errors.description}
                </span>
              ) : (
                <span className="field-hint">
                  {formData.description.length} characters (minimum 15 recommended)
                </span>
              )}
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting Complaint..." : "Submit Complaint"}
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Clear Form
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={handleGoToDashboard}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
    </main>
  );
}
