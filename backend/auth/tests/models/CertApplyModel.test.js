const CertApplyModel = require('../../models/CertApplyModel');

jest.mock('../database', () => ({
  pool: {
    query: jest.fn()
  }
}));

const { pool } = require('../database');

describe('CertApplyModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createDraft', () => {
    it('应该创建认证申请草稿', async () => {
      const mockResult = {
        rows: [{
          apply_id: 1,
          apply_no: 'CERT123456789'
        }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await CertApplyModel.createDraft(1, 1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO sys_user_cert_apply'),
        expect.arrayContaining([expect.any(String), 1, 1])
      );
      expect(result).toEqual(mockResult.rows[0]);
    });
  });

  describe('findByUserAndId', () => {
    it('应该返回用户的申请记录', async () => {
      const mockResult = {
        rows: [{
          apply_id: 1,
          apply_no: 'CERT123456',
          user_id: 1,
          cert_type_id: 1,
          apply_status: 0
        }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await CertApplyModel.findByUserAndId(1, 1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE apply_id = $1 AND user_id = $2'),
        [1, 1]
      );
      expect(result).toEqual(mockResult.rows[0]);
    });
  });

  describe('updateStatus', () => {
    it('应该更新申请状态', async () => {
      const additionalData = {
        audit_remark: '审核通过',
        cert_effect_time: new Date()
      };

      pool.query.mockResolvedValue({ rows: [{ apply_id: 1 }] });

      const result = await CertApplyModel.updateStatus(1, 2, additionalData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE sys_user_cert_apply'),
        expect.arrayContaining([1, 2])
      );
      expect(result).toEqual({ apply_id: 1 });
    });
  });

  describe('findByUserId', () => {
    it('应该返回用户的所有申请', async () => {
      const mockResult = {
        rows: [{
          apply_id: 1,
          apply_no: 'CERT123456',
          cert_type_name: '有机认证',
          apply_status: 1
        }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await CertApplyModel.findByUserId(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('LEFT JOIN sys_cert_type'),
        [1]
      );
      expect(result).toEqual(mockResult.rows);
    });
  });

  describe('findPendingList', () => {
    it('应该返回待审核申请列表', async () => {
      const mockCountResult = { rows: [{ count: '5' }] };
      const mockDataResult = {
        rows: [{
          apply_id: 1,
          apply_no: 'CERT123456',
          cert_type_name: '有机认证',
          real_name: '张三',
          user_name: 'farmer1'
        }]
      };

      pool.query
        .mockResolvedValueOnce(mockCountResult)
        .mockResolvedValueOnce(mockDataResult);

      const result = await CertApplyModel.findPendingList(1, 1, 10);

      expect(result).toHaveProperty('count', 5);
      expect(result).toHaveProperty('rows');
      expect(result.rows).toHaveLength(1);
    });
  });
});