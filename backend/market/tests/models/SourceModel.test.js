const SourceModel = require('../../models/SourceModel');

jest.mock('../../database', () => ({
  pool: {
    query: jest.fn()
  }
}));

const { pool } = require('../../database');
describe('SourceModel', () => {
  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn()
    };
    pool.connect.mockResolvedValue(mockClient);
  });

  describe('create', () => {
    it('应该创建新货源', async () => {
      const sourceData = {
        category_id: 101,
        product_name: '2025新产冬小麦',
        product_spec: '50kg / 袋',
        origin: '河南省郑州市中牟县',
        harvest_date: '2025-06-15',
        expire_date: '2026-06-14',
        total_quantity: 10000.00,
        unit_price: 2.85,
        product_images: ['https://img1.jpg'],
        product_desc: '采用有机肥种植',
        logistics_type: 2,
        freight_rule: '整车运输',
        min_order_quantity: 1000.00
      };

      const mockResult = {
        rows: [{
          source_id: 10001,
          source_no: 'SRC20251026000001',
          audit_status: 0
        }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await SourceModel.create(1, sourceData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO mall_farmer_source'),
        expect.arrayContaining([1, 101])
      );
      expect(result).toEqual(mockResult.rows[0]);
    });
  });

  describe('findList', () => {
    it('应该返回货源列表', async () => {
      const filters = { category_id: 101, keyword: '小麦' };

      const mockCountResult = { rows: [{ count: '58' }] };
      const mockDataResult = {
        rows: [{
          source_id: 10001,
          product_name: '2025新产冬小麦',
          origin: '河南省郑州市中牟县',
          unit_price: 2.85,
          product_images: '["https://img1.jpg"]',
          farm_name: '张三的有机农场'
        }]
      };

      pool.query
        .mockResolvedValueOnce(mockCountResult)
        .mockResolvedValueOnce(mockDataResult);

      const result = await SourceModel.findList(filters, 1, 20);

      expect(result).toHaveProperty('total', 58);
      expect(result).toHaveProperty('list');
      expect(result.list[0]).toHaveProperty('main_image', 'https://img1.jpg');
    });
  });

  describe('findById', () => {
    it('应该返回货源详情', async () => {
      const mockResult = {
        rows: [{
          source_id: 10001,
          product_name: '2025新产冬小麦',
          product_images: '["https://img1.jpg", "https://img2.jpg"]',
          user_id: 1001,
          farm_name: '张三的有机农场',
          cert_status: 1
        }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await SourceModel.findById(10001);

      expect(result).toHaveProperty('source_id', 10001);
      expect(result).toHaveProperty('product_images');
      expect(result).toHaveProperty('seller_info');
      expect(Array.isArray(result.product_images)).toBe(true);
    });
  });

  describe('createDemand', () => {
    it('应该创建新求购', async () => {
      const demandData = {
        category_id: 201,
        product_name: '新鲜番茄',
        product_spec: '直径5-7cm',
        required_quantity: 5000.00,
        max_unit_price: 3.50,
        delivery_address_id: 123,
        latest_delivery_date: '2025-10-15',
        payment_type: 1,
        demand_desc: '每周送货1次'
      };

      const mockResult = {
        rows: [{
          demand_id: 2001,
          demand_no: 'DEM20251026000001'
        }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await SourceModel.createDemand(1, demandData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO mall_buyer_demand'),
        expect.arrayContaining([1, 201, expect.any(String), '新鲜番茄'])
      );
      expect(result).toEqual(mockResult.rows[0]);
    });
  });
});