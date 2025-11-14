const CollectionController = require('../../controllers/CollectionController');
const CollectionModel = require('../../models/CollectionModel');

jest.mock('../../models/CollectionModel');

describe('CollectionController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { userId: 1, userType: 2 },
      body: {},
      params: {},
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('addCollection', () => {
    it('应该成功添加收藏', async () => {
      req.body = {
        collection_type: 1,
        source_id: 10001
      };

      CollectionModel.create.mockResolvedValue({ collection_id: 701 });

      await CollectionController.addCollection(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        code: 201,
        message: '收藏成功。',
        data: { collection_id: 701 }
      });
    });
  });

  describe('removeCollection', () => {
    it('应该成功取消收藏', async () => {
      req.params.collection_id = '701';

      CollectionModel.remove.mockResolvedValue({ collection_id: 701 });

      await CollectionController.removeCollection(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('getCollections', () => {
    it('应该返回收藏列表', async () => {
      req.query.type = '1';

      const mockCollections = [
        {
          collection_id: 701,
          collection_type: 1,
          source_id: 10001,
          collection_name: '2025 新产冬小麦（有机）',
          collection_time: '2025-10-26T15:00:00Z'
        }
      ];

      CollectionModel.findByUser.mockResolvedValue(mockCollections);

      await CollectionController.getCollections(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '查询成功。',
        data: mockCollections
      });
    });
  });
});