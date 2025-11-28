const { 
  getCategories, 
  getProducts, 
  predictProduct,
  runFullPrediction 
} = require('./prediction-service');
const { pool } = require('./db-client');

/**
 * 测试预测服务连接
 */
async function testConnection() {
  console.log('测试预测服务连接...');
  
  try {
    const categories = await getCategories();
    console.log(`✓ 连接成功，找到 ${categories.length} 个类别`);
    return true;
  } catch (error) {
    console.error('✗ 连接失败:', error.message);
    return false;
  }
}

/**
 * 测试单个产品预测
 */
async function testSinglePrediction() {
  console.log('\n测试单个产品预测...');
  
  try {
    const categories = await getCategories();
    if (categories.length === 0) {
      console.log('没有可用的类别');
      return;
    }

    const category = categories[0];
    console.log(`使用类别: ${category}`);

    const products = await getProducts(category);
    if (products.length === 0) {
      console.log('该类别下没有产品');
      return;
    }

    const product = products[0];
    console.log(`测试产品: ${product}`);

    const result = await predictProduct(product, category, 3, 'arima');
    
    if (result && result.predictions) {
      console.log('✓ 预测成功');
      console.log('预测结果:');
      result.predictions.forEach((pred, index) => {
        console.log(`  期数 ${index + 1}: ${pred.value.toFixed(2)}`);
      });
    } else {
      console.log('✗ 预测失败');
    }
  } catch (error) {
    console.error('✗ 测试失败:', error.message);
  }
}

/**
 * 测试数据库连接
 */
async function testDatabase() {
  console.log('\n测试数据库连接...');
  
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✓ 数据库连接成功');
    console.log(`  服务器时间: ${result.rows[0].now}`);
    
    // 检查表是否存在
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('price_predictions', 'prediction_logs')
    `);
    
    console.log(`  找到 ${tableCheck.rows.length} 个预测相关表`);
    tableCheck.rows.forEach(row => {
      console.log(`    - ${row.table_name}`);
    });
    
    return true;
  } catch (error) {
    console.error('✗ 数据库连接失败:', error.message);
    return false;
  }
}

/**
 * 运行所有测试
 */
async function runAllTests() {
  console.log('='.repeat(60));
  console.log('开始测试预测系统');
  console.log('='.repeat(60));

  await testConnection();
  await testDatabase();
  await testSinglePrediction();

  console.log('\n='.repeat(60));
  console.log('测试完成');
  console.log('='.repeat(60));

  await pool.end();
}

// 执行测试
if (require.main === module) {
  runAllTests()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('测试失败:', err);
      process.exit(1);
    });
}

module.exports = { 
  testConnection, 
  testSinglePrediction, 
  testDatabase 
};
