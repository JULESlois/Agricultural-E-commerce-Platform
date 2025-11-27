const { Pool } = require('pg');
require('dotenv').config();

// 创建数据库连接池
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// 测试连接
pool.on('connect', () => {
  console.log('数据库连接成功');
});

pool.on('error', (err) => {
  console.error('数据库连接错误:', err);
});

/**
 * 保存预测结果到数据库
 */
async function savePrediction(data) {
  const {
    productName,
    productCategory,
    region,
    predictionType,
    predictionDate,
    periodNumber,
    predictedPrice,
    confidenceLower,
    confidenceUpper,
    modelType,
    accuracyScore
  } = data;

  const query = `
    INSERT INTO price_predictions (
      product_name, product_category, region, prediction_type,
      prediction_date, period_number, predicted_price,
      confidence_lower, confidence_upper, model_type, accuracy_score,
      updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP)
    ON CONFLICT (product_name, region, prediction_type, prediction_date, period_number, model_type)
    DO UPDATE SET
      predicted_price = EXCLUDED.predicted_price,
      confidence_lower = EXCLUDED.confidence_lower,
      confidence_upper = EXCLUDED.confidence_upper,
      accuracy_score = EXCLUDED.accuracy_score,
      updated_at = CURRENT_TIMESTAMP
    RETURNING id;
  `;

  const values = [
    productName,
    productCategory,
    region,
    predictionType,
    predictionDate,
    periodNumber,
    predictedPrice,
    confidenceLower,
    confidenceUpper,
    modelType,
    accuracyScore
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * 批量保存预测结果
 */
async function savePredictionBatch(predictions) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const results = [];
    for (const prediction of predictions) {
      const result = await savePrediction(prediction);
      results.push(result);
    }
    
    await client.query('COMMIT');
    return results;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * 创建预测任务日志
 */
async function createPredictionLog(taskName) {
  const query = `
    INSERT INTO prediction_logs (task_name, start_time, status)
    VALUES ($1, CURRENT_TIMESTAMP, 'running')
    RETURNING id;
  `;
  
  const result = await pool.query(query, [taskName]);
  return result.rows[0].id;
}

/**
 * 更新预测任务日志
 */
async function updatePredictionLog(logId, data) {
  const {
    status,
    productsCount,
    predictionsCount,
    errorMessage
  } = data;

  const query = `
    UPDATE prediction_logs
    SET end_time = CURRENT_TIMESTAMP,
        status = $1,
        products_count = $2,
        predictions_count = $3,
        error_message = $4
    WHERE id = $5;
  `;

  await pool.query(query, [
    status,
    productsCount || 0,
    predictionsCount || 0,
    errorMessage || null,
    logId
  ]);
}

/**
 * 获取最新预测结果
 */
async function getLatestPredictions(productName, region = 'national') {
  const query = `
    SELECT * FROM price_predictions
    WHERE product_name = $1 AND region = $2
    ORDER BY prediction_date DESC, period_number ASC
    LIMIT 3;
  `;
  
  const result = await pool.query(query, [productName, region]);
  return result.rows;
}

module.exports = {
  pool,
  savePrediction,
  savePredictionBatch,
  createPredictionLog,
  updatePredictionLog,
  getLatestPredictions
};
