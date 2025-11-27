const { runFullPrediction } = require('./prediction-service');
const { 
  savePredictionBatch, 
  createPredictionLog, 
  updatePredictionLog,
  pool
} = require('./db-client');
require('dotenv').config();

/**
 * 执行一次完整的预测任务
 */
async function executePredictionTask() {
  const taskName = 'daily_price_prediction';
  let logId = null;

  try {
    // 创建任务日志
    logId = await createPredictionLog(taskName);
    console.log(`任务开始 [ID: ${logId}]`);

    // 获取配置参数
    const periods = parseInt(process.env.PREDICTION_PERIODS) || 3;
    
    // 使用两种模型：ARIMA 和 LSTM
    const modelTypes = ['arima', 'lstm'];

    // 执行预测
    const result = await runFullPrediction(periods, modelTypes);

    if (result.predictions && result.predictions.length > 0) {
      console.log(`\n开始保存 ${result.predictions.length} 条预测数据到数据库...`);
      
      // 批量保存到数据库
      await savePredictionBatch(result.predictions);
      
      console.log('✓ 数据保存成功');
    }

    // 更新任务日志为成功
    await updatePredictionLog(logId, {
      status: 'success',
      productsCount: result.productsCount,
      predictionsCount: result.predictionsCount,
      errorMessage: null
    });

    console.log(`\n任务完成 [ID: ${logId}]`);
    console.log(`处理产品数: ${result.productsCount}`);
    console.log(`生成预测数: ${result.predictionsCount}`);

    return result;

  } catch (error) {
    console.error('任务执行失败:', error);

    // 更新任务日志为失败
    if (logId) {
      await updatePredictionLog(logId, {
        status: 'failed',
        productsCount: 0,
        predictionsCount: 0,
        errorMessage: error.message
      });
    }

    throw error;
  } finally {
    // 关闭数据库连接
    await pool.end();
  }
}

// 如果直接运行此文件，执行预测任务
if (require.main === module) {
  executePredictionTask()
    .then(() => {
      console.log('\n预测任务执行成功！');
      process.exit(0);
    })
    .catch(err => {
      console.error('\n预测任务执行失败:', err);
      process.exit(1);
    });
}

module.exports = { executePredictionTask };
