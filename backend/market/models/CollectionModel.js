const { pool } = require('../database');

class CollectionModel {
  static async create(userId, collectionData) {
    const { collection_type, source_id, demand_id } = collectionData;
    
    // 检查是否已收藏
    let checkQuery, checkParams, objId, objName;
    
    if (collection_type === 1) {
      checkQuery = 'SELECT collection_id FROM mall_user_collection WHERE user_id = $1 AND source_id = $2 AND is_valid = 1';
      checkParams = [userId, source_id];
      objId = source_id;
      
      // 获取货源名称
      const sourceQuery = 'SELECT product_name FROM mall_farmer_source WHERE source_id = $1';
      const sourceResult = await pool.query(sourceQuery, [source_id]);
      if (sourceResult.rows.length === 0) {
        throw new Error('货源不存在');
      }
      objName = sourceResult.rows[0].product_name;
    } else {
      checkQuery = 'SELECT collection_id FROM mall_user_collection WHERE user_id = $1 AND demand_id = $2 AND is_valid = 1';
      checkParams = [userId, demand_id];
      objId = demand_id;
      
      // 获取求购名称
      const demandQuery = 'SELECT product_name FROM mall_buyer_demand WHERE demand_id = $1';
      const demandResult = await pool.query(demandQuery, [demand_id]);
      if (demandResult.rows.length === 0) {
        throw new Error('求购不存在');
      }
      objName = demandResult.rows[0].product_name;
    }

    const checkResult = await pool.query(checkQuery, checkParams);
    if (checkResult.rows.length > 0) {
      throw new Error('您已收藏该项目');
    }

    // 插入收藏记录
    const insertQuery = `
      INSERT INTO mall_user_collection (
        user_id, collection_type, source_id, demand_id, collection_name
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING collection_id
    `;
    
    const result = await pool.query(insertQuery, [
      userId, collection_type, source_id, demand_id, objName
    ]);
    
    return result.rows[0];
  }

  static async remove(userId, collectionId) {
    const query = `
      UPDATE mall_user_collection 
      SET is_valid = 0, cancel_time = NOW()
      WHERE user_id = $1 AND collection_id = $2 AND is_valid = 1
      RETURNING collection_id
    `;
    
    const result = await pool.query(query, [userId, collectionId]);
    return result.rows[0];
  }

  static async findByUser(userId, collectionType = null) {
    let query = `
      SELECT collection_id, collection_type, source_id, demand_id, 
             collection_name, collection_time
      FROM mall_user_collection
      WHERE user_id = $1 AND is_valid = 1
    `;
    const params = [userId];
    
    if (collectionType) {
      query += ' AND collection_type = $2';
      params.push(collectionType);
    }
    
    query += ' ORDER BY collection_time DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  }
}

module.exports = CollectionModel;