const { Category, Tag } = require('../models');
const { success, error: errorResponse } = require('../utils/response');
const { Op } = require('sequelize');

// 2.1 获取帖子类别树
exports.getCategoryTree = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      where: { is_enabled: 1 },
      order: [['parent_id', 'ASC'], ['sort_order', 'ASC']],
      attributes: ['category_id', 'parent_id', 'category_name']
    });

    // 构建树形结构
    const buildTree = (parentId = 0) => {
      return categories
        .filter(cat => cat.parent_id === parentId)
        .map(cat => ({
          category_id: cat.category_id,
          category_name: cat.category_name,
          children: buildTree(cat.category_id)
        }));
    };

    success(res, buildTree(), '查询成功。');
  } catch (err) {
    next(err);
  }
};

// 2.2 搜索标签
exports.searchTags = async (req, res, next) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return errorResponse(res, '请提供搜索关键词', 400);
    }

    const tags = await Tag.findAll({
      where: {
        tag_name: { [Op.iLike]: `%${keyword}%` },
        is_enabled: 1
      },
      attributes: ['tag_id', 'tag_name'],
      limit: 20
    });

    success(res, tags, '查询成功。');
  } catch (err) {
    next(err);
  }
};

module.exports = exports;
