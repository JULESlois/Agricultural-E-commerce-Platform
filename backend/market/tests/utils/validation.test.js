const { validatePhone, validateEmail, validateIdCard } = require('../../utils/validation');

describe('Validation Utils', () => {
  describe('validatePhone', () => {
    it('应该验证有效手机号', () => {
      expect(validatePhone('13800138000')).toBe(true);
      expect(validatePhone('15912345678')).toBe(true);
      expect(validatePhone('18888888888')).toBe(true);
    });

    it('应该拒绝无效手机号', () => {
      expect(validatePhone('12345678901')).toBe(false);
      expect(validatePhone('1380013800')).toBe(false);
      expect(validatePhone('138001380000')).toBe(false);
      expect(validatePhone('abc')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('应该验证有效邮箱', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('应该拒绝无效邮箱', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('validateIdCard', () => {
    it('应该验证有效身份证号', () => {
      expect(validateIdCard('123456789012345678')).toBe(true);
      expect(validateIdCard('12345678901234567X')).toBe(true);
    });

    it('应该拒绝无效身份证号', () => {
      expect(validateIdCard('12345')).toBe(false);
      expect(validateIdCard('1234567890123456789')).toBe(false);
      expect(validateIdCard('abc')).toBe(false);
    });
  });
});