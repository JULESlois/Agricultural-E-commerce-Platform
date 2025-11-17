// Jest 简化测试设置文件（不需要数据库连接）

// 全局测试配置
global.console = {
  ...console,
  // 在测试中静默一些日志
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: console.warn,
  error: console.error,
};

// Mock 数据库连接（用于不需要真实数据库的单元测试）
jest.mock('../models', () => {
  const mockSequelize = {
    authenticate: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true),
    transaction: jest.fn(() => ({
      commit: jest.fn(),
      rollback: jest.fn()
    }))
  };

  return {
    sequelize: mockSequelize,
    Content: {
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
      rawAttributes: {},
      associations: {}
    },
    Category: {
      findAll: jest.fn(),
      findByPk: jest.fn(),
      rawAttributes: {},
      associations: {}
    },
    Comment: {
      findAll: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
      rawAttributes: {},
      associations: {}
    },
    Like: {
      findOne: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn(),
      count: jest.fn()
    },
    Collect: {
      findOne: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn()
    },
    Follow: {
      findOne: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn()
    },
    Tag: {
      findAll: jest.fn(),
      rawAttributes: {},
      associations: {}
    },
    ContentTag: {},
    QARelation: {
      findAll: jest.fn(),
      rawAttributes: {},
      associations: {}
    },
    Report: {
      findAll: jest.fn(),
      rawAttributes: {},
      associations: {}
    },
    Violation: {
      rawAttributes: {},
      associations: {}
    },
    Blacklist: {
      findAll: jest.fn()
    }
  };
});
