const OrderModel = require('../../models/OrderModel');

// 模拟数据库连接
jest.mock('../../database', () => ({
  pool: {
    connect: jest.fn(),
    query: jest.fn()
  }
}));

const { pool } = require('../../database');
describe('OrderModel', () => {
  let mockClient;

  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn()
    };
    pool.connect.mockResolvedValue(mockClient);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('应该创建新订单', async () => {
      const orderData = {
        buyer_id: 1,
        seller_id: 2,
        source_id: 10001,
        quantity: 2000.00,
        unit_price: 2.85,
        total_amount: 5700.00,
        discount_amount: 0,
        freight_amount: 100.00,
        pay_amount: 5600.00,
        delivery_type: 2,
        receiver_address_id: 123,
        order_remark: '请使用防水包装'
      };

      mockClient.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockResolvedValueOnce({ rows: [] }) // INSERT order
        .mockResolvedValueOnce({ rows: [] }) // UPDATE source
        .mockResolvedValueOnce({ rows: [] }) // INSERT item
        .mockResolvedValueOnce({ rows: [] }); // COMMIT

      const result = await OrderModel.create(orderData);

      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      expect(result).toHaveProperty('order_id');
      expect(result).toHaveProperty('pay_amount', 5600.00);
    });

    it('应该在错误时回滚事务', async () => {
      const orderData = {
        buyer_id: 1,
        seller_id: 2,
        source_id: 10001,
        quantity: 2000.00,
        unit_price: 2.85,
        total_amount: 5700.00,
        pay_amount: 5600.00,
        delivery_type: 2,
        receiver_address_id: 123
      };

      mockClient.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockRejectedValueOnce(new Error('Database error')); // INSERT order fails

      await expect(OrderModel.create(orderData)).rejects.toThrow('Database error');
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
    });
  });

  describe('findByUser', () => {
    it('应该返回买家订单列表', async () => {
      const mockResult = {
        rows: [
          {
            order_id: 'ORD20251110000001',
            order_status: 1,
            pay_amount: 5600.00,
            seller_name: '张三的有机农场',
            items: [{ product_name: '2025新产冬小麦', item_quantity: 2000.00 }]
          }
        ]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await OrderModel.findByUser(1, 'buyer', 1, 1, 10);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE o.buyer_id = $1'),
        expect.arrayContaining([1, 1, 10, 0])
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('order_id', 'ORD20251110000001');
    });

    it('应该返回卖家订单列表', async () => {
      const mockResult = {
        rows: [
          {
            order_id: 'ORD20251110000001',
            order_status: 1,
            pay_amount: 5600.00,
            buyer_name: '美味果蔬超市',
            items: [{ product_name: '2025新产冬小麦', item_quantity: 2000.00 }]
          }
        ]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await OrderModel.findByUser(2, 'seller', null, 1, 10);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE o.seller_id = $1'),
        expect.arrayContaining([2, 10, 0])
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('buyer_name', '美味果蔬超市');
    });
  });

  describe('findById', () => {
    it('应该返回订单详情', async () => {
      const mockOrderResult = {
        rows: [{
          order_id: 'ORD20251110000001',
          order_status: 1,
          pay_amount: 5600.00,
          receiver: '王五',
          phone: '13700137000',
          full_address: '河南省郑州市中牟县官渡镇XX村XX号'
        }]
      };

      const mockItemResult = {
        rows: [{
          item_id: 1,
          product_name: '2025新产冬小麦',
          item_quantity: 2000.00,
          unit_price: 2.85
        }]
      };

      pool.query
        .mockResolvedValueOnce(mockOrderResult)
        .mockResolvedValueOnce(mockItemResult);

      const result = await OrderModel.findById('ORD20251110000001');

      expect(result).toHaveProperty('order_id', 'ORD20251110000001');
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('receiver_info');
      expect(result.items).toHaveLength(1);
    });

    it('应该返回null当订单不存在时', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await OrderModel.findById('NONEXISTENT');

      expect(result).toBeNull();
    });
  });

  describe('updatePayment', () => {
    it('应该更新支付状态', async () => {
      const paymentData = {
        payment_type: 1,
        payment_no: 'PAY123456789'
      };

      pool.query.mockResolvedValue({ rows: [{ order_id: 'ORD20251110000001' }] });

      const result = await OrderModel.updatePayment('ORD20251110000001', paymentData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE mall_order_main'),
        expect.arrayContaining([1, 'PAY123456789', 'ORD20251110000001'])
      );
      expect(result).toHaveProperty('order_id', 'ORD20251110000001');
    });
  });
});