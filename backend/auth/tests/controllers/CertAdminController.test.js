const CertAdminController = require('../../controllers/CertAdminController');
const CertApplyModel = require('../../models/CertApplyModel');

describe('CertAdminController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { userId: 1, userType: 3 },
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

  describe('getPendingList', () => {
    it('应该返回待审核申请列表', async () => {
      req.query = { status: '1', page: '1', pageSize: '10' };

      const mockResult = {
        rows: [
          {
            apply_id: 1,
            apply_no: 'CERT123456',
            cert_type_name: '有机认证',
            real_name: '张三',
            user_name: 'farmer1'
          }
        ],
        count: 1,
        totalPages: 1,
        currentPage: 1
      };

      CertApplyModel.findPendingList.mockResolvedValue(mockResult);

      await CertAdminController.getPendingList(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '获取待审核列表成功',
        data: mockResult
      });
    });
  });

  describe('getApplicationDetail', () => {
    it('应该返回申请详情', async () => {
      req.params.apply_id = '1';

      const mockApplication = {
        apply_id: 1,
        apply_no: 'CERT123456',
        cert_type_name: '有机认证',
        required_materials: ['身份证', '营业执照'],
        real_name: '张三',
        user_name: 'farmer1',
        phone: '13800138000'
      };

      CertApplyModel.findDetailById.mockResolvedValue(mockApplication);

      await CertAdminController.getApplicationDetail(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '获取申请详情成功',
        data: mockApplication
      });
    });
  });

  describe('reviewApplication', () => {
    it('应该成功审核申请', async () => {
      req.params.apply_id = '1';
      req.body = {
        audit_status: 2,
        audit_remark: '审核通过'
      };

      CertApplyModel.updateStatus.mockResolvedValue({ apply_id: 1 });

      await CertAdminController.reviewApplication(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '审核操作成功'
      });
    });

    it('应该拒绝非管理员用户', async () => {
      req.user.userType = 1;

      await CertAdminController.reviewApplication(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});