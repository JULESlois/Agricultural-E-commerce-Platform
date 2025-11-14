const OrderController = require('../../controllers/OrderController');
const OrderModel = require('../../models/OrderModel');

jest.mock('../../models/OrderModel');

describe('OrderController', () => {
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
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('应该成功创建订单', async () => {
      req.body = {
        source_id: 10001,
        quantity: 2000.00,
        receiver_address_id: 123,
        order_remark: '请使用防水包装'
      };

      OrderModel.create.mockResolvedValue({
        order_id: 'ORD20251110000001',
        pay_amount: 5600.00
      });

      await OrderController.createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        code: 201,
        message: '订单创建成功，请尽快支付。',
        data: {
          order_id: 'ORD20251110000001',
          pay_amount: 5600.00
        }
      });
    });

    it('应该验证必填字段', async () => {
      req.body = {
        source_id: 10001
        // 缺少必填字段
      };

      await OrderController.createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getOrderList', () => {
    it('应该返回买家订单列表', async () => {
      req.query = { status: '1' };

      const mockOrders = [
        {
          order_id: 'ORD20251110000001',
          order_status: 1,
          pay_amount: 5600.00,
          seller_name: '张三的有机农场',
          items: [{ product_name: '2025新产冬小麦', item_quantity: 2000.00 }]
        }
      ];

      OrderModel.findByUser.mockResolvedValue(mockOrders);

      await OrderController.getOrderList(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '查询成功。',
        data: mockOrders
      });
    });
  });

  describe('getOrderDetail', () => {
    it('应该返回订单详情', async () => {
      req.params.order_id = 'ORD20251110000001';

      const mockOrder = {
        order_id: 'ORD20251110000001',
        order_status: 1,
        pay_amount: 5600.00,
        items: [],
        receiver_info: {
          receiver: '王五',
          phone: '13700137000',
          full_address: '河南省郑州市中牟县官渡镇XX村XX号'
        }
      };

      OrderModel.findById.mockResolvedValue(mockOrder);

      await OrderController.getOrderDetail(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '查询成功。',
        data: mockOrder
      });
    });

    it('应该处理订单不存在的情况', async () => {
      req.params.order_id = 'NONEXISTENT';

      OrderModel.findById.mockResolvedValue(null);

      await OrderController.getOrderDetail(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('payOrder', () => {
    it('应该生成支付请求', async () => {
      req.params.order_id = 'ORD20251110000001';
      req.body = { payment_method: 'WECHAT_PAY' };

      await OrderController.payOrder(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '支付请求已生成。',
        data: expect.objectContaining({
          payment_gateway_payload: expect.any(Object)
        })
      });
    });
  });

  describe('shipOrder', () => {
    it('应该成功标记发货', async () => {
      req.params.order_id = 'ORD20251110000001';
      req.body = {
        delivery_type: 2,
        logistics_company: '德邦物流',
        logistics_no: 'DB123456789'
      };

      OrderModel.updateShipping.mockResolvedValue({ order_id: 'ORD20251110000001' });

      await OrderController.shipOrder(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '发货成功，订单状态已更新为"待收货"。'
      });
    });
  });

  describe('confirmReceipt', () => {
    it('应该成功确认收货', async () => {
      req.params.order_id = 'ORD20251110000001';

      OrderModel.confirmReceipt.mockResolvedValue({ order_id: 'ORD20251110000001' });

      await OrderController.confirmReceipt(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '确认收货成功，订单已完成。'
      });
    });
  });
});