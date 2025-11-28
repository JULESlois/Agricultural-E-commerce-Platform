const { pool } = require('../database');

class CategoryModel {
  static async findTree() {
    const query = `
      SELECT category_id, parent_id, category_name, category_code, category_icon, sort
      FROM mall_product_category 
      WHERE status = 1 
      ORDER BY parent_id, sort, category_id
    `;
    const result = await pool.query(query);
    
    // 构建树形结构
    const categories = result.rows;
    const categoryMap = {};
    const tree = [];

    // 创建映射
    for (const category of categories) {
      categoryMap[category.category_id] = { ...category, children: [] };
    }

    // 构建树形结构
    for (const category of categories) {
      if (category.parent_id === 0) {
        tree.push(categoryMap[category.category_id]);
      } else {
        const parent = categoryMap[category.parent_id];
        if (parent) {
          parent.children.push(categoryMap[category.category_id]);
        }
      }
    }

    return tree;
  }

  static async create(categoryData) {
    const {
      parent_id, category_name, category_code, category_icon, sort, status
    } = categoryData;

    const query = `
      INSERT INTO mall_product_category (
        parent_id, category_name, category_code, category_icon, sort, status
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING category_id
    `;

    const values = [parent_id || 0, category_name, category_code, category_icon, sort || 0, status || 1];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = CategoryModel;