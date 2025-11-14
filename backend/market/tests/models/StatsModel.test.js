const StatsModel = require('../../models/StatsModel');

jest.mock('../../database', () => ({
  pool: {
    query: jest.fn()
  }
}));

const { pool } = require('../../database');
describe('StatsModel', () => {
  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn()
    };
    pool.connect.mockResolvedValue(mockClient);
  });

  describe('getPriceTrends', () => {
    it('应该返回价格走势数据', async () => {
      const mockCategoryResult = {
        rows: [{ category_name: '小麦' }]
      };
      const mockTrendsResult = {
        rows: [{
          stat_date: '2025-09-25',
          avg_price: 2.85,
          max_price: 3.00,
          min_price: 2.70,
          price_trend: 2
        }]
      };

      pool.query
        .mockResolvedValueOnce(mockCategoryResult)
        .mockResolvedValueOnce(mockTrendsResult);

      const result = await StatsModel.getPriceTrends(101, '2025-09-01', '2025-09-30');

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT category_name FROM mall_product_category'),
        [101]
      );
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('FROM mall_product_price_stat'),
        [101, '2025-09-01', '2025-09-30']
      );
      expect(result).toHaveProperty('category_name', '小麦');
      expect(result).toHaveProperty('trends');
      expect(result.trends).toHaveLength(1);
    });

    it('应该处理品类不存在的情况', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      await expect(StatsModel.getPriceTrends(999, '2025-09-01', '2025-09-30'))
        .rejects.toThrow('品类不存在');
    });
  });

  describe('updatePriceStats', () => {
    it('应该更新价格统计数据', async () => {
      const priceData = {
        avg_price: 2.85,
        max_price: 3.00,
        min_price: 2.70,
        price_trend: 2,
        trend_rate: -0.05,
        supply_quantity: 10000,
        demand_quantity: 8000
      };

      pool.query
        .mockResolvedValueOnce({ rows: [] }) // 检查是否存在
        .mockResolvedValueOnce({ rows: [{ stat_id: 1 }] }); // 插入新记录

      const result = await StatsModel.updatePriceStats(101, '小麦', '2025-09-25', priceData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO mall_product_price_stat'),
        expect.arrayContaining([101, '小麦', '2025-09-25', 2.85, 3.00, 2.70, 2, -0.05, 10000, 8000])
      );
      expect(result).toEqual({ stat_id: 1 });
    });

    it('应该更新已存在的统计记录', async () => {
      const priceData = {
        avg_price: 2.90,
        max_price: 3.10,
        min_price: 2.75,
        price_trend: 1,
        trend_rate: 0.02,
        supply_quantity: 12000,
        demand_quantity: 9000
      };

      pool.query
        .mockResolvedValueOnce({ rows: [{ stat_id: 1 }] }) // 已存在
        .mockResolvedValueOnce({ rows: [{ stat_id: 1 }] }); // 更新记录

      const result = await StatsModel.updatePriceStats(101, '小麦', '2025-09-25', priceData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE mall_product_price_stat'),
        expect.arrayContaining([101, '小麦', 2.90, 3.10, 2.75, 1, 0.02, 12000, 9000, '2025-09-25'])
      );
      expect(result).toEqual({ stat_id: 1 });
    });
  });
});