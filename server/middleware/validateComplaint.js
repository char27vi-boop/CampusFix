const validateComplaint = (req, res, next) => {

    const { title, description, category, location } = req.body;

    const errors = [];

    // Check title
    if (!title || typeof title !== "string" || !title.trim()) {
        errors.push("Title is required.");
    }

    // Check description
    if (
        !description ||
        typeof description !== "string" ||
        !description.trim()
    ) {
        errors.push("Description is required.");
    }

    // Check category
    if (!category || typeof category !== "string" || !category.trim()) {
        errors.push("Category is required.");
    }

    // Check location
    if (!location || typeof location !== "string" || !location.trim()) {
        errors.push("Location is required.");
    }

    // If validation errors exist
    if (errors.length > 0) {
        return res.status(400).json({
            message: "Validation failed",
            errors
        });
    }

    // If everything is valid, continue
    next();
};

module.exports = validateComplaint;