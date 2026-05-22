/**
 * Send a standardized success response.
 * @param {import('express').Response} res
 * @param {*} data
 * @param {string} message
 * @param {number} statusCode
 */
export function sendSuccess(res, data, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}

/**
 * Send a standardized error response.
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} statusCode
 * @param {Array} errors
 */
export function sendError(res, message = 'Something went wrong', statusCode = 400, errors = []) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}
