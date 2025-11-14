const AftersaleController = require('../../controllers/AftersaleController');
const AftersaleModel = require('../../models/AftersaleModel');

jest.mock('../../models/AftersaleModel');

describe('AftersaleController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { userId: 1, userType: 2 },
      params: {},
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('applyAftersale', () => {
    it('应该成功申请售后', async () => {
      req.params.order_id = 'ORD20251110000001';
      req.body = {
        aftersale_type: 1,
        apply_amount: 500.00,
        reason: '部分小麦有发霉迹象',
        proof_images: '["https://proof1.jpg"]'
      };

      AftersaleModel.create.mockResolvedValue({ aftersale_id: 601 });

      await AftersaleController.applyAftersale(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        code: 201,
        message: '售后申请已提交，等待平台审核。',
        data: { aftersale_id: 601 }
      });
    });
  });

  describe('reviewAftersale', () => {
    it('应该成功审核售后申请', async () => {
      req.user.userType = 3; // 管理员
      req.params.aftersale_id = '601';
      req.body = {
        audit_status: 1,
        audit_remark: '情况属实，同意退款申请。'
      };

      AftersaleModel.review.mockResolvedValue({ aftersale_id: 601 });

      await AftersaleController.reviewAftersale(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '售后审核操作成功。'
      });
    });
  });
});