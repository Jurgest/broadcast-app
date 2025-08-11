export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Default error
  let error = {
    message: err.message || "Internal Server Error",
    status: err.status || 500,
  };

  // Validation errors
  if (err.name === "ValidationError") {
    error.status = 400;
    error.message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error.status = 401;
    error.message = "Invalid token";
  }

  // Duplicate key error
  if (err.code === 11000) {
    error.status = 400;
    error.message = "Resource already exists";
  }

  // Cast error
  if (err.name === "CastError") {
    error.status = 400;
    error.message = "Invalid ID format";
  }

  res.status(error.status).json({
    success: false,
    error: error.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
