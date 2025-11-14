const AddressModel = require('../../models/AddressModel');

jest.mock('../../database', () => ({
  pool: {
    connect: jest.fn(),
    query: jest.fn()
  }
}));

const { pool } = require('../../database');
describe('AddressModel', () => {
  let mockClient;

  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn()
    };
    pool.connect.mockResolvedValue(mockClient);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('应该创建新地址', async () => {
      const addressData = {
        address_name: '公司地址',
        receiver: '王五',
        phone: '13700137000',
        province: '河南省',
        city: '郑州市',
        county: '中牟县',
        detail_address: '官渡镇XX村XX号',
        is_default: 1,
        postal_code: '451400'
      };

      mockClient.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockResolvedValueOnce({ rows: [] }) // UPDATE default
        .mockResolvedValueOnce({ rows: [{ address_id: 101 }] }) // INSERT
        .mockResolvedValueOnce({ rows: [] }); // COMMIT

      const result = await AddressModel.create(1, addressData);

      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      expect(result).toEqual({ address_id: 101 });
    });
  });

  describe('findByUserId', () => {
    it('应该返回用户地址列表', async () => {
      const mockResult = {
        rows: [{
          address_id: 101,
          address_name: '公司地址',
          receiver: '王五',
          phone: '13700137000',
          full_address: '河南省郑州市中牟县官渡镇XX村XX号',
          is_default: 1
        }]
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await AddressModel.findByUserId(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE user_id = $1'),
        [1]
      );
      expect(result).toEqual(mockResult.rows);
    });
  });

  describe('update', () => {
    it('应该更新地址信息', async () => {
      const updates = {
        receiver: '王小五',
        phone: '13700137001'
      };

      pool.query.mockResolvedValue({ rows: [{ address_id: 101 }] });

      const result = await AddressModel.update(1, 101, updates);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE sys_user_address'),
        expect.arrayContaining([1, 101])
      );
      expect(result).toEqual({ address_id: 101 });
    });
  });

  describe('delete', () => {
    it('应该删除地址', async () => {
      pool.query.mockResolvedValue({ rows: [{ address_id: 102 }] });

      const result = await AddressModel.delete(1, 102);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM sys_user_address'),
        [1, 102]
      );
      expect(result).toEqual({ address_id: 102 });
    });
  });

  describe('setDefault', () => {
    it('应该设置默认地址', async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockResolvedValueOnce({ rows: [] }) // UPDATE all to non-default
        .mockResolvedValueOnce({ rows: [{ address_id: 102 }] }) // UPDATE target to default
        .mockResolvedValueOnce({ rows: [] }); // COMMIT

      const result = await AddressModel.setDefault(1, 102);

      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      expect(result).toEqual({ address_id: 102 });
    });
  });
});