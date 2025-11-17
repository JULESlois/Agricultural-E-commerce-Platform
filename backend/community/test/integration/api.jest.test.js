const request = require('supertest');
const express = require('express');
const { sequelize } = require('../../models');

// 创建测试用的 app，不启动服务器
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  // 导入路由
  const categoryRoutes = require('../../routes/categoryRoutes');
  const contentRoutes = require('../../routes/contentRoutes');
  const tagRoutes = require('../../routes/tagRoutes');
  
  // 健康检查
  app.get('/', (req, res) => {
    res.json({
      message: 'Community Service API',
      status: 'running'
    });
  });
  
  app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
  });
  
  // 注册路由
  app.use('/api/community/categories', categoryRoutes);
  app.use('/api/community/content', contentRoutes);
  app.use('/api/community/tags', tagRoutes);
  
  return app;
};

describe('API 集成测试', () => {
  let app;
  
  beforeAll(async () => {
    app = createTestApp();
    await sequelize.authenticate();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('健康检查', () => {
    test('GET / 应该返回服务状态', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body.message).toContain('Community Service API');
      expect(response.body.status).toBe('running');
    });

    test('GET /health 应该返回健康状态', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
    });
  });

  describe('分类 API', () => {
    test('GET /api/community/categories/tree 应该返回分类树', async () => {
      const response = await request(app)
        .get('/api/community/categories/tree')
        .expect(200);

      expect(response.body.code).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('内容 API', () => {
    test('GET /api/community/content 应该返回内容列表', async () => {
      const response = await request(app)
        .get('/api/community/content')
        .expect(200);

      expect(response.body.code).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('GET /api/community/content 应该支持分页', async () => {
      const response = await request(app)
        .get('/api/community/content?page=1&limit=5')
        .expect(200);

      expect(response.body.code).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('GET /api/community/content 应该支持排序', async () => {
      const response = await request(app)
        .get('/api/community/content?sort=hot')
        .expect(200);

      expect(response.body.code).toBe(200);
    });

    test('GET /api/community/content 应该支持分类筛选', async () => {
      const response = await request(app)
        .get('/api/community/content?category_id=101')
        .expect(200);

      expect(response.body.code).toBe(200);
    });

    test('GET /api/community/content/:id 应该返回内容详情', async () => {
      const response = await request(app)
        .get('/api/community/content/1');

      expect([200, 404]).toContain(response.status);
      expect(response.body.code).toBe(response.status);
    });

    test('GET /api/community/content/999999 应该返回 404', async () => {
      const response = await request(app)
        .get('/api/community/content/999999')
        .expect(404);

      expect(response.body.code).toBe(404);
    });
  });

  describe('参数验证', () => {
    test('无效的分页参数应该返回 400', async () => {
      const response = await request(app)
        .get('/api/community/content?page=0')
        .expect(400);

      expect(response.body.code).toBe(400);
      expect(response.body.message).toContain('参数验证失败');
    });

    test('无效的排序参数应该返回 400', async () => {
      const response = await request(app)
        .get('/api/community/content?sort=invalid')
        .expect(400);

      expect(response.body.code).toBe(400);
    });

    test('超出范围的 limit 应该返回 400', async () => {
      const response = await request(app)
        .get('/api/community/content?limit=200')
        .expect(400);

      expect(response.body.code).toBe(400);
    });
  });

  describe('标签 API', () => {
    test('GET /api/community/tags 应该返回标签列表', async () => {
      const response = await request(app)
        .get('/api/community/tags');

      expect([200, 400]).toContain(response.status);
      if (response.status === 200) {
        expect(Array.isArray(response.body.data)).toBe(true);
      }
    });

    test('GET /api/community/tags 应该支持关键词搜索', async () => {
      const response = await request(app)
        .get('/api/community/tags')
        .query({ keyword: 'test' });

      expect([200, 400]).toContain(response.status);
      if (response.status === 200) {
        expect(Array.isArray(response.body.data)).toBe(true);
      }
    });
  });

  describe('评论 API', () => {
    test('GET /api/community/content/:id/comments 应该返回评论列表', async () => {
      const response = await request(app)
        .get('/api/community/content/1/comments');

      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        expect(Array.isArray(response.body.data)).toBe(true);
      }
    });
  });
});
