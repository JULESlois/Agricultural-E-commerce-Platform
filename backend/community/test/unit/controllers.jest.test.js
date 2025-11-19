const contentController = require('../../controllers/contentController');
const categoryController = require('../../controllers/categoryController');

// 模拟 Express 的 req, res, next
const mockRequest = (params = {}, query = {}, body = {}, user = null) => ({
  params,
  query,
  body,
  user
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

// Mock Sequelize models
jest.mock('../../models', () => {
  const mockSequelize = {
    literal: jest.fn((sql) => sql),
    transaction: jest.fn(() => ({
      commit: jest.fn(),
      rollback: jest.fn()
    }))
  };

  return {
    Content: {
      findAll: jest.fn(),
      findByPk: jest.fn(),
      findOne: jest.fn(),
      findAndCountAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn()
    },
    Category: {
      findAll: jest.fn(),
      findByPk: jest.fn()
    },
    Comment: {
      findAll: jest.fn(),
      create: jest.fn(),
      count: jest.fn()
    },
    Like: {
      findOne: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn(),
      count: jest.fn()
    },
    Collect: {
      findOne: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn()
    },
    Follow: {
      findOne: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn()
    },
    Tag: {
      findAll: jest.fn()
    },
    sequelize: mockSequelize
  };
});

describe('Controllers 单元测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ContentController', () => {
    describe('getContentList', () => {
      test('应该返回内容列表', async () => {
        const { Content } = require('../../models');
        
        const mockContents = [
          {
            content_id: 1,
            content_title: '测试标题',
            content_cover: null,
            view_count: 10,
            like_count: 5,
            comment_count: 2,
            author_id: 1,
            category: {
              category_name: '测试分类'
            }
          }
        ];

        Content.findAndCountAll.mockResolvedValue({
          count: 1,
          rows: mockContents
        });

        const req = mockRequest({}, { page: 1, limit: 20, sort: 'latest' });
        const res = mockResponse();

        await contentController.getContentList(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            code: 200,
            message: expect.any(String),
            data: expect.any(Array)
          })
        );
      });

      test('应该支持分类筛选', async () => {
        const { Content } = require('../../models');
        
        Content.findAndCountAll.mockResolvedValue({
          count: 0,
          rows: []
        });

        const req = mockRequest({}, { category_id: 101 });
        const res = mockResponse();

        await contentController.getContentList(req, res, mockNext);

        expect(Content.findAndCountAll).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              category_id: 101,
              audit_status: 1,
              is_deleted: 0
            })
          })
        );
      });
    });

    describe('getContentDetail', () => {
      test('应该返回内容详情', async () => {
        const { Content } = require('../../models');
        
        const mockContent = {
          content_id: 1,
          content_title: '测试标题',
          content_text: '测试内容',
          author_id: 1,
          audit_status: 1,
          is_deleted: 0,
          category: {
            category_id: 1,
            category_name: '测试分类'
          },
          increment: jest.fn().mockResolvedValue(true),
          reload: jest.fn().mockResolvedValue(true),
          toJSON: jest.fn().mockReturnValue({
            content_id: 1,
            content_title: '测试标题',
            content_text: '测试内容',
            author_id: 1
          })
        };

        Content.findOne.mockResolvedValue(mockContent);

        const req = mockRequest({ content_id: 1 });
        const res = mockResponse();

        await contentController.getContentDetail(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(mockContent.increment).toHaveBeenCalledWith('view_count');
      });

      test('内容不存在时应该返回 404', async () => {
        const { Content } = require('../../models');
        
        Content.findOne.mockResolvedValue(null);

        const req = mockRequest({ content_id: 999 });
        const res = mockResponse();

        await contentController.getContentDetail(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            code: 404,
            message: expect.stringContaining('不存在')
          })
        );
      });
    });

    describe('likeContent', () => {
      test('应该成功点赞内容', async () => {
        const { Content, Like } = require('../../models');
        
        const mockContent = {
          content_id: 1,
          like_count: 5,
          increment: jest.fn().mockResolvedValue(true),
          reload: jest.fn().mockImplementation(function() {
            this.like_count = 6;
            return Promise.resolve(this);
          })
        };

        Content.findByPk.mockResolvedValue(mockContent);
        Like.findOne.mockResolvedValue(null);
        Like.create.mockResolvedValue({ like_id: 1 });

        const req = mockRequest(
          { content_id: '1' },
          {},
          {},
          { user_id: 1 }
        );
        const res = mockResponse();

        await contentController.likeContent(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(Like.create).toHaveBeenCalledWith({
          content_id: '1',
          user_id: 1
        });
        expect(mockContent.increment).toHaveBeenCalledWith('like_count');
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            code: 200,
            data: expect.objectContaining({
              current_like_count: 6
            })
          })
        );
      });

      test('重复点赞应该返回错误', async () => {
        const { Content, Like } = require('../../models');
        
        const mockContent = { content_id: 1 };
        const existingLike = { like_id: 1 };

        Content.findByPk.mockResolvedValue(mockContent);
        Like.findOne.mockResolvedValue(existingLike);

        const req = mockRequest(
          { content_id: '1' },
          {},
          {},
          { user_id: 1 }
        );
        const res = mockResponse();

        await contentController.likeContent(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            code: 400,
            message: expect.stringContaining('点赞')
          })
        );
      });
    });
  });

  describe('CategoryController', () => {
    describe('getCategoryTree', () => {
      test('应该返回分类树', async () => {
        const { Category } = require('../../models');
        
        const mockCategories = [
          { category_id: 1, parent_id: 0, category_name: '种植技术' },
          { category_id: 101, parent_id: 1, category_name: '小麦种植' }
        ];

        Category.findAll.mockResolvedValue(mockCategories);

        const req = mockRequest();
        const res = mockResponse();

        await categoryController.getCategoryTree(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            code: 200,
            data: expect.any(Array)
          })
        );
        expect(Category.findAll).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { is_enabled: 1 }
          })
        );
      });
    });
  });
});
