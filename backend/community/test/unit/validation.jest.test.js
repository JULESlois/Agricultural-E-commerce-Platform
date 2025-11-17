const Joi = require('joi');
const {
  validate,
  validateQuery,
  createContentSchema,
  createCommentSchema,
  paginationSchema,
  followUserSchema,
  blacklistUserSchema,
  adoptBestAnswerSchema,
  createReportSchema,
  handleReportSchema
} = require('../../utils/validation');

// 模拟 Express 的 req, res, next
const mockRequest = (body = {}, query = {}) => ({ body, query });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
const mockNext = jest.fn();

describe('Validation 单元测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createContentSchema 验证', () => {
    test('有效的内容数据应该通过验证', () => {
      const validData = {
        category_id: 1,
        content_type: 1,
        content_title: '测试标题测试',
        content_text: '测试内容正文测试内容',
        tag_ids: [1, 2]
      };

      const { error } = createContentSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    test('缺少必填字段应该验证失败', () => {
      const invalidData = {
        category_id: 1
      };

      const { error } = createContentSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details.length).toBeGreaterThan(0);
    });

    test('无效的 content_type 应该验证失败', () => {
      const invalidData = {
        category_id: 1,
        content_type: 5,
        content_title: '测试标题',
        content_text: '测试内容正文'
      };

      const { error } = createContentSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].path).toContain('content_type');
    });

    test('标题长度验证', () => {
      const shortTitle = {
        category_id: 1,
        content_type: 1,
        content_title: '短',
        content_text: '测试内容正文'
      };

      const { error: shortError } = createContentSchema.validate(shortTitle);
      expect(shortError).toBeDefined();

      const longTitle = {
        category_id: 1,
        content_type: 1,
        content_title: 'a'.repeat(201),
        content_text: '测试内容正文'
      };

      const { error: longError } = createContentSchema.validate(longTitle);
      expect(longError).toBeDefined();
    });
  });

  describe('createCommentSchema 验证', () => {
    test('有效的评论数据应该通过验证', () => {
      const validData = {
        comment_text: '这是一条测试评论',
        parent_id: 0
      };

      const { error } = createCommentSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    test('空的评论内容应该验证失败', () => {
      const invalidData = {
        comment_text: '',
        parent_id: 0
      };

      const { error } = createCommentSchema.validate(invalidData);
      expect(error).toBeDefined();
    });

    test('评论内容长度验证', () => {
      const longComment = {
        comment_text: 'a'.repeat(501),
        parent_id: 0
      };

      const { error } = createCommentSchema.validate(longComment);
      expect(error).toBeDefined();
    });
  });

  describe('paginationSchema 验证', () => {
    test('有效的分页参数应该通过验证', () => {
      const validData = {
        page: 1,
        limit: 20,
        sort: 'latest',
        category_id: 1,
        content_type: 1
      };

      const { error } = paginationSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    test('无效的排序参数应该验证失败', () => {
      const invalidData = {
        page: 1,
        limit: 20,
        sort: 'invalid_sort'
      };

      const { error } = paginationSchema.validate(invalidData);
      expect(error).toBeDefined();
    });

    test('超出范围的 limit 应该验证失败', () => {
      const invalidData = {
        page: 1,
        limit: 200
      };

      const { error } = paginationSchema.validate(invalidData);
      expect(error).toBeDefined();
    });

    test('默认值应该正确设置', () => {
      const { error, value } = paginationSchema.validate({});
      expect(error).toBeUndefined();
      expect(value.page).toBe(1);
      expect(value.limit).toBe(20);
      expect(value.sort).toBe('latest');
    });
  });

  describe('followUserSchema 验证', () => {
    test('有效的关注数据应该通过验证', () => {
      const validData = {
        followed_id: 2,
        follow_source: 1
      };

      const { error } = followUserSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    test('缺少 followed_id 应该验证失败', () => {
      const invalidData = {
        follow_source: 1
      };

      const { error } = followUserSchema.validate(invalidData);
      expect(error).toBeDefined();
    });
  });

  describe('createReportSchema 验证', () => {
    test('有效的举报数据应该通过验证', () => {
      const validData = {
        report_type: 1,
        report_obj_id: 123,
        report_reason: 1,
        report_detail: '测试举报内容',
        is_anonymous: false
      };

      const { error } = createReportSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    test('无效的 report_type 应该验证失败', () => {
      const invalidData = {
        report_type: 5,
        report_obj_id: 123,
        report_reason: 1
      };

      const { error } = createReportSchema.validate(invalidData);
      expect(error).toBeDefined();
    });
  });

  describe('validate 中间件', () => {
    test('有效数据应该调用 next()', () => {
      const req = mockRequest({
        category_id: 1,
        content_type: 1,
        content_title: '测试标题测试',
        content_text: '测试内容正文测试内容'
      });
      const res = mockResponse();
      const middleware = validate(createContentSchema);

      middleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('无效数据应该返回 400 错误', () => {
      const req = mockRequest({
        category_id: 1
      });
      const res = mockResponse();
      const middleware = validate(createContentSchema);

      middleware(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 400,
          message: '参数验证失败',
          errors: expect.any(Array)
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('validateQuery 中间件', () => {
    test('有效查询参数应该调用 next()', () => {
      const req = mockRequest({}, {
        page: '1',
        limit: '20',
        sort: 'latest'
      });
      const res = mockResponse();
      const middleware = validateQuery(paginationSchema);

      middleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
      expect(req.query.page).toBe(1);
      expect(req.query.limit).toBe(20);
    });

    test('无效查询参数应该返回 400 错误', () => {
      const req = mockRequest({}, {
        page: '0',
        limit: '20'
      });
      const res = mockResponse();
      const middleware = validateQuery(paginationSchema);

      middleware(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 400,
          message: '参数验证失败',
          errors: expect.any(Array)
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
