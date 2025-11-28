const OrderModel = require('../models/OrderModel');
const SourceModel = require('../models/SourceModel');
const Joi = require('joi');

class OrderController {
  static async createOrder(req, res) {
    try {
      if (req.user.userType !== 2) {
        return res.status(403).json({
          code: 403,
          message: '只有买家用户才能创建订单'
        });
      }

      const schema = Joi.object({
        source_id: Joi.number().integer().required(),
        quantity: Joi.number().precision(2).min(0).required(),
        receiver_address_id: Joi.number().integer().required(),
        user_coupon_id: Joi.number().integer().optional(),
        order_remark: Joi.string().max(500).optional()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '创建失败',
          error: error.details[0].message
        });
      }

      // 获取货源信息
      const source = await SourceModel.findById(value.source_id);
      if (!source) {
        return res.status(404).json({
          code: 404,
          message: '货源不存在'
        });
      }

      // 检查库存
      if (source.surplus_quantity < value.quantity) {
        return res.status(400).json({
          code: 400,
          message: '库存不足'
        });
      }

      const totalAmount = value.quantity * source.unit_price;
      const freightAmount = 100; // 简化处理
      let discountAmount = 0;

      // 处理优惠券
      if (value.user_coupon_id) {
        const couponDiscount = await OrderModel.calculateCouponDiscount(
          value.user_coupon_id, 
          req.user.userId, 
          totalAmount
        );
        discountAmount = couponDiscount || 0;
      }

      const payAmount = totalAmount + freightAmount - discountAmount;

      const orderData = {
        buyer_id: req.user.userId,
        seller_id: source.user_id,
        source_id: value.source_id,
        quantity: value.quantity,
        unit_price: source.unit_price,
        total_amount: totalAmount,
        discount_amount: discountAmount,
        freight_amount: freightAmount,
        pay_amount: payAmount,
        delivery_type: source.logistics_type,
        receiver_address_id: value.receiver_address_id,
        order_remark: value.order_remark,
        user_coupon_id: value.user_coupon_id
      };

      const result = await OrderModel.create(orderData);

      res.status(201).json({
        code: 201,
        message: '订单创建成功，请尽快支付。',
        data: result
      });

    } catch (err) {
      console.error('创建订单失败:', err);
      res.status(500).json({
        code: 500,
        message: '创建失败',
        error: '服务器内部错误'
      });
    }
  }

  static async getOrderList(req, res) {
    try {
      const { status, page = 1 } = req.query;
      const pageSize = 10;
      const userType = req.user.userType === 1 ? 'seller' : 'buyer';

      // 处理status参数，过滤掉undefined字符串
      let statusValue = null;
      if (status && status !== 'undefined' && status !== 'null') {
        statusValue = Number.parseInt(status, 10);
      }

      const orders = await OrderModel.findByUser(
        req.user.userId, 
        userType, 
        statusValue,
        Number.parseInt(page, 10),
        pageSize
      );

      res.json({
        code: 200,
        message: '查询成功。',
        data: orders
      });

    } catch (err) {
      console.error('获取订单列表失败:', err);
      res.status(500).json({
        code: 500,
        message: '查询失败',
        error: '服务器内部错误'
      });
    }
  }

  static async getOrderDetail(req, res) {
    try {
      const orderId = req.params.order_id;
      const order = await OrderModel.findById(orderId);

      if (!order) {
        return res.status(404).json({
          code: 404,
          message: '订单不存在'
        });
      }

      // 检查权限
      if (order.buyer_id !== req.user.userId && order.seller_id !== req.user.userId) {
        return res.status(403).json({
          code: 403,
          message: '无权查看此订单'
        });
      }

      res.json({
        code: 200,
        message: '查询成功。',
        data: order
      });

    } catch (err) {
      console.error('获取订单详情失败:', err);
      res.status(500).json({
        code: 500,
        message: '查询失败',
        error: '服务器内部错误'
      });
    }
  }

  static async payOrder(req, res) {
    try {
      if (req.user.userType !== 2) {
        return res.status(403).json({
          code: 403,
          message: '只有买家用户才能支付订单'
        });
      }

      const orderId = req.params.order_id;
      
      // 检查订单是否属于当前买家
      const order = await OrderModel.findById(orderId);
      if (!order || order.buyer_id !== req.user.userId) {
        return res.status(403).json({
          code: 403,
          message: '无权支付此订单'
        });
      }

      if (order.order_status !== 0) {
        return res.status(400).json({
          code: 400,
          message: '订单状态不允许支付'
        });
      }
      
      const schema = Joi.object({
        payment_method: Joi.string().valid('WECHAT_PAY', 'ALIPAY', 'BANK_CARD').required()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '支付失败',
          error: error.details[0].message
        });
      }

      // 简化支付处理
      const paymentNo = `PAY${Date.now()}${Math.floor(Math.random() * 1000000)}`;
      const result = await OrderModel.updatePayment(orderId, {
        payment_type: 1,
        payment_no: paymentNo
      });

      if (!result) {
        return res.status(404).json({
          code: 404,
          message: '订单不存在'
        });
      }

      res.json({
        code: 200,
        message: '支付请求已生成。',
        data: {
          payment_gateway_payload: {
            payment_no: paymentNo,
            method: value.payment_method
          }
        }
      });

    } catch (err) {
      console.error('支付订单失败:', err);
      res.status(500).json({
        code: 500,
        message: '支付失败',
        error: '服务器内部错误'
      });
    }
  }

  static async shipOrder(req, res) {
    try {
      if (req.user.userType !== 1) {
        return res.status(403).json({
          code: 403,
          message: '只有卖家用户才能发货'
        });
      }

      const orderId = req.params.order_id;
      
      // 检查订单是否属于当前卖家
      const order = await OrderModel.findById(orderId);
      if (!order || order.seller_id !== req.user.userId) {
        return res.status(403).json({
          code: 403,
          message: '无权操作此订单'
        });
      }

      if (order.order_status !== 1) {
        return res.status(400).json({
          code: 400,
          message: '订单状态不允许发货'
        });
      }
      
      const schema = Joi.object({
        delivery_type: Joi.number().integer().valid(1, 2, 3).required(),
        logistics_company: Joi.string().max(50).required(),
        logistics_no: Joi.string().max(50).required()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '发货失败',
          error: error.details[0].message
        });
      }

      const result = await OrderModel.updateShipping(orderId, value);

      if (!result) {
        return res.status(404).json({
          code: 404,
          message: '订单不存在'
        });
      }

      res.json({
        code: 200,
        message: '发货成功，订单状态已更新为"待收货"。'
      });

    } catch (err) {
      console.error('发货失败:', err);
      res.status(500).json({
        code: 500,
        message: '发货失败',
        error: '服务器内部错误'
      });
    }
  }

  static async confirmReceipt(req, res) {
    try {
      if (req.user.userType !== 2) {
        return res.status(403).json({
          code: 403,
          message: '只有买家用户才能确认收货'
        });
      }

      const orderId = req.params.order_id;
      
      // 检查订单是否属于当前买家
      const order = await OrderModel.findById(orderId);
      if (!order || order.buyer_id !== req.user.userId) {
        return res.status(403).json({
          code: 403,
          message: '无权操作此订单'
        });
      }

      if (order.order_status !== 2) {
        return res.status(400).json({
          code: 400,
          message: '订单状态不允许确认收货'
        });
      }

      const result = await OrderModel.confirmReceipt(orderId);

      if (!result) {
        return res.status(404).json({
          code: 404,
          message: '订单不存在'
        });
      }

      res.json({
        code: 200,
        message: '确认收货成功，订单已完成。'
      });

    } catch (err) {
      console.error('确认收货失败:', err);
      res.status(500).json({
        code: 500,
        message: '确认收货失败',
        error: '服务器内部错误'
      });
    }
  }

  static async applyInvoice(req, res) {
    try {
      if (req.user.userType !== 2) {
        return res.status(403).json({
          code: 403,
          message: '只有买家用户才能申请发票'
        });
      }

      const orderId = req.params.order_id;
      
      // 检查订单是否属于当前买家且已完成
      const order = await OrderModel.findById(orderId);
      if (!order || order.buyer_id !== req.user.userId) {
        return res.status(403).json({
          code: 403,
          message: '无权为此订单申请发票'
        });
      }

      if (order.order_status !== 4) {
        return res.status(400).json({
          code: 400,
          message: '只有已完成的订单才能申请发票'
        });
      }
      
      const schema = Joi.object({
        invoice_type: Joi.number().integer().valid(1, 2).required(),
        invoice_title: Joi.string().max(100).required(),
        taxpayer_id: Joi.string().max(50).optional(),
        delivery_way: Joi.number().integer().valid(1, 2).default(1)
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '申请失败',
          error: error.details[0].message
        });
      }

      const result = await OrderModel.applyInvoice(orderId, req.user.userId, value);

      if (!result) {
        return res.status(404).json({
          code: 404,
          message: '订单不存在'
        });
      }

      res.json({
        code: 200,
        message: '发票申请已提交，等待处理。'
      });

    } catch (err) {
      console.error('申请发票失败:', err);
      res.status(500).json({
        code: 500,
        message: '申请失败',
        error: '服务器内部错误'
      });
    }
  }

  static async updateInvoiceStatus(req, res) {
    try {
      if (req.user.userType !== 3) {
        return res.status(403).json({
          code: 403,
          message: '只有管理员才能更新发票状态'
        });
      }

      const invoiceId = req.params.invoice_id;
      
      const schema = Joi.object({
        invoice_status: Joi.number().integer().valid(0, 1, 2, 3, 4, 5, 6).required(),
        invoice_no: Joi.string().max(50).optional(),
        invoice_url: Joi.string().max(200).optional()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '更新失败',
          error: error.details[0].message
        });
      }

      const result = await OrderModel.updateInvoiceStatus(invoiceId, value);

      if (!result) {
        return res.status(404).json({
          code: 404,
          message: '发票不存在'
        });
      }

      res.json({
        code: 200,
        message: '发票状态更新成功。'
      });

    } catch (err) {
      console.error('更新发票状态失败:', err);
      res.status(500).json({
        code: 500,
        message: '更新失败',
        error: '服务器内部错误'
      });
    }
  }
}

module.exports = OrderController;