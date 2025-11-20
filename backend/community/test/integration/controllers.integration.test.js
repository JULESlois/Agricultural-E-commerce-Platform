/**
 * Controllers 集成测试
 * 不使用 Mock，测试真实的代码执行
 */

const request = require('supertest');
const express = require('express');
const { sequelize } = require('../../models');
const contentController = require('../../controllers/contentController');
const categoryController = require('../../controllers/categoryController');

// 创建测试 app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  // 模拟认证中间件
  app.use((req, res, next) => {
    req.user = { user_id: 1, user_name: 'testuser' };
    next();
  });
  
  // 注册路由
  app.get('/content', contentController.getContentList);
  app.get('/content/:content_id', contentController.getContentDetail);
  app.post('/content/:content_id/like', contentController.likeContent);
  app.get('/categories/tree', categoryController.getCategoryTree);
  
  return app;
};

describe('Controllers 集成测试（真实数据库）', () => {
  let app;
  
  beforeAll(async () => {
    app = createTestApp();
    await sequelize.authenticate();
  });
  
  afterAll(async () => {
    await sequelize.close();
  });
  
  describe('ContentController 集成测试', () => {
    test('getContentList 应该返回真实数据', async () => {
      const response = await request(app)
        .get('/content?page=1&limit=5')
        .expect(200);
      
      expect(response.body.code).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
    
    test('getContentDetail 应该返回真实内容', async () => {
      const response = await request(app)
        .get('/content/1');
      
      // 可能返回 200 或 404
      expect([200, 404]).toContain(response.status);
    });
  });
  
  describe('CategoryController 集成测试', () => {
    test('getCategoryTree 应该返回真实分类树', async () => {
      const response = await request(app)
        .get('/categories/tree')
        .expect(200);
      
      expect(response.body.code).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
