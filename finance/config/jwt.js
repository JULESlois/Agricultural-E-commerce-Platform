// 从环境变量中读取 JWT 配置，无环境变量时使用默认值
require('dotenv').config();

module.exports = {
  // JWT 签名密钥（需与 .env 中的 JWT_SECRET 一致，API 文档中鉴权依赖此密钥验证 Token）
  JWT_SECRET: process.env.JWT_SECRET || 'agri_finance_jwt_secret_2025',
  // Token 有效期（秒），与 .env 中的 JWT_EXPIRES_IN 一致
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || 86400
};