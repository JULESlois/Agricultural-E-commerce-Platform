const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 验证用户令牌
exports.authenticateUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return errorResponse(res, 401, '未提供认证令牌');
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return errorResponse(res, 401, '无效或过期的令牌');
    }
};

// 验证专家令牌
exports.authenticateExpert = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return errorResponse(res, 401, '未提供认证令牌');
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'expert') {
            return errorResponse(res, 403, '权限不足，需要专家身份');
        }
        req.expert = decoded;
        next();
    } catch (error) {
        return errorResponse(res, 401, '无效或过期的令牌');
    }
};

// 验证客服令牌
exports.authenticateCS = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return errorResponse(res, 401, '未提供认证令牌');
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'customer_service') {
            return errorResponse(res, 403, '权限不足，需要客服身份');
        }
        req.cs = decoded;
        next();
    } catch (error) {
        return errorResponse(res, 401, '无效或过期的令牌');
    }
};

// 验证管理员令牌
exports.authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return errorResponse(res, 401, '未提供认证令牌');
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') {
            return errorResponse(res, 403, '权限不足，需要管理员身份');
        }
        req.admin = decoded;
        next();
    } catch (error) {
        return errorResponse(res, 401, '无效或过期的令牌');
    }
};