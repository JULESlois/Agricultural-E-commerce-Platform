// Jest测试设置文件
process.env.NODE_ENV = 'test';

// 全局mock数据库
jest.mock('../database', () => {
  const mockClient = {
    query: jest.fn(),
    release: jest.fn()
  };
  
  return {
    pool: {
      connect: jest.fn().mockResolvedValue(mockClient),
      query: jest.fn()
    },
    testConnection: jest.fn()
  };
});

// 全局mock认证中间件
jest.mock('../middleware/authMiddleware', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { userId: 1, userType: 1, user_id: 1, user_type: 1 }; // 兼容两种命名
    next();
  },
  requireRole: (roles) => (req, res, next) => {
    const userType = req.user.userType || req.user.user_type;
    if (roles.includes(userType)) {
      next();
    } else {
      res.status(403).json({ message: '权限不足' });
    }
  }
}));

// 全局beforeEach清理
beforeEach(() => {
  jest.clearAllMocks();
});