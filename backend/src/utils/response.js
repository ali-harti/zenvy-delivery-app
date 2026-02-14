/**
 * Standardized success response
 */
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

/**
 * Standardized error response
 */
const errorResponse = (res, message = 'Error', statusCode = 500, errors = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        ...(errors && { errors })
    });
};

/**
 * Validation error response
 */
const validationErrorResponse = (res, errors) => {
    return res.status(422).json({
        success: false,
        message: 'Validation error',
        errors
    });
};

module.exports = {
    successResponse,
    errorResponse,
    validationErrorResponse
};
