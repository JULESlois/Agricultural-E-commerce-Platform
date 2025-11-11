/**
 * API 接口测试脚本
 * 运行: node test-api.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:3003';

// 辅助函数：发送 HTTP 请求
function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// 测试用例
async function runTests() {
  console.log('=================================');
  console.log('社区模块 API 测试');
  console.log('=================================');
  console.log(`服务地址: ${BASE_URL}`);
  console.log('=================================\n');

  let passCount = 0;
  let failCount = 0;

  // 测试 1: 健康检查
  try {
    console.log('测试 1: 健康检查');
    const res = await request('GET', '/');
    if (res.status === 200 && res.data.status === 'running') {
      console.log('✓ 通过 - 服务正常运行\n');
      passCount++;
    } else {
      console.log('✗ 失败 - 服务状态异常\n');
      failCount++;
    }
  } catch (error) {
    console.log('✗ 失败 -', error.message, '\n');
    failCount++;
  }

  // 测试 2: 获取分类树
  try {
    console.log('测试 2: 获取分类树');
    const res = await request('GET', '/api/community/categories/tree');
    if (res.status === 200 && res.data.code === 200 && Array.isArray(res.data.data)) {
      console.log(`✓ 通过 - 获取到 ${res.data.data.length} 个顶级分类`);
      console.log(`  示例: ${res.data.data[0]?.category_name}\n`);
      passCount++;
    } else {
      console.log('✗ 失败 - 响应格式错误\n');
      failCount++;
    }
  } catch (error) {
    console.log('✗ 失败 -', error.message, '\n');
    failCount++;
  }

  // 测试 3: 搜索标签
  try {
    console.log('测试 3: 搜索标签（关键词: 小麦）');
    const res = await request('GET', '/api/community/tags?keyword=小麦');
    if (res.status === 200 && res.data.code === 200 && Array.isArray(res.data.data)) {
      console.log(`✓ 通过 - 找到 ${res.data.data.length} 个标签`);
      res.data.data.forEach(tag => {
        console.log(`  - ${tag.tag_name}`);
      });
      console.log();
      passCount++;
    } else {
      console.log('✗ 失败 - 响应格式错误\n');
      failCount++;
    }
  } catch (error) {
    console.log('✗ 失败 -', error.message, '\n');
    failCount++;
  }

  // 测试 4: 获取内容列表（无需认证）
  try {
    console.log('测试 4: 获取内容列表');
    const res = await request('GET', '/api/community/content?page=1&limit=5');
    if (res.status === 200 && res.data.code === 200 && Array.isArray(res.data.data)) {
      console.log(`✓ 通过 - 获取到 ${res.data.data.length} 条内容\n`);
      passCount++;
    } else {
      console.log('✗ 失败 - 响应格式错误\n');
      failCount++;
    }
  } catch (error) {
    console.log('✗ 失败 -', error.message, '\n');
    failCount++;
  }

  // 测试 5: 测试需要认证的接口（预期失败）
  try {
    console.log('测试 5: 发布内容（无认证 - 预期返回401）');
    const res = await request('POST', '/api/community/content', {
      category_id: 101,
      content_type: 1,
      content_title: '测试标题',
      content_text: '测试内容'
    });
    if (res.status === 401) {
      console.log('✓ 通过 - 正确返回401未授权\n');
      passCount++;
    } else {
      console.log('✗ 失败 - 应该返回401\n');
      failCount++;
    }
  } catch (error) {
    console.log('✗ 失败 -', error.message, '\n');
    failCount++;
  }

  // 测试 6: 测试不存在的路由
  try {
    console.log('测试 6: 访问不存在的路由');
    const res = await request('GET', '/api/community/nonexistent');
    if (res.status === 404) {
      console.log('✓ 通过 - 正确返回404\n');
      passCount++;
    } else {
      console.log('✗ 失败 - 应该返回404\n');
      failCount++;
    }
  } catch (error) {
    console.log('✗ 失败 -', error.message, '\n');
    failCount++;
  }

  // 测试总结
  console.log('=================================');
  console.log('测试总结');
  console.log('=================================');
  console.log(`总测试数: ${passCount + failCount}`);
  console.log(`✓ 通过: ${passCount}`);
  console.log(`✗ 失败: ${failCount}`);
  console.log('=================================');

  if (failCount === 0) {
    console.log('\n🎉 所有测试通过！');
  } else {
    console.log('\n⚠️  部分测试失败，请检查日志');
  }
}

// 运行测试
runTests().catch(error => {
  console.error('测试执行失败:', error);
  process.exit(1);
});
