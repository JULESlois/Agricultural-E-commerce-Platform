const { validatePhone, validateEmail, validateIdCard } = require('../../utils/validation');

describe('Auth Validation Utils', () => {
  describe('validatePhone', () => {
    it('应该验证有效手机号', () => {
      expect(validatePhone('13800138000')).toBe(true);
      expect(validatePhone('15912345678')).toBe(true);
    });

    it('应该拒绝无效手机号', () => {
      expect(validatePhone('12345678901')).toBe(false);
      expect(validatePhone('abc')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('应该验证有效邮箱', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    it('应该拒绝无效邮箱', () => {
      expect(validateEmail('invalid-email')).toBe(false);
    });
  });

  describe('validateIdCard', () => {
    it('应该验证有效身份证号', () => {
      expect(validateIdCard('123456789012345678')).toBe(true);
    });

    it('应该拒绝无效身份证号', () => {
      expect(validateIdCard('12345')).toBe(false);
    });
  });
});