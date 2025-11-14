const CouponController = require('../../controllers/CouponController');
const CouponModel = require('../../models/CouponModel');

jest.mock('../../models/CouponModel');

describe('CouponController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { userId: 1, userType: 2 },
      body: {},
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getAvailableCoupons', () => {
    it('应该返回可领取的优惠券列表', async () => {
      const mockCoupons = [
        {
          rule_id: 102,
          coupon_name: '全场95折优惠券',
          coupon_type: 2,
          min_use_amount: 0.00,
          max_discount_amount: 50.00,
          valid_period: '2025-11-01 至 2025-11-30'
        }
      ];

      CouponModel.findAvailableRules.mockResolvedValue(mockCoupons);

      await CouponController.getAvailableCoupons(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '查询成功。',
        data: mockCoupons
      });
    });
  });

  describe('claimCoupon', () => {
    it('应该成功领取优惠券', async () => {
      req.body = { rule_id: 102 };

      CouponModel.claimCoupon.mockResolvedValue({
        user_coupon_id: 5001,
        coupon_no: 'CPN2025102611223344'
      });

      await CouponController.claimCoupon(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '优惠券领取成功！',
        data: expect.objectContaining({
          user_coupon_id: 5001,
          coupon_no: 'CPN2025102611223344'
        })
      });
    });

    it('应该处理领取失败的情况', async () => {
      req.body = { rule_id: 102 };

      CouponModel.claimCoupon.mockRejectedValue(new Error('您已达到该优惠券的领取上限。'));

      await CouponController.claimCoupon(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        code: 409,
        message: '领取失败。',
        error: '您已达到该优惠券的领取上限。'
      });
    });
  });

  describe('getMyCoupons', () => {
    it('应该返回用户优惠券列表', async () => {
      req.query.status = '0';

      const mockCoupons = [
        {
          user_coupon_id: 5001,
          coupon_name: '全场95折优惠券',
          use_status: 0,
          description: '全场通用，最高可抵扣50元'
        }
      ];

      CouponModel.findUserCoupons.mockResolvedValue(mockCoupons);

      await CouponController.getMyCoupons(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '查询成功。',
        data: mockCoupons
      });
    });
  });

  describe('createCouponRule', () => {
    it('应该成功创建优惠券规则', async () => {
      req.user.userType = 3; // 管理员
      req.body = {
        coupon_type: 1,
        coupon_name: '新用户满200减30券',
        face_value: 30.00,
        min_use_amount: 200.00,
        valid_start_time: '2025-10-01T00:00:00Z',
        valid_end_time: '2025-12-31T23:59:59Z',
        total_quantity: 10000,
        obtain_limit: 1
      };

      CouponModel.createRule.mockResolvedValue({ rule_id: 101 });

      await CouponController.createCouponRule(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        code: 201,
        message: '优惠券规则创建成功。',
        data: { rule_id: 101 }
      });
    });

    it('应该拒绝非管理员用户', async () => {
      req.user.userType = 2;

      await CouponController.createCouponRule(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});