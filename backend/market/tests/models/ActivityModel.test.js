const ActivityModel = require('../../models/ActivityModel');

jest.mock('../../database', () => ({
  pool: {
    query: jest.fn()
  }
}));

const { pool } = require('../../database');
describe('ActivityModel', () => {
  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn()
    };
    pool.connect.mockResolvedValue(mockClient);
  });

  describe('findActiveList', () => {
    it('应该返回进行中的活动列表', async () => {
      const mockResult = {
        rows: [{
          activity_id: 1,
          activity_no: 'DIS20250925123456',
          activity_name: '2025 临期小麦折扣',
          activity_type: 1,
          end_time: '2025-09-30T23:59:59Z',
          discount_rule: '临期≤15 天 8 折，≤7 天 6 折'
        }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await ActivityModel.findActiveList();

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE activity_status = 1')
      );
      expect(result).toEqual(mockResult.rows);
    });
  });

  describe('create', () => {
    it('应该创建新活动', async () => {
      const activityData = {
        activity_name: '国庆节清仓大促',
        activity_type: 2,
        start_time: '2025-10-01T00:00:00Z',
        end_time: '2025-10-07T23:59:59Z',
        discount_rule: '全场指定商品 7 折',
        apply_category_ids: '101,203',
        create_user: 1
      };

      const mockResult = {
        rows: [{ activity_id: 2 }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await ActivityModel.create(activityData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO mall_discount_activity'),
        expect.arrayContaining([
          expect.any(String), '国庆节清仓大促', 2,
          '2025-10-01T00:00:00Z', '2025-10-07T23:59:59Z',
          '全场指定商品 7 折', '101,203', 1
        ])
      );
      expect(result).toEqual(mockResult.rows[0]);
    });
  });

  describe('findById', () => {
    it('应该返回活动详情', async () => {
      const mockResult = {
        rows: [{
          activity_id: 1,
          activity_no: 'DIS20250925123456',
          activity_name: '2025 临期小麦折扣',
          activity_status: 1,
          total_source_count: 50,
          total_order_count: 120,
          total_sales_amount: 85000.00
        }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await ActivityModel.findById(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE activity_id = $1'),
        [1]
      );
      expect(result).toEqual(mockResult.rows[0]);
    });
  });

  describe('updateStats', () => {
    it('应该更新活动统计数据', async () => {
      const statsData = {
        total_source_count: 60,
        total_order_count: 150,
        total_sales_amount: 95000.00
      };

      pool.query.mockResolvedValue({ rows: [{ activity_id: 1 }] });

      const result = await ActivityModel.updateStats(1, statsData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE mall_discount_activity'),
        expect.arrayContaining([60, 150, 95000.00, 1])
      );
      expect(result).toEqual({ activity_id: 1 });
    });
  });
});