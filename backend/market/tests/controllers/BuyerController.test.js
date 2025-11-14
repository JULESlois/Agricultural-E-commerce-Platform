const BuyerController = require('../../controllers/BuyerController');
const BuyerModel = require('../../models/BuyerModel');

jest.mock('../../models/BuyerModel');

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
        taxpayer_id: '91110000123456789X',
        purchase_scope: '小麦,生鲜蔬菜'
      };

      BuyerModel.createOrUpdate.mockResolvedValue({
        buyer_id: 1,
        user_id: 1,
        company_name: '美味果蔬超市'
      });

      await BuyerController.updateMe(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '买家信息更新成功。',
        data: expect.objectContaining({
          buyer_id: 1
        })
      });
    });

    it('应该拒绝非买家用户', async () => {
      req.user.userType = 1;

      await BuyerController.updateMe(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('getBuyerInfo', () => {
    it('应该返回买家信息', async () => {
      req.params.user_id = '1';

      BuyerModel.findByUserId.mockResolvedValue({
        buyer_id: 1,
        company_name: '美味果蔬超市'
      });

      await BuyerController.getBuyerInfo(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '获取买家信息成功。',
        data: expect.objectContaining({
          buyer_id: 1
        })
      });
    });
  });
});