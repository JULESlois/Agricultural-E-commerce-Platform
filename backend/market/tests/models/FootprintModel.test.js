const FootprintModel = require('../../models/FootprintModel');

jest.mock('../../database', () => ({
  pool: {
    query: jest.fn()
  }
}));

const { pool } = require('../../database');
describe('FootprintModel', () => {
  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn()
    };
    pool.connect.mockResolvedValue(mockClient);
  });

  describe('findByUser', () => {
    it('应该返回用户浏览足迹', async () => {
      const mockCountResult = { rows: [{ count: '5' }] };
      const mockListResult = {
        rows: [{
          footprint_id: 3001,
          view_obj_id: 10001,
          view_obj_name: '2025 新产冬小麦（有机）',
          view_time: '2025-10-26T14:30:00Z'
        }]
      };

      pool.query
        .mockResolvedValueOnce(mockCountResult)
        .mockResolvedValueOnce(mockListResult);

      const result = await FootprintModel.findByUser(1, 1, 1, 20);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE user_id = $1 AND view_type = $2'),
        [1, 1]
      );
      expect(result).toHaveProperty('total', 5);
      expect(result).toHaveProperty('list');
      expect(result.list).toHaveLength(1);
    });
  });

  describe('deleteByIds', () => {
    it('应该删除指定的浏览足迹', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      await FootprintModel.deleteByIds(1, [3001, 3002]);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE mall_user_footprint'),
        [1, [3001, 3002]]
      );
    });
  });

  describe('create', () => {
    it('应该创建新的浏览足迹', async () => {
      pool.query.mockResolvedValue({ rows: [{ footprint_id: 3001 }] });

      const result = await FootprintModel.create(1, 1, 10001, '2025新产冬小麦', 30, '192.168.1.1', 'Chrome');

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO mall_user_footprint'),
        [1, 1, 10001, '2025新产冬小麦', 30, '192.168.1.1', 'Chrome']
      );
      expect(result).toEqual({ footprint_id: 3001 });
    });
  });
});