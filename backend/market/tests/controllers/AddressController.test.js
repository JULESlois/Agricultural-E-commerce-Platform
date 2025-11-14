const AddressController = require('../../controllers/AddressController');
const AddressModel = require('../../models/AddressModel');

jest.mock('../../models/AddressModel');

describe('AddressController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { userId: 1, userType: 2 },
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
  });

  describe('getList', () => {
    it('应该返回地址列表', async () => {
      const mockAddresses = [
        { address_id: 101, address_name: '公司地址' }
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
      req.params.address_id = '101';
      req.body = { receiver: '王小五' };

      AddressModel.update.mockResolvedValue({ address_id: 101 });

      await AddressController.update(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '地址修改成功。'
      });
    });
  });

  describe('delete', () => {
    it('应该成功删除地址', async () => {
      req.params.address_id = '102';

      AddressModel.delete.mockResolvedValue({ address_id: 102 });

      await AddressController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('setDefault', () => {
    it('应该成功设置默认地址', async () => {
      req.params.address_id = '102';

      AddressModel.setDefault.mockResolvedValue({ address_id: 102 });

      await AddressController.setDefault(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '默认地址设置成功。'
      });
    });
  });
});