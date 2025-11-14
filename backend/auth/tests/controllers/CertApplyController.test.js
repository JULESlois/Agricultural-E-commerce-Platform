const CertApplyController = require('../../controllers/CertApplyController');
const CertApplyModel = require('../../models/CertApplyModel');

describe('CertApplyController', () => {
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

  describe('createDraft', () => {
    it('应该创建认证申请草稿', async () => {
      req.body = { cert_type_id: 1 };

      CertApplyModel.createDraft.mockResolvedValue({
        apply_id: 1,
        apply_no: 'CERT123456'
      });

      await CertApplyController.createDraft(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        code: 201,
        message: '认证申请草稿创建成功',
        data: expect.objectContaining({
          apply_id: 1,
          apply_no: 'CERT123456'
        })
      });
    });
  });

  describe('getMyApplications', () => {
    it('应该返回用户的认证申请列表', async () => {
      const mockApplications = [
        {
          apply_id: 1,
          apply_no: 'CERT123456',
          cert_type_name: '有机认证',
          apply_status: 1
        }
      ];

      CertApplyModel.findByUserId.mockResolvedValue(mockApplications);

      await CertApplyController.getMyApplications(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '获取认证申请列表成功',
        data: mockApplications
      });
    });
  });
});