const { pool } = require('../database');

class StatsModel {
  static async getPriceTrends(categoryId, startDate, endDate) {
    // 获取品类名称
    const categoryQuery = 'SELECT category_name FROM mall_product_category WHERE category_id = $1';
    const categoryResult = await pool.query(categoryQuery, [categoryId]);
    
    if (categoryResult.rows.length === 0) {
      throw new Error('品类不存在');
    }
    
    const categoryName = categoryResult.rows[0].category_name;

    // 获取价格走势数据
    const trendsQuery = `
      SELECT stat_date, avg_price, max_price, min_price, price_trend
      FROM mall_product_price_stat
      WHERE category_id = $1 AND stat_date BETWEEN $2 AND $3
      ORDER BY stat_date ASC
    `;
    
    const trendsResult = await pool.query(trendsQuery, [categoryId, startDate, endDate]);

    return {
      category_name: categoryName,
      trends: trendsResult.rows
    };
  }

  static async updatePriceStats(categoryId, productName, statDate, priceData) {
    const { avg_price, max_price, min_price, price_trend, trend_rate, supply_quantity, demand_quantity } = priceData;
    
    // 检查是否已存在该日期的统计数据
    const checkQuery = 'SELECT stat_id FROM mall_product_price_stat WHERE category_id = $1 AND stat_date = $2';
    const checkResult = await pool.query(checkQuery, [categoryId, statDate]);
    
    let query, result;
    if (checkResult.rows.length > 0) {
      // 更新已存在的记录
      query = `
        UPDATE mall_product_price_stat 
        SET product_name = $2, avg_price = $3, max_price = $4, min_price = $5,
            price_trend = $6, trend_rate = $7, supply_quantity = $8, demand_quantity = $9,
            create_time = NOW()
        WHERE category_id = $1 AND stat_date = $10
        RETURNING stat_id
      `;
      result = await pool.query(query, [
        categoryId, productName, avg_price, max_price, min_price,
        price_trend, trend_rate, supply_quantity, demand_quantity, statDate
      ]);
    } else {
      // 插入新记录
      query = `
        INSERT INTO mall_product_price_stat (
          category_id, product_name, stat_date, avg_price, max_price, min_price,
          price_trend, trend_rate, supply_quantity, demand_quantity
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING stat_id
      `;
      result = await pool.query(query, [
        categoryId, productName, statDate, avg_price, max_price, min_price,
        price_trend, trend_rate, supply_quantity, demand_quantity
      ]);
    }
    

    
    return result.rows[0];
  }
}

module.exports = StatsModel;