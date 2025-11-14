const UserModel = require('../../models/userModel');

// 模拟数据库连接
jest.mock('../database', () => ({
  pool: {
    query: jest.fn()
  }
}));

const { pool } = require('../database');

describe('UserModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('应该创建新用户', async () => {
      const userData = {
        user_name: 'testuser',
        password: 'hashedPassword',
        real_name: '测试用户',
        user_type: 1,
        id_card: 'encrypted_id_card',
        phone: '13800138000',
        email: 'test@example.com'
      };

      const mockResult = {
        rows: [{
          user_id: 1,
          user_name: 'testuser',
          real_name: '测试用户',
          user_type: 1,
          phone: '13800138000',
          email: 'test@example.com',
          user_status: 2,
          cert_status: 0
        }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await UserModel.create(userData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO sys_user'),
        expect.arrayContaining([
          'testuser', 'hashedPassword', '测试用户', 1, 'encrypted_id_card', '13800138000', 'test@example.com', 2, 0
        ])
      );
      expect(result).toEqual(mockResult.rows[0]);
    });
  });

  describe('findByIdentifier', () => {
    it('应该根据用户名或手机号查找用户', async () => {
      const mockResult = {
        rows: [{
          user_id: 1,
          user_name: 'testuser',
          password: 'hashedPassword',
          real_name: '测试用户',
          user_type: 1,
          phone: '13800138000',
          user_status: 1,
          cert_status: 0
        }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await UserModel.findByIdentifier('testuser');

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE user_name = $1 OR phone = $1'),
        ['testuser']
      );
      expect(result).toEqual(mockResult.rows[0]);
    });
  });

  describe('findById', () => {
    it('应该根据用户ID查找用户', async () => {
      const mockResult = {
        rows: [{
          user_id: 1,
          user_name: 'testuser',
          real_name: '测试用户',
          user_type: 1,
          phone: '138****7000',
          email: 'test@example.com',
          user_status: 1,
          cert_status: 0
        }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await UserModel.findById(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE user_id = $1'),
        [1]
      );
      expect(result).toEqual(mockResult.rows[0]);
    });
  });

  describe('checkExists', () => {
    it('应该检查用户是否存在', async () => {
      pool.query.mockResolvedValue({ rows: [{ user_id: 1 }] });

      const result = await UserModel.checkExists('user_name', 'testuser');

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT user_id FROM sys_user WHERE user_name = $1',
        ['testuser']
      );
      expect(result).toBe(true);
    });

    it('应该返回false当用户不存在时', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await UserModel.checkExists('user_name', 'nonexistent');

      expect(result).toBe(false);
    });
  });

  describe('update', () => {
    it('应该更新用户信息', async () => {
      const updates = {
        real_name: '新名字',
        email: 'new@example.com'
      };

      pool.query.mockResolvedValue({ rows: [{ user_id: 1 }] });

      const result = await UserModel.update(1, updates);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE sys_user SET'),
        expect.arrayContaining(['新名字', 'new@example.com', 1])
      );
      expect(result).toEqual({ user_id: 1 });
    });
  });
});