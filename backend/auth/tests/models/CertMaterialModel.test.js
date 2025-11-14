const CertMaterialModel = require('../../models/CertMaterialModel');

jest.mock('../database', () => ({
  pool: {
    query: jest.fn()
  }
}));

const { pool } = require('../database');

describe('CertMaterialModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('应该创建认证材料记录', async () => {
      const materialData = {
        apply_id: 1,
        material_type: 'ID_CARD',
        material_name: '身份证正面',
        material_url: 'https://example.com/id_front.jpg',
        material_format: 'jpg',
        material_size: 1024.5,
        upload_user_id: 1
      };

      const mockResult = {
        rows: [{
          material_id: 1,
          material_url: 'https://example.com/id_front.jpg'
        }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await CertMaterialModel.create(materialData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO sys_user_cert_material'),
        expect.arrayContaining([1, 'ID_CARD', '身份证正面', 'https://example.com/id_front.jpg', 'jpg', 1024.5, 1])
      );
      expect(result).toEqual(mockResult.rows[0]);
    });
  });

  describe('findByApplyId', () => {
    it('应该返回申请的材料列表', async () => {
      const mockResult = {
        rows: [{
          material_id: 1,
          material_type: 'ID_CARD',
          material_name: '身份证正面',
          material_url: 'https://example.com/id_front.jpg',
          material_format: 'jpg',
          material_size: 1024.5,
          upload_time: '2025-10-26T10:00:00Z'
        }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await CertMaterialModel.findByApplyId(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE apply_id = $1 AND material_status = 1'),
        [1]
      );
      expect(result).toEqual(mockResult.rows);
    });
  });

  describe('checkRequiredMaterials', () => {
    it('应该检查必需材料是否完整', async () => {
      const mockResult = {
        rows: [
          { material_type: 'ID_CARD' },
          { material_type: 'BUSINESS_LICENSE' }
        ]
      };

      pool.query.mockResolvedValue(mockResult);

      const requiredMaterials = ['ID_CARD', 'BUSINESS_LICENSE', 'CERTIFICATE'];
      const result = await CertMaterialModel.checkRequiredMaterials(1, requiredMaterials);

      expect(result).toHaveProperty('isComplete', false);
      expect(result).toHaveProperty('missingMaterials', ['CERTIFICATE']);
    });

    it('应该返回完整状态当所有材料都已上传', async () => {
      const mockResult = {
        rows: [
          { material_type: 'ID_CARD' },
          { material_type: 'BUSINESS_LICENSE' }
        ]
      };

      pool.query.mockResolvedValue(mockResult);

      const requiredMaterials = ['ID_CARD', 'BUSINESS_LICENSE'];
      const result = await CertMaterialModel.checkRequiredMaterials(1, requiredMaterials);

      expect(result).toHaveProperty('isComplete', true);
      expect(result).toHaveProperty('missingMaterials', []);
    });
  });
});