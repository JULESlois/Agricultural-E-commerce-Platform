const { encrypt, decrypt, hashPassword, verifyPassword } = require('../../utils/crypto');

describe('Crypto Utils', () => {
  describe('encrypt/decrypt', () => {
    it('应该正确加密和解密数据', () => {
      const originalText = '6228480388888888888';
      const encrypted = encrypt(originalText);
      const decrypted = decrypt(encrypted);

      expect(encrypted).not.toBe(originalText);
      expect(decrypted).toBe(originalText);
    });

    it('应该处理空字符串', () => {
      const encrypted = encrypt('');
      const decrypted = decrypt(encrypted);

      expect(decrypted).toBe('');
    });
  });

  describe('hashPassword/verifyPassword', () => {
    it('应该正确哈希和验证密码', async () => {
      const password = 'testPassword123';
      const hashed = await hashPassword(password);
      const isValid = await verifyPassword(password, hashed);

      expect(hashed).not.toBe(password);
      expect(isValid).toBe(true);
    });

    it('应该拒绝错误的密码', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword';
      const hashed = await hashPassword(password);
      const isValid = await verifyPassword(wrongPassword, hashed);

      expect(isValid).toBe(false);
    });
  });
});