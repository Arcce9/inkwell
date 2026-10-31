export function errorHandler(err, req, res, next) {
  // A05's fix: Never expose stack traces or internal error
  // details to clients in production.
  // Log errors internally instead (A09, Section 5.6).
  console.error(err);

  const isProd = process.env.NODE_ENV === "production";

  res.status(err.status || 500).json({
    error: {
      code: err.code || "INTERNAL_ERROR",
      message: isProd
        ? "Something went wrong."
        : err.message,
    },
  });
}