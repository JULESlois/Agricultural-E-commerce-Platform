const CategoryController = require('../../controllers/CategoryController');
const CategoryModel = require('../../models/CategoryModel');

jest.mock('../../models/CategoryModel');

describe('CategoryController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { userId: 1, userType: 3 },
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getCategoryTree', () => {
    it('应该返回品类树', async () => {
      const mockCategories = [
        {
          category_id: 1,
          category_name: '粮食作物',
          children: [
            {
              category_id: 101,
              category_name: '小麦',
              children: []
            }
          ]
        }
      ];

      CategoryModel.findTree.mockResolvedValue(mockCategories);

      await CategoryController.getCategoryTree(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '获取品类树成功。',
        data: mockCategories
      });
    });
  });

  describe('createCategory', () => {
    it('应该成功创建品类', async () => {
      req.body = {
        parent_id: 1,
        category_name: '玉米',
        category_code: 'GRAIN-CORN',
        category_icon: 'https://example.com/icon/corn.png'
      };

      CategoryModel.create.mockResolvedValue({ category_id: 102 });

      await CategoryController.createCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        code: 201,
        message: '品类创建成功。',
        data: { category_id: 102 }
      });
    });

    it('应该验证必填字段', async () => {
      req.body = { category_name: '玉米' };

      await CategoryController.createCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});