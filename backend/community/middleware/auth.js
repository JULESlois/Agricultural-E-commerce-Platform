const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        code: 401,
        message: '未授权访问',
        error: '缺少或无效的认证令牌'
      });
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret);
    
    req.user = {
      user_id: decoded.user_id || decoded.userId || decoded.id,
      user_type: decoded.user_type || decoded.userType,
      user_name: decoded.user_name || decoded.userName
    };
    
    next();
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: '认证失败',
      error: error.message
    });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.user_type !== 0) {
    return res.status(403).json({
      code: 403,
      message: '权限不足',
      error: '需要管理员权限'
    });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
