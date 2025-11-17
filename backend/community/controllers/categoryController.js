const db = require('../config/database');

// 2.1 获取帖子类别树
exports.getCategoryTree = async (req, res) => {
  const client = await db.connect();
  try {
    const categories = await client.query(
      'SELECT * FROM community_categories WHERE is_enabled = 1 ORDER BY parent_id, sort_order'
    );

    // 构建树形结构
    const buildTree = (parentId = 0) => {
      return categories.rows
        .filter(cat => cat.parent_id === parentId)
        .map(cat => ({
          category_id: cat.category_id,
          category_name: cat.category_name,
          children: buildTree(cat.category_id)
        }));
    };

    res.json({
      code: 200,
      message: '查询成功。',
      data: buildTree()
    });
  } catch (error) {
    console.error('获取分类树失败:', error);
    res.status(500).json({
      code: 500,
      message: '查询失败',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// 2.2 搜索标签
exports.searchTags = async (req, res) => {
  const client = await db.connect();
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({
        code: 400,
        message: '请提供搜索关键词'
      });
    }

    const tags = await client.query(
      'SELECT tag_id, tag_name FROM community_tags WHERE tag_name ILIKE $1 AND is_enabled = 1 LIMIT 20',
      [`%${keyword}%`]
    );

    res.json({
      code: 200,
      message: '查询成功。',
      data: tags.rows
    });
  } catch (error) {
    console.error('搜索标签失败:', error);
    res.status(500).json({
      code: 500,
      message: '查询失败',
      error: error.message
    });
  } finally {
    client.release();
  }
};
