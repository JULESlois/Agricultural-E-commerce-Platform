const CategoryModel = require('../../models/CategoryModel');

jest.mock('../../database', () => ({
  pool: {
    query: jest.fn()
  }
}));

const { pool } = require('../../database');
describe('CategoryModel', () => {
  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn()
    };
    pool.connect.mockResolvedValue(mockClient);
  });

  describe('findTree', () => {
    it('应该返回品类树结构', async () => {
      const mockResult = {
        rows: [
          { category_id: 1, parent_id: 0, category_name: '粮食作物', category_code: 'GRAIN', sort: 1 },
          { category_id: 101, parent_id: 1, category_name: '小麦', category_code: 'GRAIN-WHEAT', sort: 1 },
          { category_id: 102, parent_id: 1, category_name: '玉米', category_code: 'GRAIN-CORN', sort: 2 }
        ]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await CategoryModel.findTree();

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT category_id, parent_id, category_name'),
        undefined
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('children');
      expect(result[0].children).toHaveLength(2);
    });
  });

  describe('create', () => {
    it('应该创建新品类', async () => {
      const categoryData = {
        parent_id: 1,
        category_name: '玉米',
        category_code: 'GRAIN-CORN',
        category_icon: 'https://example.com/icon/corn.png',
        sort: 10,
        status: 1
      };

      const mockResult = {
        rows: [{ category_id: 102 }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await CategoryModel.create(categoryData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO mall_product_category'),
        expect.arrayContaining([1, '玉米', 'GRAIN-CORN', 'https://example.com/icon/corn.png', 10, 1])
      );
      expect(result).toEqual(mockResult.rows[0]);
    });
  });
});