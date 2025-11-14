const FollowController = require('../../controllers/FollowController');
const FollowModel = require('../../models/FollowModel');

jest.mock('../../models/FollowModel');

describe('FollowController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { userId: 1, userType: 2 }, // 买家用户
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('followSeller', () => {
    it('应该成功关注卖家', async () => {
      req.body = {
        seller_id: 1001,
        follow_remark: '优质小麦卖家'
      };

      FollowModel.followSeller.mockResolvedValue({ follow_id: 401 });

      await FollowController.followSeller(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        code: 201,
        message: '关注成功。',
        data: { follow_id: 401 }
      });
    });

    it('应该处理已关注的情况', async () => {
      req.body = { seller_id: 1001 };

      FollowModel.followSeller.mockRejectedValue(new Error('您已关注该卖家'));

      await FollowController.followSeller(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('unfollowSeller', () => {
    it('应该成功取消关注', async () => {
      req.params.seller_id = '1001';

      FollowModel.unfollowSeller.mockResolvedValue({ follow_id: 401 });

      await FollowController.unfollowSeller(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('getFollowedSellers', () => {
    it('应该返回关注的店铺列表', async () => {
      const mockFollows = [
        {
          follow_id: 401,
          seller_id: 1001,
          seller_name: '张三的有机农场',
          source_count: 15,
          avg_score: 4.90,
          follow_time: '2025-10-25T10:00:00Z'
        }
      ];

      FollowModel.findFollowedSellers.mockResolvedValue(mockFollows);

      await FollowController.getFollowedSellers(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '查询成功。',
        data: mockFollows
      });
    });
  });
});