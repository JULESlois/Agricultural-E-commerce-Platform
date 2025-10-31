const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/jwt');

// 鉴权函数（参数：用户类型，如 'farmer'/'bank'）
const auth = (userType) => {
  return async (req, res, next) => {
    try {
      // 1. 获取请求头中的 Token
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          code: 401,
          message: '未授权访问，请携带有效的 Token'
        });
      }
      const token = authHeader.split(' ')[1]; // 提取 Token 部分

      // 2. 验证 Token 有效性
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // 3. 验证用户类型（如银行接口仅允许银行用户访问）
      if (decoded.userType !== userType) {
        return res.status(403).json({
          code: 403,
          message: '权限不足，当前用户类型无法访问此接口'
        });
      }

      // 4. 将用户信息挂载到 req 对象（供后续接口使用）
      req.user = {
        userId: decoded.userId,
        username: decoded.username,
        userType: decoded.userType
      };
      next(); // 鉴权通过，进入控制器
    } catch (error) {
      // 处理 Token 错误（过期/无效）
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ code: 401, message: 'Token 已过期，请重新登录' });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ code: 401, message: '无效的 Token' });
      }
      return res.status(500).json({ code: 500, message: '鉴权过程异常：' + error.message });
    }
  };
};

module.exports = { auth };