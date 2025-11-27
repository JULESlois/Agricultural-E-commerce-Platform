const cron = require('node-cron');
const { executePredictionTask } = require('./run-prediction');
require('dotenv').config();

console.log('='.repeat(60));
console.log('农产品价格自动预测服务');
console.log('='.repeat(60));
console.log(`启动时间: ${new Date().toLocaleString('zh-CN')}`);
console.log(`定时规则: ${process.env.CRON_SCHEDULE || '0 2 * * *'} (每天凌晨2点)`);
console.log(`预测期数: ${process.env.PREDICTION_PERIODS || 3}`);
console.log(`预测模型: ARIMA + LSTM (两种模型)`);
console.log('='.repeat(60));

/**
 * 执行预测任务的包装函数
 */
async function runTask() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`定时任务触发: ${new Date().toLocaleString('zh-CN')}`);
  console.log('='.repeat(60));

  try {
    await executePredictionTask();
    console.log('\n✓ 定时任务执行成功');
  } catch (error) {
    console.error('\n✗ 定时任务执行失败:', error.message);
  }

  console.log('='.repeat(60));
}

// 设置定时任务
const cronSchedule = process.env.CRON_SCHEDULE || '0 2 * * *';

// 验证 cron 表达式
if (!cron.validate(cronSchedule)) {
  console.error(`错误: 无效的 cron 表达式: ${cronSchedule}`);
  process.exit(1);
}

// 启动定时任务
const task = cron.schedule(cronSchedule, runTask, {
  scheduled: true,
  timezone: "Asia/Shanghai"
});

console.log('\n✓ 定时任务已启动');
console.log('按 Ctrl+C 停止服务\n');

// 如果设置了立即执行标志，启动时执行一次
if (process.env.RUN_ON_START === 'true') {
  console.log('启动时立即执行一次预测任务...\n');
  runTask().catch(err => {
    console.error('启动任务执行失败:', err);
  });
}

// 优雅退出
process.on('SIGINT', () => {
  console.log('\n\n正在停止服务...');
  task.stop();
  console.log('服务已停止');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n正在停止服务...');
  task.stop();
  console.log('服务已停止');
  process.exit(0);
});
