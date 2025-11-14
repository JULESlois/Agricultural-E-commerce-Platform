const CertificationService = require('../../services/CertificationService');
const CertApplyModel = require('../../models/CertApplyModel');
const CertMaterialModel = require('../../models/CertMaterialModel');

describe('CertificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('submitApplication', () => {
    it('应该成功提交认证申请', async () => {
      const applicationData = {
        apply_id: 1,
        apply_info: {
          company_name: '张三的有机农场',
          business_scope: '有机农产品种植'
        }
      };

      const requiredMaterials = ['ID_CARD', 'BUSINESS_LICENSE'];

      CertMaterialModel.checkRequiredMaterials.mockResolvedValue({
        isComplete: true,
        missingMaterials: []
      });

      CertApplyModel.updateStatus.mockResolvedValue({ apply_id: 1 });

      const result = await CertificationService.submitApplication(1, applicationData, requiredMaterials);

      expect(CertApplyModel.updateStatus).toHaveBeenCalledWith(
        1,
        1,
        expect.objectContaining({
          apply_info: JSON.stringify(applicationData.apply_info),
          apply_time: expect.any(Date)
        })
      );
      expect(result).toEqual({ apply_id: 1 });
    });

    it('应该处理材料不完整的情况', async () => {
      const applicationData = {
        apply_id: 1,
        apply_info: {}
      };

      const requiredMaterials = ['ID_CARD', 'BUSINESS_LICENSE'];

      CertMaterialModel.checkRequiredMaterials.mockResolvedValue({
        isComplete: false,
        missingMaterials: ['BUSINESS_LICENSE']
      });

      await expect(CertificationService.submitApplication(1, applicationData, requiredMaterials))
        .rejects.toThrow('认证材料不完整');
    });
  });

  describe('processApproval', () => {
    it('应该成功处理认证通过', async () => {
      const approvalData = {
        apply_id: 1,
        audit_status: 2,
        audit_remark: '审核通过',
        cert_effect_time: new Date(),
        cert_expire_time: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      };

      CertApplyModel.updateStatus.mockResolvedValue({ apply_id: 1 });

      const result = await CertificationService.processApproval(1, approvalData);

      expect(CertApplyModel.updateStatus).toHaveBeenCalledWith(
        1,
        2,
        expect.objectContaining({
          audit_remark: '审核通过',
          cert_effect_time: expect.any(Date),
          cert_expire_time: expect.any(Date)
        })
      );
      expect(result).toEqual({ apply_id: 1 });
    });

    it('应该处理认证拒绝', async () => {
      const rejectionData = {
        apply_id: 1,
        audit_status: 3,
        audit_remark: '材料不符合要求',
        reject_reason_type: 2
      };

      CertApplyModel.updateStatus.mockResolvedValue({ apply_id: 1 });

      const result = await CertificationService.processApproval(1, rejectionData);

      expect(CertApplyModel.updateStatus).toHaveBeenCalledWith(
        1,
        3,
        expect.objectContaining({
          audit_remark: '材料不符合要求',
          reject_reason_type: 2
        })
      );
      expect(result).toEqual({ apply_id: 1 });
    });
  });

  describe('checkCertificationStatus', () => {
    it('应该检查用户认证状态', async () => {
      const mockApplications = [
        {
          apply_id: 1,
          cert_type_code: 'ORGANIC',
          apply_status: 2,
          cert_effect_time: new Date(),
          cert_expire_time: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        }
      ];

      CertApplyModel.findByUserId.mockResolvedValue(mockApplications);

      const result = await CertificationService.checkCertificationStatus(1);

      expect(result).toHaveProperty('hasValidCertification', true);
      expect(result).toHaveProperty('certifications');
      expect(result.certifications).toHaveLength(1);
    });

    it('应该处理无有效认证的情况', async () => {
      CertApplyModel.findByUserId.mockResolvedValue([]);

      const result = await CertificationService.checkCertificationStatus(1);

      expect(result).toHaveProperty('hasValidCertification', false);
      expect(result).toHaveProperty('certifications', []);
    });
  });
});