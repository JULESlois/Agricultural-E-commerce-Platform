const BuyerModel = require('../../models/BuyerModel');

jest.mock('../database', () => ({
  pool: {
    query: jest.fn()
  }
}));

const { pool } = require('../database');

describe('BuyerModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrUpdate', () => {
    it('应该创建或更新买家信息', async () => {
      const buyerData = {
        buyer_type: 2,
        company_name: '美味果蔬超市',
        company_address: '河南省郑州市金水区农业路1号',
        taxpayer_id: '91410100MA12345678',
        purchase_scope: '小麦,生鲜蔬菜',
        monthly_purchase: 50000.00,
        preferred_payment: 1,
        preferred_logistics: '顺丰,德邦'
      };

      const mockResult = {
        rows: [{
          buyer_id: 1,
          user_id: 1,
          company_name: '美味果蔬超市',
          update_time: '2025-10-26T16:10:00Z'
        }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await BuyerModel.createOrUpdate(1, buyerData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO sys_user_buyer'),
        expect.arrayContaining([1, 2, '美味果蔬超市', '河南省郑州市金水区农业路1号', '91410100MA12345678', '小麦,生鲜蔬菜', 50000.00, 1, '顺丰,德邦'])
      );
      expect(result).toEqual(mockResult.rows[0]);
    });
  });

  describe('findByUserId', () => {
    it('应该返回买家信息', async () => {
      const mockResult = {
        rows: [{
          buyer_id: 1,
          user_id: 1,
          buyer_type: 2,
          company_name: '美味果蔬超市',
          company_address: '河南省郑州市金水区农业路1号',
          taxpayer_id: '91410100MA12345678',
          purchase_scope: '小麦,生鲜蔬菜',
          monthly_purchase: 50000.00,
          preferred_payment: 1,
          preferred_logistics: '顺丰,德邦'
        }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await BuyerModel.findByUserId(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT buyer_id, user_id, buyer_type'),
        [1]
      );
      expect(result).toEqual(mockResult.rows[0]);
    });

    it('应该返回null当买家不存在时', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await BuyerModel.findByUserId(999);

      expect(result).toBeUndefined();
    });
  });
});