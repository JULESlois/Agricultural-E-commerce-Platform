const AddressController = require('../../controllers/AddressController');
const AddressModel = require('../../models/AddressModel');

describe('AddressController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { userId: 1 },
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('应该成功创建地址', async () => {
      req.body = {
        address_name: '公司地址',
        receiver: '王五',
        phone: '13700137000',
        province: '河南省',
        city: '郑州市',
        county: '中牟县',
        detail_address: '官渡镇XX村XX号'
      };

      AddressModel.create.mockResolvedValue({ address_id: 101 });

      await AddressController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        code: 201,
        message: '地址添加成功。',
        data: { address_id: 101 }
      });
    });

    it('应该验证必填字段', async () => {
      req.body = { address_name: '公司地址' };

      await AddressController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 400,
          message: '添加失败'
        })
      );
    });
  });

  describe('getList', () => {
    it('应该返回用户地址列表', async () => {
      const mockAddresses = [
        { address_id: 101, address_name: '公司地址' },
        { address_id: 102, address_name: '家里地址' }
      ];

      AddressModel.findByUserId.mockResolvedValue(mockAddresses);

      await AddressController.getList(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '获取地址列表成功。',
        data: mockAddresses
      });
    });
  });

  describe('update', () => {
    it('应该成功更新地址', async () => {
      req.params.addressId = '101';
      req.body = { receiver: '王小五' };

      AddressModel.update.mockResolvedValue({ address_id: 101 });

      await AddressController.update(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '地址修改成功。'
      });
    });

    it('应该处理地址不存在的情况', async () => {
      req.params.addressId = '999';
      req.body = { receiver: '王小五' };

      AddressModel.update.mockResolvedValue(null);

      await AddressController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('delete', () => {
    it('应该成功删除地址', async () => {
      req.params.addressId = '102';

      AddressModel.delete.mockResolvedValue({ address_id: 102 });

      await AddressController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('setDefault', () => {
    it('应该成功设置默认地址', async () => {
      req.params.addressId = '102';

      AddressModel.setDefault.mockResolvedValue({ address_id: 102 });

      await AddressController.setDefault(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '默认地址设置成功。'
      });
    });
  });
});