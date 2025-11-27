const { pool } = require('./db-client');
require('dotenv').config();

/**
 * 查询最新的预测结果
 */
async function queryLatestPredictions(limit = 30) {
  const query = `
    SELECT 
      product_name,
      product_category,
      prediction_date,
      period_number,
      predicted_price,
      confidence_lower,
      confidence_upper,
      model_type,
      created_at
    FROM price_predictions
    ORDER BY prediction_date DESC, product_name, model_type, period_number
    LIMIT $1;
  `;
  
  const result = await pool.query(query, [limit]);
  return result.rows;
}

/**
 * 查询指定产品的预测
 */
async function queryProductPredictions(productName) {
  const query = `
    SELECT 
      prediction_date,
      period_number,
      predicted_price,
      confidence_lower,
      confidence_upper,
      model_type,
      accuracy_score,
      created_at
    FROM price_predictions
    WHERE product_name = $1
    ORDER BY prediction_date DESC, period_number;
  `;
  
  const result = await pool.query(query, [productName]);
  return result.rows;
}

/**
 * 查询任务执行日志
 */
async function queryTaskLogs(limit = 10) {
  const query = `
    SELECT 
      id,
      task_name,
      start_time,
      end_time,
      status,
      products_count,
      predictions_count,
      error_message,
      EXTRACT(EPOCH FROM (end_time - start_time)) as duration_seconds
    FROM prediction_logs
    ORDER BY start_time DESC
    LIMIT $1;
  `;
  
  const result = await pool.query(query, [limit]);
  return result.rows;
}

/**
 * 统计预测数据
 */
async function getStatistics() {
  const queries = {
    totalPredictions: 'SELECT COUNT(*) as count FROM price_predictions',
    totalProducts: 'SELECT COUNT(DISTINCT product_name) as count FROM price_predictions',
    latestDate: 'SELECT MAX(prediction_date) as date FROM price_predictions',
    totalTasks: 'SELECT COUNT(*) as count FROM prediction_logs',
    successTasks: "SELECT COUNT(*) as count FROM prediction_logs WHERE status = 'success'",
    failedTasks: "SELECT COUNT(*) as count FROM prediction_logs WHERE status = 'failed'"
  };

  const stats = {};
  
  for (const [key, query] of Object.entries(queries)) {
    const result = await pool.query(query);
    stats[key] = result.rows[0].count || result.rows[0].date;
  }

  return stats;
}

/**
 * 显示查询结果
 */
async function displayResults() {
  console.log('='.repeat(80));
  console.log('农产品价格预测数据查询');
  console.log('='.repeat(80));

  try {
    // 统计信息
    console.log('\n【统计信息】');
    const stats = await getStatistics();
    console.log(`总预测记录数: ${stats.totalPredictions}`);
    console.log(`预测产品数: ${stats.totalProducts}`);
    console.log(`最新预测日期: ${stats.latestDate || '无'}`);
    console.log(`总任务数: ${stats.totalTasks}`);
    console.log(`成功任务: ${stats.successTasks}`);
    console.log(`失败任务: ${stats.failedTasks}`);

    // 最新预测结果
    console.log('\n【最新预测结果】（前30条）');
    const predictions = await queryLatestPredictions(30);
    
    if (predictions.length === 0) {
      console.log('暂无预测数据');
    } else {
      console.log('-'.repeat(100));
      console.log('产品名称\t类别\t\t预测日期\t期数\t模型\t预测价格\t置信区间');
      console.log('-'.repeat(100));
      
      predictions.forEach(p => {
        const category = (p.product_category || '').padEnd(8, ' ');
        const confidence = (p.confidence_lower != null && p.confidence_upper != null)
          ? `[${Number(p.confidence_lower).toFixed(2)}, ${Number(p.confidence_upper).toFixed(2)}]`
          : 'N/A';
        
        const price = p.predicted_price != null ? Number(p.predicted_price).toFixed(2) : 'N/A';
        
        console.log(
          `${p.product_name}\t${category}\t${p.prediction_date.toISOString().split('T')[0]}\t` +
          `${p.period_number}\t${p.model_type}\t${price}\t\t${confidence}`
        );
      });
    }

    // 任务执行日志
    console.log('\n【任务执行日志】（最近10次）');
    const logs = await queryTaskLogs(10);
    
    if (logs.length === 0) {
      console.log('暂无任务日志');
    } else {
      console.log('-'.repeat(80));
      console.log('ID\t开始时间\t\t\t状态\t产品数\t预测数\t耗时(秒)');
      console.log('-'.repeat(80));
      
      logs.forEach(log => {
        const startTime = new Date(log.start_time).toLocaleString('zh-CN');
        const duration = (log.duration_seconds != null && !isNaN(log.duration_seconds)) 
          ? Number(log.duration_seconds).toFixed(1) 
          : 'N/A';
        
        console.log(
          `${log.id}\t${startTime}\t${log.status}\t${log.products_count}\t` +
          `${log.predictions_count}\t${duration}`
        );
        
        if (log.error_message) {
          console.log(`   错误: ${log.error_message}`);
        }
      });
    }

    console.log('\n' + '='.repeat(80));

  } catch (error) {
    console.error('查询失败:', error);
  } finally {
    await pool.end();
  }
}

// 命令行参数处理
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length > 0 && args[0] === '--product') {
    // 查询指定产品
    const productName = args[1];
    if (!productName) {
      console.error('请指定产品名称');
      process.exit(1);
    }
    
    queryProductPredictions(productName)
      .then(results => {
        console.log(`\n产品 "${productName}" 的预测结果:\n`);
        console.log(JSON.stringify(results, null, 2));
        pool.end();
      })
      .catch(err => {
        console.error('查询失败:', err);
        process.exit(1);
      });
  } else {
    // 显示所有结果
    displayResults()
      .then(() => process.exit(0))
      .catch(err => {
        console.error(err);
        process.exit(1);
      });
  }
}

module.exports = {
  queryLatestPredictions,
  queryProductPredictions,
  queryTaskLogs,
  getStatistics
};
