const { pool } = require('./db-client');
require('dotenv').config();

/**
 * 对比 ARIMA 和 LSTM 模型的预测结果
 */
async function compareModels(productName = null, limit = 10) {
  try {
    let query;
    let params;

    if (productName) {
      // 查询指定产品的两种模型对比
      query = `
        SELECT 
          product_name,
          prediction_date,
          period_number,
          model_type,
          predicted_price,
          confidence_lower,
          confidence_upper
        FROM price_predictions
        WHERE product_name = $1
        ORDER BY prediction_date DESC, period_number, model_type;
      `;
      params = [productName];
    } else {
      // 查询最新的预测对比
      query = `
        WITH latest_predictions AS (
          SELECT DISTINCT ON (product_name, period_number, model_type)
            product_name,
            prediction_date,
            period_number,
            model_type,
            predicted_price,
            confidence_lower,
            confidence_upper
          FROM price_predictions
          ORDER BY product_name, period_number, model_type, prediction_date DESC
        )
        SELECT * FROM latest_predictions
        ORDER BY product_name, period_number, model_type
        LIMIT $1;
      `;
      params = [limit * 2]; // 每个产品有两个模型
    }

    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('查询失败:', error);
    return [];
  }
}

/**
 * 显示模型对比结果
 */
async function displayComparison(productName = null) {
  console.log('='.repeat(100));
  console.log('ARIMA vs LSTM 模型预测对比');
  console.log('='.repeat(100));

  const predictions = await compareModels(productName, 10);

  if (predictions.length === 0) {
    console.log('暂无预测数据');
    await pool.end();
    return;
  }

  // 按产品和期数分组
  const grouped = {};
  predictions.forEach(p => {
    const key = `${p.product_name}_${p.period_number}`;
    if (!grouped[key]) {
      grouped[key] = {
        product_name: p.product_name,
        prediction_date: p.prediction_date,
        period_number: p.period_number,
        arima: null,
        lstm: null
      };
    }
    
    const modelType = p.model_type.toLowerCase();
    if (modelType === 'arima') {
      grouped[key].arima = p;
    } else if (modelType === 'lstm') {
      grouped[key].lstm = p;
    }
  });

  console.log('\n产品名称\t\t期数\tARIMA预测\tLSTM预测\t差异\t\t差异率');
  console.log('-'.repeat(100));

  Object.values(grouped).forEach(item => {
    const arimaPrice = item.arima ? Number(item.arima.predicted_price) : null;
    const lstmPrice = item.lstm ? Number(item.lstm.predicted_price) : null;
    
    let diff = 'N/A';
    let diffRate = 'N/A';
    
    if (arimaPrice != null && lstmPrice != null && !isNaN(arimaPrice) && !isNaN(lstmPrice)) {
      const difference = lstmPrice - arimaPrice;
      diff = difference.toFixed(2);
      diffRate = ((difference / arimaPrice) * 100).toFixed(2) + '%';
    }

    const arimaStr = (arimaPrice != null && !isNaN(arimaPrice)) ? arimaPrice.toFixed(2) : 'N/A';
    const lstmStr = (lstmPrice != null && !isNaN(lstmPrice)) ? lstmPrice.toFixed(2) : 'N/A';

    console.log(
      `${item.product_name.padEnd(16, ' ')}\t${item.period_number}\t` +
      `${arimaStr}\t\t${lstmStr}\t\t${diff}\t\t${diffRate}`
    );
  });

  console.log('\n' + '='.repeat(100));
  
  // 统计信息
  const validComparisons = Object.values(grouped).filter(
    item => item.arima && item.lstm
  );
  
  if (validComparisons.length > 0) {
    const avgDiff = validComparisons.reduce((sum, item) => {
      const arimaPrice = Number(item.arima.predicted_price);
      const lstmPrice = Number(item.lstm.predicted_price);
      return sum + Math.abs(lstmPrice - arimaPrice);
    }, 0) / validComparisons.length;

    const avgDiffRate = validComparisons.reduce((sum, item) => {
      const arimaPrice = Number(item.arima.predicted_price);
      const lstmPrice = Number(item.lstm.predicted_price);
      return sum + Math.abs((lstmPrice - arimaPrice) / arimaPrice * 100);
    }, 0) / validComparisons.length;

    console.log('\n统计信息:');
    console.log(`有效对比数: ${validComparisons.length}`);
    console.log(`平均差异: ${avgDiff.toFixed(2)}`);
    console.log(`平均差异率: ${avgDiffRate.toFixed(2)}%`);
  }

  console.log('\n' + '='.repeat(100));
  await pool.end();
}

// 命令行参数处理
if (require.main === module) {
  const args = process.argv.slice(2);
  const productName = args[0] || null;

  if (productName) {
    console.log(`\n对比产品: ${productName}\n`);
  }

  displayComparison(productName)
    .then(() => process.exit(0))
    .catch(err => {
      console.error('执行失败:', err);
      process.exit(1);
    });
}

module.exports = { compareModels, displayComparison };
