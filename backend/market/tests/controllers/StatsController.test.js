const StatsController = require('../../controllers/StatsController');
const StatsModel = require('../../models/StatsModel');

jest.mock('../../models/StatsModel');

describe('StatsController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getPriceTrends', () => {
    it('应该返回价格走势数据', async () => {
      req.query = {
        category_id: '101',
        start_date: '2025-09-01',
        end_date: '2025-09-30'
      };

      const mockTrends = {
        category_name: '小麦',
        trends: [
          {
            stat_date: '2025-09-25',
            avg_price: 2.85,
            max_price: 3.00,
            min_price: 2.70,
            price_trend: 2
          }
        ]
      };

      StatsModel.getPriceTrends.mockResolvedValue(mockTrends);

      await StatsController.getPriceTrends(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '查询成功。',
        data: mockTrends
      });
    });

    it('应该验证必填参数', async () => {
      req.query = { category_id: '101' }; // 缺少日期参数

      await StatsController.getPriceTrends(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});