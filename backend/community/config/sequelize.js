const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// 尝试加载 .env 文件
require('dotenv').config();

// 如果 .env 不存在，尝试从 dbconfig.json 读取
let dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
};

// 如果环境变量不存在，尝试读取 dbconfig.json
if (!dbConfig.host) {
  try {
    const configPath = path.join(__dirname, '../dbconfig.json');
    if (fs.existsSync(configPath)) {
      const jsonConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      dbConfig = {
        host: jsonConfig.host,
        port: jsonConfig.port,
        database: jsonConfig.db,
        user: jsonConfig.user,
        password: jsonConfig.password
      };
      console.log('📋 从 dbconfig.json 读取数据库配置');
    }
  } catch (error) {
    console.warn('⚠️ 无法读取 dbconfig.json:', error.message);
  }
}

// 创建 Sequelize 实例
const sequelize = new Sequelize(
  dbConfig.database || 'agri',
  dbConfig.user || 'agri_root',
  dbConfig.password || 'agri_root',
  {
    host: dbConfig.host || '82.157.154.143',
    port: dbConfig.port || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: false, // 默认不使用 Sequelize 的时间戳
      freezeTableName: true // 禁止表名复数化
    }
  }
);

// 测试数据库连接
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL 数据库连接成功（Sequelize）');
    console.log(`📊 数据库: ${dbConfig.database} @ ${dbConfig.host}:${dbConfig.port}`);
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    console.error('📋 当前配置:', {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user
    });
    // 不要退出进程，让调用者处理错误
  }
};

testConnection();

module.exports = sequelize;