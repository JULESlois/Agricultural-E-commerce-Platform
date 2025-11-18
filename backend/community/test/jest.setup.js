// Jest 测试设置文件
const { sequelize } = require('../models');

// 测试前设置
beforeAll(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ 测试数据库连接成功');
  } catch (error) {
    console.error('❌ 测试数据库连接失败:', error);
    process.exit(1);
  }
});

// 测试后清理
afterAll(async () => {
  await sequelize.close();
  console.log('✅ 测试数据库连接已关闭');
});

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
