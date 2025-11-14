const FarmerModel = require('../../models/FarmerModel');

jest.mock('../../database', () => ({
  pool: {
    query: jest.fn()
  }
}));

const { pool } = require('../../database');
describe('FarmerModel', () => {
  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn()
    };
    pool.connect.mockResolvedValue(mockClient);
  });

  describe('createOrUpdate', () => {
    it('应该创建或更新农户信息', async () => {
      const farmerData = {
        farm_name: '张三的有机农场',
        contact_person: '张三妻',
        contact_phone: '13800138001',
        bank_card_no: '6228480388888888888',
        bank_name: '中国农业银行郑州中牟支行',
        qualification: '有机认证'
      };

      const mockResult = {
        rows: [{
          farmer_id: 1,
          user_id: 1,
          farm_name: '张三的有机农场',
          update_time: '2025-10-26T16:00:00Z'
        }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await FarmerModel.createOrUpdate(1, farmerData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO sys_user_farmer'),
        expect.arrayContaining([1, '张三的有机农场', '张三妻', '13800138001', '6228480388888888888', '中国农业银行郑州中牟支行', '有机认证'])
      );
      expect(result).toEqual(mockResult.rows[0]);
    });
  });

  describe('findByUserId', () => {
    it('应该返回农户信息（所有者视图）', async () => {
      const mockResult = {
        rows: [{
          farmer_id: 1,
          user_id: 1,
          farm_name: '张三的有机农场',
          contact_person: '张三妻',
          contact_phone: '13800138001',
          bank_card_no: '6228...8888',
          bank_name: '中国农业银行郑州中牟支行',
          qualification: '有机认证'
        }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await FarmerModel.findByUserId(1, true);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('CONCAT(SUBSTRING(bank_card_no, 1, 4)'),
        [1]
      );
      expect(result).toEqual(mockResult.rows[0]);
    });

    it('应该返回农户信息（公众视图）', async () => {
      const mockResult = {
        rows: [{
          user_id: 1,
          farm_name: '张三的有机农场',
          qualification: '有机认证'
        }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await FarmerModel.findByUserId(1, false);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT user_id, farm_name, qualification'),
        [1]
      );
      expect(result).toEqual(mockResult.rows[0]);
    });
  });
});