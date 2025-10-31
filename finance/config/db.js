const { Sequelize } = require('sequelize');
require('dotenv').config();

// 初始化 Sequelize 实例（连接 PostgreSQL）
const sequelize = new Sequelize(
  process.env.DB_NAME || 'agri',          // 数据库名称
  process.env.DB_USER || 'agri_root',     // 数据库用户
  process.env.DB_PASSWORD || 'agri_root', // 数据库密码
  {
    host: process.env.DB_HOST || '82.157.154.143', // 数据库主机
    port: process.env.DB_PORT || 5432,              // 数据库端口
    dialect: 'postgres',                            // 数据库类型（PostgreSQL）
    logging: false,                                 // 关闭 SQL 日志（生产环境建议关闭）
    pool: {
      max: 5,    // 连接池最大连接数
      min: 0,    // 最小连接数
      idle: 10000// 空闲连接超时时间（毫秒）
    }
  }
);

// 测试数据库连接
const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL 数据库连接成功！');
  } catch (error) {
    console.error('数据库连接失败：', error.message);
    process.exit(1); // 连接失败时退出进程
  }
};

testDbConnection();

module.exports = sequelize;