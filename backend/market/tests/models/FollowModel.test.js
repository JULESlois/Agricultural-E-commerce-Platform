const FollowModel = require('../../models/FollowModel');
const { pool } = require('../../database');

describe('FollowModel', () => {
  let mockClient;

  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn()
    };
    pool.connect.mockResolvedValue(mockClient);
  });

  describe('followSeller', () => {
    it('应该成功关注卖家', async () => {
      const mockSeller = {
        real_name: '张三',
        farm_name: '张三的有机农场'
      };

      mockClient.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockResolvedValueOnce({ rows: [] }) // 检查是否已关注
        .mockResolvedValueOnce({ rows: [mockSeller] }) // 获取卖家信息
        .mockResolvedValueOnce({ rows: [{ count: '15' }] }) // 获取货源数量
        .mockResolvedValueOnce({ rows: [] }) // 检查历史关注
        .mockResolvedValueOnce({ rows: [{ follow_id: 401 }] }) // 插入关注记录
        .mockResolvedValueOnce({ rows: [] }); // COMMIT

      const result = await FollowModel.followSeller(1, 1001, '优质小麦卖家');

      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      expect(result).toEqual({ follow_id: 401 });
    });

    it('应该处理已关注的情况', async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockResolvedValueOnce({ rows: [{ follow_id: 401 }] }) // 已关注
        .mockResolvedValueOnce({ rows: [] }); // ROLLBACK

      await expect(FollowModel.followSeller(1, 1001)).rejects.toThrow('您已关注该卖家');
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
    });
  });

  describe('unfollowSeller', () => {
    it('应该成功取消关注', async () => {
      pool.query.mockResolvedValue({ rows: [{ follow_id: 401 }] });

      const result = await FollowModel.unfollowSeller(1, 1001);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE mall_user_follow'),
        [1, 1001]
      );
      expect(result).toEqual({ follow_id: 401 });
    });
  });

  describe('findFollowedSellers', () => {
    it('应该返回关注的卖家列表', async () => {
      const mockResult = {
        rows: [{
          follow_id: 401,
          seller_id: 1001,
          seller_name: '张三的有机农场',
          source_count: 15,
          avg_score: 4.90,
          follow_time: '2025-10-25T10:00:00Z'
        }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await FollowModel.findFollowedSellers(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE user_id = $1 AND follow_status = 1'),
        [1]
      );
      expect(result).toEqual(mockResult.rows);
    });
  });
});