import { sendError } from '../utils/response.js';

/**
 * Global error-handling middleware.
 * Must have 4 parameters so Express recognises it as an error handler.
 */
export function errorHandler(err, _req, res, _next) {
  console.error('Unhandled error:', err);

  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error';

  return sendError(res, message, 500);
}
