const AftersaleModel = require('../../models/AftersaleModel');

jest.mock('../../database', () => ({
  pool: {
    query: jest.fn()
  }
}));

const { pool } = require('../../database');
describe('AftersaleModel', () => {
  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn()
    };
    pool.connect.mockResolvedValue(mockClient);
  });

  describe('create', () => {
    it('应该创建售后申请', async () => {
      const aftersaleData = {
        order_id: 'ORD20251110000001',
        aftersale_type: 1,
        apply_amount: 500.00,
        reason: '部分小麦有发霉迹象',
        proof_images: '["https://proof1.jpg"]',
        apply_user: 1
      };

      pool.query
        .mockResolvedValueOnce({ rows: [] }) // 检查是否已存在
        .mockResolvedValueOnce({ rows: [{ aftersale_id: 601 }] }); // 插入售后申请

      const result = await AftersaleModel.create(aftersaleData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO mall_order_aftersale'),
        expect.arrayContaining(['ORD20251110000001', 1, 500.00, '部分小麦有发霉迹象', '["https://proof1.jpg"]', 1])
      );
      expect(result).toEqual({ aftersale_id: 601 });
    });

    it('应该处理重复申请的情况', async () => {
      const aftersaleData = {
        order_id: 'ORD20251110000001',
        aftersale_type: 1,
        apply_amount: 500.00,
        reason: '部分小麦有发霉迹象',
        apply_user: 1
      };

      pool.query.mockResolvedValueOnce({ rows: [{ aftersale_id: 601 }] }); // 已存在

      await expect(AftersaleModel.create(aftersaleData)).rejects.toThrow('该订单已存在售后申请');
    });
  });

  describe('review', () => {
    it('应该审核售后申请', async () => {
      const reviewData = {
        audit_user: 1,
        audit_status: 1,
        audit_remark: '情况属实，同意退款申请。'
      };

      pool.query.mockResolvedValue({ rows: [{ aftersale_id: 601 }] });

      const result = await AftersaleModel.review(601, reviewData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE mall_order_aftersale'),
        expect.arrayContaining([1, 1, '情况属实，同意退款申请。', 601])
      );
      expect(result).toEqual({ aftersale_id: 601 });
    });
  });
});