const success = (res, code, message, data = null) => {
    res.status(code).json({
        code,
        message,
        data,
    });
};

const fail = (res, code, message, error = null) => {
    res.status(code).json({
        code,
        message,
        error,
    });
};

module.exports = { success, fail };