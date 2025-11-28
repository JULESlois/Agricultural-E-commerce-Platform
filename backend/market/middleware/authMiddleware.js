const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const IS_DEV = process.env.NODE_ENV !== 'production';

function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // 开发环境：使用测试用户
      if (IS_DEV) {
        console.log('开发模式：使用测试用户');
        req.user = { 
          userId: 1, 
          userType: 2, 
          phone: '13900001111',
          user_id: 1,
          user_type: 2
        };
        return next();
      }
      
      return res.status(401).json({
        code: 401,
        message: '未提供有效的访问令牌'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 统一字段名
    req.user = {
      ...decoded,
      userId: decoded.user_id || decoded.userId,
      userType: decoded.user_type || decoded.userType
    };
    
    next();
  } catch (err) {
    // 开发环境：token无效时使用测试用户
    if (IS_DEV) {
      console.log('开发模式：token无效，使用测试用户');
      req.user = { 
        userId: 1, 
        userType: 2, 
        phone: '13900001111',
        user_id: 1,
        user_type: 2
      };
      return next();
    }
    
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

module.exports = {
  verifyToken
};