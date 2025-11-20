/**
 * 社区模块 API 全面测试脚本
 * 测试所有重构后的 API 接口
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3004/api/community';
const ADMIN_URL = 'http://localhost:3004/api/admin/community';

// 模拟的 JWT token（实际使用时需要真实的 token）
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX25hbWUiOiJ0ZXN0X3VzZXIiLCJpYXQiOjE2MzAwMDAwMDB9.test';

// 创建 axios 实例
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${TEST_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

const adminApi = axios.create({
  baseURL: ADMIN_URL,
  headers: {
    'Authorization': `Bearer ${TEST_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// 测试结果统计
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
};

// 测试辅助函数
async function test(name, fn) {
  results.total++;
  try {
    console.log(`\n🧪 测试: ${name}`);
    await fn();
    results.passed++;
    console.log(`✅ 通过: ${name}`);
  } catch (error) {
    results.failed++;
    const errorMsg = error.response?.data?.message || error.message;
    console.log(`❌ 失败: ${name}`);
    console.log(`   错误: ${errorMsg}`);
    results.errors.push({ name, error: errorMsg });
  }
}

// 主测试函数
async function runTests() {
  console.log('🚀 开始测试社区模块 API...\n');
  console.log('=' .repeat(60));

  // ========== 1. 分类和标签测试 ==========
  console.log('\n📁 分类和标签测试');
  console.log('-'.repeat(60));

  await test('获取分类树', async () => {
    const res = await axios.get(`${BASE_URL}/categories/tree`);
    if (res.data.code !== 200) throw new Error('返回码不正确');
    if (!Array.isArray(res.data.data)) throw new Error('数据格式不正确');
  });

  await test('搜索标签', async () => {
    const res = await axios.get(`${BASE_URL}/tags?keyword=小麦`);
    if (res.data.code !== 200) throw new Error('返回码不正确');
    if (!Array.isArray(res.data.data)) throw new Error('数据格式不正确');
  });

  // ========== 2. 内容测试 ==========
  console.log('\n📝 内容测试');
  console.log('-'.repeat(60));

  let testContentId;

  await test('发布内容', async () => {
    const res = await api.post('/content', {
      category_id: 1,
      content_type: 1,
      content_title: '测试标题 - 小麦种植技术分享',
      content_text: '这是一篇测试内容，介绍小麦种植的相关技术和经验。',
      tag_ids: [1, 2]
    });
    if (res.data.code !== 201) throw new Error('返回码不正确');
    testContentId = res.data.data.content_id;
    console.log(`   创建的内容ID: ${testContentId}`);
  });

  await test('获取内容列表', async () => {
    const res = await axios.get(`${BASE_URL}/content?page=1&limit=10`);
    if (res.data.code !== 200) throw new Error('返回码不正确');
    if (!Array.isArray(res.data.data)) throw new Error('数据格式不正确');
  });

  if (testContentId) {
    await test('获取内容详情', async () => {
      const res = await axios.get(`${BASE_URL}/content/${testContentId}`);
      if (res.data.code !== 200) throw new Error('返回码不正确');
      if (!res.data.data.content_id) throw new Error('数据格式不正确');
    });

    await test('发布评论', async () => {
      const res = await api.post(`/content/${testContentId}/comments`, {
        comment_text: '这是一条测试评论'
      });
      if (res.data.code !== 201) throw new Error('返回码不正确');
    });

    await test('点赞内容', async () => {
      const res = await api.post(`/content/${testContentId}/like`);
      if (res.data.code !== 201) throw new Error('返回码不正确');
    });

    await test('取消点赞', async () => {
      const res = await api.delete(`/content/${testContentId}/like`);
      if (res.status !== 204) throw new Error('返回码不正确');
    });

    await test('收藏内容', async () => {
      const res = await api.post(`/content/${testContentId}/collect`);
      if (res.data.code !== 201) throw new Error('返回码不正确');
    });

    await test('取消收藏', async () => {
      const res = await api.delete(`/content/${testContentId}/collect`);
      if (res.status !== 204) throw new Error('返回码不正确');
    });
  }

  // ========== 3. 关注测试 ==========
  console.log('\n👥 关注测试');
  console.log('-'.repeat(60));

  await test('关注用户', async () => {
    const res = await api.post('/follows', {
      followed_id: 2
    });
    if (res.data.code !== 201) throw new Error('返回码不正确');
  });

  await test('获取关注列表', async () => {
    const res = await axios.get(`${BASE_URL}/users/1/following`);
    if (res.data.code !== 200) throw new Error('返回码不正确');
    if (!Array.isArray(res.data.data)) throw new Error('数据格式不正确');
  });

  await test('获取粉丝列表', async () => {
    const res = await axios.get(`${BASE_URL}/users/2/followers`);
    if (res.data.code !== 200) throw new Error('返回码不正确');
    if (!Array.isArray(res.data.data)) throw new Error('数据格式不正确');
  });

  await test('取消关注', async () => {
    const res = await api.delete('/follows/2');
    if (res.status !== 204) throw new Error('返回码不正确');
  });

  // ========== 4. 黑名单测试 ==========
  console.log('\n🚫 黑名单测试');
  console.log('-'.repeat(60));

  await test('拉黑用户', async () => {
    const res = await api.post('/blacklist', {
      blacked_user_id: 3,
      black_reason: '测试拉黑'
    });
    if (res.data.code !== 201) throw new Error('返回码不正确');
  });

  await test('移除黑名单', async () => {
    const res = await api.delete('/blacklist/3');
    if (res.status !== 204) throw new Error('返回码不正确');
  });

  // ========== 5. 举报测试 ==========
  console.log('\n🚨 举报测试');
  console.log('-'.repeat(60));

  let testReportId;

  if (testContentId) {
    await test('提交举报', async () => {
      const res = await api.post('/reports', {
        report_type: 1,
        report_obj_id: testContentId,
        report_reason: 1,
        report_detail: '测试举报内容',
        is_anonymous: false
      });
      if (res.data.code !== 201) throw new Error('返回码不正确');
    });
  }

  await test('获取举报列表', async () => {
    const res = await adminApi.get('/reports?page=1&limit=10');
    if (res.data.code !== 200) throw new Error('返回码不正确');
    if (!Array.isArray(res.data.data)) throw new Error('数据格式不正确');
    if (res.data.data.length > 0) {
      testReportId = res.data.data[0].report_id;
    }
  });

  // ========== 6. 问答测试 ==========
  console.log('\n❓ 问答测试');
  console.log('-'.repeat(60));

  let testQuestionId;
  let testAnswerId;

  await test('发布问题', async () => {
    const res = await api.post('/content', {
      category_id: 1,
      content_type: 3,
      content_title: '测试问题 - 小麦如何防治病虫害？',
      content_text: '请问小麦种植过程中如何有效防治病虫害？',
      reward_amount: 10.00
    });
    if (res.data.code !== 201) throw new Error('返回码不正确');
    testQuestionId = res.data.data.content_id;
    console.log(`   创建的问题ID: ${testQuestionId}`);
  });

  if (testQuestionId) {
    await test('回答问题', async () => {
      const res = await api.post(`/content/${testQuestionId}/comments`, {
        comment_text: '可以使用生物防治和化学防治相结合的方法。'
      });
      if (res.data.code !== 201) throw new Error('返回码不正确');
      testAnswerId = res.data.data.comment_id;
    });

    if (testAnswerId) {
      await test('采纳最佳答案', async () => {
        const res = await api.post(`/content/${testQuestionId}/best-answer`, {
          comment_id: testAnswerId
        });
        if (res.data.code !== 200) throw new Error('返回码不正确');
      });

      await test('取消最佳答案', async () => {
        const res = await api.delete(`/content/${testQuestionId}/best-answer`);
        if (res.data.code !== 200) throw new Error('返回码不正确');
      });
    }
  }

  // ========== 测试总结 ==========
  console.log('\n' + '='.repeat(60));
  console.log('📊 测试总结');
  console.log('='.repeat(60));
  console.log(`总测试数: ${results.total}`);
  console.log(`✅ 通过: ${results.passed}`);
  console.log(`❌ 失败: ${results.failed}`);
  console.log(`成功率: ${((results.passed / results.total) * 100).toFixed(2)}%`);

  if (results.errors.length > 0) {
    console.log('\n失败的测试:');
    results.errors.forEach((err, index) => {
      console.log(`${index + 1}. ${err.name}: ${err.error}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  
  // 退出码
  process.exit(results.failed > 0 ? 1 : 0);
}

// 运行测试
runTests().catch(error => {
  console.error('测试运行失败:', error);
  process.exit(1);
});
