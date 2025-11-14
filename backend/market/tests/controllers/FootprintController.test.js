const FootprintController = require('../../controllers/FootprintController');
const FootprintModel = require('../../models/FootprintModel');

jest.mock('../../models/FootprintModel');

describe('FootprintController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { userId: 1, userType: 2 },
      query: {},
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getFootprints', () => {
    it('应该返回用户浏览足迹', async () => {
      req.query = { type: '1', page: '1', pageSize: '20' };

      const mockResult = {
        total: 5,
        list: [
          {
            footprint_id: 3001,
            view_obj_id: 10001,
            view_obj_name: '2025 新产冬小麦（有机）',
            view_time: '2025-10-26T14:30:00Z'
          }
        ]
      };

      FootprintModel.findByUser.mockResolvedValue(mockResult);

      await FootprintController.getFootprints(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '查询成功。',
        data: mockResult
      });
    });

    it('应该验证type参数', async () => {
      req.query = {}; // 缺少type参数

      await FootprintController.getFootprints(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('deleteFootprints', () => {
    it('应该成功删除浏览足迹', async () => {
      req.body = { footprint_ids: [3001, 3002] };

      FootprintModel.deleteByIds.mockResolvedValue();

      await FootprintController.deleteFootprints(req, res);

      expect(FootprintModel.deleteByIds).toHaveBeenCalledWith(1, [3001, 3002]);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('应该验证footprint_ids参数', async () => {
      req.body = {}; // 缺少footprint_ids

      await FootprintController.deleteFootprints(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});