const CollectionModel = require('../../models/CollectionModel');

jest.mock('../../database', () => ({
  pool: {
    query: jest.fn()
  }
}));

const { pool } = require('../../database');
describe('CollectionModel', () => {
  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn()
    };
    pool.connect.mockResolvedValue(mockClient);
  });

  describe('create', () => {
    it('应该成功创建货源收藏', async () => {
      const collectionData = {
        collection_type: 1,
        source_id: 10001,
        demand_id: null
      };

      pool.query
        .mockResolvedValueOnce({ rows: [{ product_name: '2025新产冬小麦' }] }) // 获取货源名称
        .mockResolvedValueOnce({ rows: [] }) // 检查是否已收藏
        .mockResolvedValueOnce({ rows: [{ collection_id: 701 }] }); // 插入收藏

      const result = await CollectionModel.create(1, collectionData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO mall_user_collection'),
        [1, 1, 10001, null, '2025新产冬小麦']
      );
      expect(result).toEqual({ collection_id: 701 });
    });

    it('应该成功创建求购收藏', async () => {
      const collectionData = {
        collection_type: 2,
        source_id: null,
        demand_id: 2001
      };

      pool.query
        .mockResolvedValueOnce({ rows: [{ product_name: '新鲜番茄' }] }) // 获取求购名称
        .mockResolvedValueOnce({ rows: [] }) // 检查是否已收藏
        .mockResolvedValueOnce({ rows: [{ collection_id: 702 }] }); // 插入收藏

      const result = await CollectionModel.create(1, collectionData);

      expect(result).toEqual({ collection_id: 702 });
    });

    it('应该处理已收藏的情况', async () => {
      const collectionData = {
        collection_type: 1,
        source_id: 10001
      };

      pool.query
        .mockResolvedValueOnce({ rows: [{ product_name: '2025新产冬小麦' }] })
        .mockResolvedValueOnce({ rows: [{ collection_id: 701 }] }); // 已收藏

      await expect(CollectionModel.create(1, collectionData)).rejects.toThrow('您已收藏该项目');
    });
  });

  describe('remove', () => {
    it('应该成功取消收藏', async () => {
      pool.query.mockResolvedValue({ rows: [{ collection_id: 701 }] });

      const result = await CollectionModel.remove(1, 701);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE mall_user_collection'),
        [1, 701]
      );
      expect(result).toEqual({ collection_id: 701 });
    });
  });

  describe('findByUser', () => {
    it('应该返回用户收藏列表', async () => {
      const mockResult = {
        rows: [{
          collection_id: 701,
          collection_type: 1,
          source_id: 10001,
          demand_id: null,
          collection_name: '2025 新产冬小麦（有机）',
          collection_time: '2025-10-26T15:00:00Z'
        }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await CollectionModel.findByUser(1, 1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE user_id = $1 AND is_valid = 1'),
        [1, 1]
      );
      expect(result).toEqual(mockResult.rows);
    });

    it('应该返回所有类型的收藏', async () => {
      const mockResult = {
        rows: [
          { collection_id: 701, collection_type: 1 },
          { collection_id: 702, collection_type: 2 }
        ]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await CollectionModel.findByUser(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE user_id = $1 AND is_valid = 1'),
        [1]
      );
      expect(result).toEqual(mockResult.rows);
    });
  });
});