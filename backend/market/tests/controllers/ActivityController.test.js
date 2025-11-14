const ActivityController = require('../../controllers/ActivityController');
const ActivityModel = require('../../models/ActivityModel');

jest.mock('../../models/ActivityModel');

describe('ActivityController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { userId: 1, userType: 3 },
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getActivityList', () => {
    it('应该返回活动列表', async () => {
      const mockActivities = [
        {
          activity_id: 1,
          activity_no: 'DIS20250925123456',
          activity_name: '2025 临期小麦折扣',
          activity_type: 1,
          end_time: '2025-09-30T23:59:59Z',
          discount_rule: '临期≤15 天 8 折，≤7 天 6 折'
        }
      ];

      ActivityModel.findActiveList.mockResolvedValue(mockActivities);

      await ActivityController.getActivityList(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '获取活动列表成功。',
        data: mockActivities
      });
    });
  });

  describe('createActivity', () => {
    it('应该成功创建活动', async () => {
      req.body = {
        activity_name: '国庆节清仓大促',
        activity_type: 2,
        start_time: '2025-10-01T00:00:00Z',
        end_time: '2025-10-07T23:59:59Z',
        discount_rule: '全场指定商品 7 折',
        apply_category_ids: '101,203'
      };

      ActivityModel.create.mockResolvedValue({ activity_id: 2 });

      await ActivityController.createActivity(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        code: 201,
        message: '折扣活动创建成功。',
        data: { activity_id: 2 }
      });
    });
  });

  describe('getActivityDetail', () => {
    it('应该返回活动详情', async () => {
      req.params.activity_id = '1';

      const mockActivity = {
        activity_id: 1,
        activity_no: 'DIS20250925123456',
        activity_name: '2025 临期小麦折扣',
        activity_status: 1,
        total_source_count: 50,
        total_order_count: 120,
        total_sales_amount: 85000.00
      };

      ActivityModel.findById.mockResolvedValue(mockActivity);

      await ActivityController.getActivityDetail(req, res);

      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: '获取活动详情成功。',
        data: mockActivity
      });
    });
  });
});