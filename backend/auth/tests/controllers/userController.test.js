const userController = require('../../controllers/userController');
const UserModel = require('../../models/userModel');

describe('userController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { userId: 1, userType: 1 },
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('应该返回用户资料', async () => {
      const mockUser = {
        user_id: 1,
        user_name: 'testuser',
        real_name: '测试用户',
        user_type: 1,
        phone: '138****8000',
        email: 'test@example.com'
      };

      UserModel.findById.mockResolvedValue(mockUser);

      await userController.getProfile(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '获取用户信息成功',
        data: mockUser
      });
    });
  });

  describe('updateProfile', () => {
    it('应该成功更新用户资料', async () => {
      req.body = {
        real_name: '新名字',
        email: 'new@example.com'
      };

      UserModel.update.mockResolvedValue({ user_id: 1 });

      await userController.updateProfile(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '用户信息更新成功'
      });
    });
  });
});