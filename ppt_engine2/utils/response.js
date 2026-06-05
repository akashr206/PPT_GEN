/**
 * Centralized HTTP Response helper utility for maintaining uniform API response structures.
 * Provides consistent formatting for success and error payloads.
 */

/**
 * Sends a successful response.
 * 
 * @param {Object} res - Express response object
 * @param {any} data - The payload to be returned in the response
 * @param {string} message - A developer/user-friendly success message
 * @param {number} statusCode - HTTP status code (default: 200)
 * @returns {Object} Express JSON response
 */
export const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

/**
 * Sends an error response.
 * 
 * @param {Object} res - Express response object
 * @param {string} message - A developer/user-friendly error message description
 * @param {any} error - The detailed error object, message, or stack trace
 * @param {number} statusCode - HTTP status code (default: 500)
 * @returns {Object} Express JSON response
 */
export const sendError = (res, message = 'An error occurred', error = null, statusCode = 500) => {
    // Extract message if it's an Error instance
    const errorDetails = error instanceof Error ? error.message : error;
    console.log(errorDetails);
    return res.status(statusCode).json({
        success: false,
        message,
    });
};
