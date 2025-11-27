const axios = require('axios');
require('dotenv').config();

const PREDICTION_API = `http://${process.env.PREDICTION_HOST}:${process.env.PREDICTION_PORT}`;

/**
 * 获取所有月度数据类别
 */
async function getCategories() {
  try {
    const response = await axios.get(`${PREDICTION_API}/api/categories`);
    return response.data;
  } catch (error) {
    console.error('获取类别失败:', error.message);
    return [];
  }
}

/**
 * 获取指定类别下的产品列表
 */
async function getProducts(category) {
  try {
    const response = await axios.get(`${PREDICTION_API}/api/products/${category}`);
    return response.data.products || [];
  } catch (error) {
    console.error(`获取产品列表失败 (${category}):`, error.message);
    return [];
  }
}

/**
 * 执行单个产品的价格预测
 */
async function predictProduct(product, category, periods = 3, modelType = 'arima') {
  try {
    const response = await axios.post(`${PREDICTION_API}/api/predict`, {
      region: 'national',
      data_type: 'monthly',
      model: modelType,
      periods: periods,
      category: category,
      product: product
    }, {
      timeout: 30000 // 30秒超时
    });
    
    // 验证返回的数据结构
    if (response.data && response.data.predicted && response.data.predicted.values) {
      return response.data;
    } else {
      console.error(`预测返回数据格式错误 (${product})`);
      return null;
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error(`无法连接到预测服务 (${PREDICTION_API})`);
    } else if (error.code === 'ETIMEDOUT') {
      console.error(`预测超时 (${product})`);
    } else {
      console.error(`预测失败 (${product}):`, error.message);
    }
    return null;
  }
}

/**
 * 格式化预测结果为数据库格式
 */
function formatPredictionForDB(product, category, predictionResult) {
  if (!predictionResult || !predictionResult.predicted) {
    return [];
  }

  const today = new Date().toISOString().split('T')[0];
  const predictions = [];

  const predicted = predictionResult.predicted;
  const values = predicted.values || [];
  const lowerBounds = predicted.lower_bound || [];
  const upperBounds = predicted.upper_bound || [];

  values.forEach((value, index) => {
    predictions.push({
      productName: product,
      productCategory: category,
      region: 'national',
      predictionType: 'monthly',
      predictionDate: today,
      periodNumber: index + 1,
      predictedPrice: value,
      confidenceLower: lowerBounds[index] || null,
      confidenceUpper: upperBounds[index] || null,
      modelType: predictionResult.model || 'arima',
      accuracyScore: predictionResult.aic ? (100 - Math.min(predictionResult.aic, 100)) : null
    });
  });

  return predictions;
}

/**
 * 执行全国月度价格预测（所有产品，使用两种模型）
 */
async function runFullPrediction(periods = 3, modelTypes = ['arima', 'lstm']) {
  console.log('开始执行全国月度价格预测...');
  console.log(`预测期数: ${periods}`);
  console.log(`使用模型: ${modelTypes.map(m => m.toUpperCase()).join(' + ')}`);
  
  const allPredictions = [];
  let successCount = 0;
  let failCount = 0;
  let totalProducts = 0;

  try {
    // 获取所有类别
    const categoriesMap = await getCategories();
    const categories = Object.keys(categoriesMap);
    console.log(`找到 ${categories.length} 个产品类别`);

    // 遍历每个类别
    for (const category of categories) {
      const categoryName = categoriesMap[category];
      console.log(`\n处理类别: ${categoryName} (${category})`);
      
      // 获取该类别下的所有产品
      const products = await getProducts(category);
      console.log(`  找到 ${products.length} 个产品`);

      if (products.length === 0) {
        console.log(`  跳过空类别`);
        continue;
      }

      // 遍历每个产品进行预测
      for (const product of products) {
        totalProducts++;
        console.log(`  [${totalProducts}] 预测产品: ${product}`);
        
        let productSuccess = false;
        
        // 使用每种模型进行预测
        for (const modelType of modelTypes) {
          try {
            console.log(`    使用 ${modelType.toUpperCase()} 模型...`);
            const result = await predictProduct(product, category, periods, modelType);
            
            if (result && result.predicted && result.predicted.values) {
              const formattedPredictions = formatPredictionForDB(product, categoryName, result);
              allPredictions.push(...formattedPredictions);
              productSuccess = true;
              console.log(`      ✓ ${modelType.toUpperCase()} 预测成功 (${result.predicted.values.length} 期)`);
            } else {
              console.log(`      ✗ ${modelType.toUpperCase()} 预测失败 - 无有效数据`);
            }
          } catch (error) {
            console.error(`      ✗ ${modelType.toUpperCase()} 预测出错: ${error.message}`);
          }
          
          // 模型之间添加短暂延迟
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        if (productSuccess) {
          successCount++;
        } else {
          failCount++;
        }

        // 产品之间添加延迟避免请求过快
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    console.log(`\n预测完成！`);
    console.log(`总产品数: ${totalProducts}`);
    console.log(`成功: ${successCount} 个产品`);
    console.log(`失败: ${failCount} 个产品`);
    console.log(`总预测数据: ${allPredictions.length} 条`);

    return {
      success: true,
      productsCount: totalProducts,
      predictionsCount: allPredictions.length,
      predictions: allPredictions
    };

  } catch (error) {
    console.error('预测过程出错:', error);
    return {
      success: false,
      error: error.message,
      productsCount: totalProducts,
      predictionsCount: allPredictions.length,
      predictions: allPredictions
    };
  }
}

module.exports = {
  getCategories,
  getProducts,
  predictProduct,
  formatPredictionForDB,
  runFullPrediction
};
