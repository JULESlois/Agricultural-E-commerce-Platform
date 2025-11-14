const CouponModel = require('../../models/CouponModel');

jest.mock('../../database', () => ({
  pool: {
    connect: jest.fn(),
    query: jest.fn()
  }
}));

const { pool } = require('../../database');
describe('CouponModel', () => {
  let mockClient;

  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn()
    };
    pool.connect.mockResolvedValue(mockClient);
    jest.clearAllMocks();
  });

  describe('findAvailableRules', () => {
    it('应该返回可领取的优惠券规则', async () => {
      const mockResult = {
        rows: [{
          rule_id: 102,
          coupon_name: '全场95折优惠券',
          coupon_type: 2,
          min_use_amount: 0.00,
          max_discount_amount: 50.00,
          valid_start_time: new Date('2025-11-01'),
          valid_end_time: new Date('2025-11-30'),
          remaining_quantity: 1000
        }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await CouponModel.findAvailableRules();

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE status = 1 AND obtain_type = 1')
      );
      expect(result[0]).toHaveProperty('valid_period');
    });
  });

  describe('claimCoupon', () => {
    it('应该成功领取优惠券', async () => {
      const mockRule = {
        rule_id: 102,
        obtain_limit: 1,
        valid_start_time: new Date(),
        valid_end_time: new Date()
      };

      mockClient.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockResolvedValueOnce({ rows: [mockRule] }) // 检查规则
        .mockResolvedValueOnce({ rows: [{ count: '0' }] }) // 检查用户领取次数
        .mockResolvedValueOnce({ rows: [{ user_coupon_id: 5001, coupon_no: 'CPN123' }] }) // 插入优惠券
        .mockResolvedValueOnce({ rows: [] }) // 更新已使用数量
        .mockResolvedValueOnce({ rows: [] }) // 记录日志
        .mockResolvedValueOnce({ rows: [] }); // COMMIT

      const result = await CouponModel.claimCoupon(1, 102);

      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      expect(result).toHaveProperty('user_coupon_id', 5001);
    });

    it('应该处理领取限制', async () => {
      const mockRule = {
        rule_id: 102,
        obtain_limit: 1
      };

      mockClient.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockResolvedValueOnce({ rows: [mockRule] }) // 检查规则
        .mockResolvedValueOnce({ rows: [{ count: '1' }] }); // 已达到限制

      await expect(CouponModel.claimCoupon(1, 102)).rejects.toThrow('您已达到该优惠券的领取上限。');
    });
  });

  describe('findUserCoupons', () => {
    it('应该返回用户优惠券列表', async () => {
      const mockResult = {
        rows: [{
          user_coupon_id: 5001,
          coupon_name: '全场95折优惠券',
          coupon_type: 2,
          use_status: 0,
          min_use_amount: 0,
          max_discount_amount: 50
        }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await CouponModel.findUserCoupons(1, 0);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE uc.user_id = $1 AND uc.use_status = $2'),
        [1, 0]
      );
      expect(result[0]).toHaveProperty('description');
    });
  });

  describe('createRule', () => {
    it('应该创建优惠券规则', async () => {
      const ruleData = {
        coupon_type: 1,
        coupon_name: '新用户满200减30券',
        face_value: 30.00,
        min_use_amount: 200.00,
        valid_start_time: '2025-10-01T00:00:00Z',
        valid_end_time: '2025-12-31T23:59:59Z',
        total_quantity: 10000,
        obtain_limit: 1,
        obtain_type: 2
      };

      pool.query.mockResolvedValue({ rows: [{ rule_id: 101 }] });

      const result = await CouponModel.createRule(ruleData, 1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO mall_coupon_rule'),
        expect.arrayContaining([1, '新用户满200减30券', 30.00, 200.00])
      );
      expect(result).toEqual({ rule_id: 101 });
    });
  });
});