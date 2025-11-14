const FarmerController = require('../../controllers/FarmerController');
const FarmerModel = require('../../models/FarmerModel');

describe('FarmerController', () => {
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

  describe('updateMe', () => {
    it('应该成功更新农户信息', async () => {
      req.body = {
        farm_name: '张三的有机农场',
        contact_person: '张三妻',
        contact_phone: '13800138001',
        bank_card_no: '6228480388888888888',
        bank_name: '中国农业银行郑州中牟支行'
      };

      FarmerModel.createOrUpdate.mockResolvedValue({
        farmer_id: 1,
        user_id: 1,
        farm_name: '张三的有机农场',
        update_time: '2025-10-26T16:00:00Z'
      });

      await FarmerController.updateMe(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '农户信息更新成功。',
        data: expect.objectContaining({
          farmer_id: 1,
          farm_name: '张三的有机农场'
        })
      });
    });

    it('应该拒绝非农户用户的请求', async () => {
      req.user.userType = 2;

      await FarmerController.updateMe(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('getFarmerInfo', () => {
    it('应该返回农户信息', async () => {
      req.params.user_id = '1';

      const mockFarmer = {
        user_id: 1,
        farm_name: '张三的有机农场'
      };

      FarmerModel.findByUserId.mockResolvedValue(mockFarmer);

      await FarmerController.getFarmerInfo(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '获取农户信息成功。',
        data: mockFarmer
      });
    });
  });
});