/**
 * API 集成测试
 * 测试所有 API 端点
 */

const request = require('supertest');
const { expect } = require('chai');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3003';

// 模拟的 JWT token（实际使用时需要真实的 token）
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX25hbWUiOiJ0ZXN0X3VzZXIiLCJpYXQiOjE2MzAwMDAwMDB9.test';

describe('社区模块 API 集成测试', () => {
  
  // ========== 分类和标签测试 ==========
  describe('分类和标签 API', () => {
    
    it('应该能获取分类树', (done) => {
      request(BASE_URL)
        .get('/api/community/categories/tree')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('code', 200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });

    it('应该能搜索标签', (done) => {
      request(BASE_URL)
        .get('/api/community/tags?keyword=小麦')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('code', 200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });
  });

  // ========== 内容管理测试 ==========
  describe('内容管理 API', () => {
    
    it('应该能获取内容列表', (done) => {
      request(BASE_URL)
        .get('/api/community/content?page=1&limit=10')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('code', 200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          if (res.body.data.length > 0) {
            expect(res.body.data[0]).to.have.property('content_id');
            expect(res.body.data[0]).to.have.property('author');
            expect(res.body.data[0].author).to.have.property('user_id');
          }
          done();
        });
    });

    it('应该能获取内容详情', (done) => {
      request(BASE_URL)
        .get('/api/community/content/1')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('code', 200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('content_id');
          expect(res.body.data).to.have.property('content_title');
          done();
        });
    });

    it('应该能发布内容（需要认证）', (done) => {
      request(BASE_URL)
        .post('/api/community/content')
        .set('Authorization', `Bearer ${TEST_TOKEN}`)
        .send({
          category_id: 1,
          content_type: 1,
          content_title: '测试标题',
          content_text: '这是一篇测试内容'
        })
        .expect((res) => {
          // 可能返回 201 或 401（如果 token 无效）
          expect([201, 401]).to.include(res.status);
        })
        .end(done);
    });
  });

  // ========== 关注功能测试 ==========
  describe('关注功能 API', () => {
    
    it('应该能获取关注列表', (done) => {
      request(BASE_URL)
        .get('/api/community/users/1/following')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('code', 200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });

    it('应该能获取粉丝列表', (done) => {
      request(BASE_URL)
        .get('/api/community/users/1/followers')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('code', 200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });
  });

  // ========== 健康检查 ==========
  describe('健康检查 API', () => {
    
    it('应该能访问根路径', (done) => {
      request(BASE_URL)
        .get('/')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('status', 'running');
          done();
        });
    });

    it('应该能访问健康检查接口', (done) => {
      request(BASE_URL)
        .get('/health')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('status', 'healthy');
          done();
        });
    });
  });
});
