exports.successResponse = (res, statusCode, message, data = null) => {
    const response = {
        code: statusCode,
        message: message
    };
    if (data !== null) {
        response.data = data;
    }
    return res.status(statusCode).json(response);
};

exports.errorResponse = (res, statusCode, message, error = null) => {
    const response = {
        code: statusCode,
        message: message
    };
    if (error) {
        response.error = error;
    }
    return res.status(statusCode).json(response);
};