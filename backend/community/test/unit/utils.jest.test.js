const { success, created, notFound, badRequest, error } = require('../../utils/response');

// 模拟 Express response 对象
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Utils 单元测试', () => {
  describe('Response 工具函数', () => {
    let res;

    beforeEach(() => {
      res = mockResponse();
      jest.clearAllMocks();
    });

    describe('success', () => {
      test('应该返回成功响应', () => {
        const data = { id: 1, name: 'test' };
        const message = '操作成功';

        success(res, data, message);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          code: 200,
          message: '操作成功',
          data: { id: 1, name: 'test' }
        });
      });

      test('应该支持自定义状态码', () => {
        success(res, null, '成功', 201);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          code: 201,
          message: '成功',
          data: null
        });
      });

      test('应该有默认消息', () => {
        success(res, { test: true });

        expect(res.json).toHaveBeenCalledWith({
          code: 200,
          message: '操作成功',
          data: { test: true }
        });
      });
    });

    describe('created', () => {
      test('应该返回创建成功响应', () => {
        const data = { id: 1 };
        const message = '创建成功';

        created(res, data, message);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          code: 201,
          message: '创建成功',
          data: { id: 1 }
        });
      });

      test('应该有默认消息', () => {
        created(res, { id: 1 });

        expect(res.json).toHaveBeenCalledWith({
          code: 201,
          message: '创建成功',
          data: { id: 1 }
        });
      });
    });

    describe('notFound', () => {
      test('应该返回 404 响应', () => {
        const message = '资源不存在';

        notFound(res, message);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
          code: 404,
          message: '资源不存在'
        });
      });

      test('应该有默认消息', () => {
        notFound(res);

        expect(res.json).toHaveBeenCalledWith({
          code: 404,
          message: '资源不存在'
        });
      });
    });

    describe('badRequest', () => {
      test('应该返回 400 响应', () => {
        const message = '请求参数错误';

        badRequest(res, message);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          code: 400,
          message: '请求参数错误'
        });
      });

      test('应该有默认消息', () => {
        badRequest(res);

        expect(res.json).toHaveBeenCalledWith({
          code: 400,
          message: '参数错误'
        });
      });
    });

    describe('error', () => {
      test('应该返回错误响应', () => {
        const message = '服务器错误';
        const code = 500;

        error(res, message, code);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          code: 500,
          message: '服务器错误'
        });
      });

      test('应该有默认状态码和消息', () => {
        error(res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          code: 500,
          message: '操作失败'
        });
      });

      test('应该支持自定义状态码', () => {
        error(res, '权限不足', 403);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
          code: 403,
          message: '权限不足'
        });
      });
    });
  });
});
