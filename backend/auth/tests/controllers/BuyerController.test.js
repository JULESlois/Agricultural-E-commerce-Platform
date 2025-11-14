const BuyerController = require('../../controllers/BuyerController');
const BuyerModel = require('../../models/BuyerModel');

describe('BuyerController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { userId: 1, userType: 2 },
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
    it('应该成功更新买家信息', async () => {
      req.body = {
        buyer_type: 2,
        company_name: '美味果蔬超市',
        company_address: '河南省郑州市金水区农业路1号',
        taxpayer_id: '91410100MA12345678',
        purchase_scope: '小麦,生鲜蔬菜',
        monthly_purchase: 50000.00,
        preferred_payment: 1,
        preferred_logistics: '顺丰,德邦'
      };

      BuyerModel.createOrUpdate.mockResolvedValue({
        buyer_id: 1,
        user_id: 1,
        company_name: '美味果蔬超市',
        update_time: '2025-10-26T16:10:00Z'
      });

      await BuyerController.updateMe(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '买家信息更新成功。',
        data: expect.objectContaining({
          buyer_id: 1,
          company_name: '美味果蔬超市'
        })
      });
    });

    it('应该拒绝非买家用户的请求', async () => {
      req.user.userType = 1;

      await BuyerController.updateMe(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        code: 403,
        message: '操作失败。',
        error: '只有买家用户才能更新此信息。'
      });
    });

    it('应该验证企业买家必填字段', async () => {
      req.body = {
        buyer_type: 2,
        purchase_scope: '小麦'
      };

      await BuyerController.updateMe(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 400,
        message: '更新失败。',
        error: '企业买家必须提供企业名称和纳税人识别号。'
      });
    });
  });

  describe('getBuyerInfo', () => {
    it('应该返回买家信息', async () => {
      req.params.user_id = '1';

      const mockBuyer = {
        buyer_id: 1,
        user_id: 1,
        company_name: '美味果蔬超市',
        purchase_scope: '小麦,生鲜蔬菜'
      };

      BuyerModel.findByUserId.mockResolvedValue(mockBuyer);

      await BuyerController.getBuyerInfo(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '获取买家信息成功。',
        data: mockBuyer
      });
    });

    it('应该处理买家不存在的情况', async () => {
      req.params.user_id = '999';

      BuyerModel.findByUserId.mockResolvedValue(null);

      await BuyerController.getBuyerInfo(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});