const CertTypeModel = require('../../models/CertTypeModel');

jest.mock('../database', () => ({
  pool: {
    query: jest.fn()
  }
}));

const { pool } = require('../database');

describe('CertTypeModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findByUserType', () => {
    it('应该返回适用的认证类型', async () => {
      const mockResult = {
        rows: [{
          cert_type_id: 1,
          cert_type_code: 'ORGANIC',
          cert_type_name: '有机认证',
          cert_level: 1,
          required_materials: ['身份证', '营业执照'],
          optional_materials: ['推荐信'],
          audit_cycle: '1-2 个工作日'
        }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await CertTypeModel.findByUserType(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE apply_user_type = $1 AND cert_type_status = 1'),
        [1]
      );
      expect(result).toEqual(mockResult.rows);
    });
  });

  describe('create', () => {
    it('应该创建新的认证类型', async () => {
      const certTypeData = {
        cert_type_code: 'GREEN',
        cert_type_name: '绿色认证',
        apply_user_type: 1,
        cert_level: 1,
        required_materials: ['身份证'],
        optional_materials: [],
        audit_cycle: '3-5 个工作日',
        create_user: 1
      };

      const mockResult = {
        rows: [{ cert_type_id: 2 }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await CertTypeModel.create(certTypeData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO sys_cert_type'),
        expect.arrayContaining([
          'GREEN', '绿色认证', 1, 1,
          JSON.stringify(['身份证']), JSON.stringify([]),
          '3-5 个工作日', 1
        ])
      );
      expect(result).toEqual(mockResult.rows[0]);
    });
  });
});