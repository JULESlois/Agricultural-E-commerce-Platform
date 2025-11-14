const SourceController = require('../../controllers/SourceController');
const SourceModel = require('../../models/SourceModel');

jest.mock('../../models/SourceModel');

describe('SourceController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { userId: 1, userType: 1 },
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

  describe('createSource', () => {
    it('应该成功创建货源', async () => {
      req.body = {
        category_id: 101,
        product_name: '2025新产冬小麦（有机认证）',
        product_spec: '50kg / 袋，容重≥770g/L',
        origin: '河南省郑州市中牟县官渡镇',
        harvest_date: '2025-06-15',
        expire_date: '2026-06-14',
        total_quantity: 10000.00,
        unit_price: 2.85,
        product_images: '["https://img1.jpg"]',
        product_desc: '采用有机肥种植',
        logistics_type: 2,
        freight_rule: '整车运输，运费买家承担',
        min_order_quantity: 1000.00
      };

      SourceModel.create.mockResolvedValue({
        source_id: 10001,
        source_no: 'SRC20251026000001',
        audit_status: 0
      });

      await SourceController.createSource(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        code: 201,
        message: '货源发布成功，等待平台审核。',
        data: expect.objectContaining({
          source_id: 10001,
          source_no: 'SRC20251026000001',
          audit_status: 0
        })
      });
    });
  });

  describe('getSourceList', () => {
    it('应该返回货源列表', async () => {
      req.query = { category_id: '101', keyword: '小麦' };

      const mockResult = {
        total: 58,
        list: [
          {
            source_id: 10001,
            product_name: '2025新产冬小麦（有机认证）',
            origin: '河南省郑州市中牟县',
            unit_price: 2.85,
            main_image: 'https://img1.jpg'
          }
        ]
      };

      SourceModel.findList.mockResolvedValue(mockResult);

      await SourceController.getSourceList(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '查询成功。',
        data: mockResult
      });
    });
  });

  describe('getSourceDetail', () => {
    it('应该返回货源详情', async () => {
      req.params.source_id = '10001';

      const mockSource = {
        source_id: 10001,
        product_name: '2025新产冬小麦（有机认证）',
        source_status: 1,
        surplus_quantity: 10000.00,
        seller_info: {
          user_id: 1001,
          farm_name: '张三的有机农场',
          cert_status: 1
        }
      };

      SourceModel.findById.mockResolvedValue(mockSource);

      await SourceController.getSourceDetail(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '查询成功。',
        data: mockSource
      });
    });
  });

  describe('auditSource', () => {
    it('应该成功审核货源', async () => {
      req.user.userType = 3; // 管理员
      req.params.source_id = '10001';
      req.body = {
        audit_status: 1,
        audit_remark: '审核通过'
      };

      SourceModel.updateAuditStatus.mockResolvedValue({ source_id: 10001 });

      await SourceController.auditSource(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '货源审核操作成功。'
      });
    });
  });

  describe('createDemand', () => {
    it('应该成功创建求购', async () => {
      req.user.userType = 2; // 买家
      req.body = {
        category_id: 201,
        product_name: '新鲜番茄（商超专用）',
        product_spec: '直径5-7cm，硬度≥6kg/cm²',
        required_quantity: 5000.00,
        max_unit_price: 3.50,
        delivery_address_id: 123,
        latest_delivery_date: '2025-10-15',
        payment_type: 1,
        demand_desc: '每周送货1次'
      };

      SourceModel.createDemand.mockResolvedValue({
        demand_id: 2001,
        demand_no: 'DEM20251026000001'
      });

      await SourceController.createDemand(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        code: 201,
        message: '求购信息发布成功。',
        data: expect.objectContaining({
          demand_id: 2001,
          demand_no: 'DEM20251026000001'
        })
      });
    });
  });
});