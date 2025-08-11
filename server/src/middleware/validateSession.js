import { validationResult } from "express-validator";

export const validateSession = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors.array(),
    });
  }

  next();
};

export const validateRequired = (fields) => (req, res, next) => {
  const missing = fields.filter((field) => !req.body[field]);

  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      error: `Missing required fields: ${missing.join(", ")}`,
    });
  }

  next();
};
