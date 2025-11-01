const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 验证JWT Token
function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        code: 401,
        message: '未提供有效的访问令牌'
      });
    }

    const token = authHeader.substring(7); // 移除 "Bearer " 前缀
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId: 1001, userType: 1 }
    
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        code: 401,
        message: '访问令牌已过期'
      });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        code: 401,
        message: '无效的访问令牌'
      });
    } else {
      return res.status(401).json({
        code: 401,
        message: '令牌验证失败'
      });
    }
  }
}

// 检查管理员权限
function isAdmin(req, res, next) {
  try {
    if (req.user.userType !== 3) {
      return res.status(403).json({
        code: 403,
        message: '权限不足，需要管理员权限'
      });
    }
    
    next();
  } catch (err) {
    console.error('权限验证失败:', err);
    return res.status(403).json({
      code: 403,
      message: '权限验证失败'
    });
  }
}

module.exports = {
  verifyToken,
  isAdmin
};