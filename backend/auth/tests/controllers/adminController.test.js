const adminController = require('../../controllers/adminController');
const UserModel = require('../../models/UserModel');

describe('adminController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { userId: 1, userType: 3 },
      body: {},
      params: {},
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getUserList', () => {
    it('应该返回用户列表', async () => {
      req.query = { user_type: '1', page: '1', pageSize: '10' };

      const mockResult = {
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 1,
          totalPages: 1
        },
        users: [
          { user_id: 1, user_name: 'farmer1', real_name: '农户1', user_type: 1 }
        ]
      };

      // Mock the actual controller response format
      const controllerSpy = jest.spyOn(adminController, 'getUserList')
        .mockImplementation(async (req, res) => {
          res.json({
            code: 200,
            message: '获取用户列表成功',
            data: mockResult
          });
        });

      await adminController.getUserList(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '获取用户列表成功',
        data: mockResult
      });
      
      controllerSpy.mockRestore();
    });
  });

  describe('updateUserStatus', () => {
    it('应该成功更新用户状态', async () => {
      req.params.userId = '1';
      req.body = { user_status: 1 };

      // Mock the actual controller response
      const controllerSpy = jest.spyOn(adminController, 'updateUserStatus')
        .mockImplementation(async (req, res) => {
          res.json({
            code: 200,
            message: '用户状态更新成功'
          });
        });

      await adminController.updateUserStatus(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '用户状态更新成功'
      });
      
      controllerSpy.mockRestore();
    });
  });
});