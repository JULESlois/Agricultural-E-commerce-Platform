const CertTypeController = require('../../controllers/CertTypeController');
const CertTypeModel = require('../../models/CertTypeModel');

describe('CertTypeController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { userId: 1, userType: 1 },
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getByUserType', () => {
    it('应该返回适用的认证类型列表', async () => {
      const mockCertTypes = [
        {
          cert_type_id: 1,
          cert_type_code: 'ORGANIC',
          cert_type_name: '有机认证',
          cert_level: 1,
          required_materials: ['身份证', '营业执照'],
          optional_materials: ['推荐信'],
          audit_cycle: '1-2 个工作日'
        }
      ];

      CertTypeModel.findByUserType.mockResolvedValue(mockCertTypes);

      await CertTypeController.getByUserType(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '获取认证类型成功',
        data: mockCertTypes
      });
    });
  });

  describe('create', () => {
    it('应该成功创建认证类型', async () => {
      req.user.userType = 3; // 管理员
      req.body = {
        cert_type_code: 'GREEN',
        cert_type_name: '绿色认证',
        apply_user_type: 1,
        cert_level: 1,
        required_materials: ['身份证'],
        optional_materials: [],
        audit_cycle: '3-5 个工作日'
      };

      CertTypeModel.create.mockResolvedValue({ cert_type_id: 2 });

      await CertTypeController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        code: 201,
        message: '认证类型创建成功',
        data: { cert_type_id: 2 }
      });
    });

    it('应该拒绝非管理员用户', async () => {
      req.user.userType = 1;

      await CertTypeController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});