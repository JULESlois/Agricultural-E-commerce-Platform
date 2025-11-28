const crypto = require('crypto');

// 加密密钥 - 实际项目中应该从环境变量获取
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-secret-key-here!!';
const ALGORITHM = 'aes-256-cbc';

// 确保密钥长度为32字节
const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);

/**
 * AES-256 加密
 * @param {string} text 要加密的文本
 * @returns {string} 加密后的文本
 */
function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * AES-256 解密
 * @param {string} encryptedText 加密的文本
 * @returns {string} 解密后的文本
 */
function decrypt(encryptedText) {
  const textParts = encryptedText.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encrypted = textParts.join(':');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = {
  encrypt,
  decrypt
};