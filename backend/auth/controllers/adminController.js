const UserModel = require('../models/UserModel');
const Joi = require('joi');

// 获取用户列表
async function getUserList(req, res) {
  try {
    const { user_type, user_status, page = 1, pageSize = 10 } = req.query;
    
    // 构建筛选条件
    const filters = {};
    if (user_type) filters.user_type = Number.parseInt(user_type, 10);
    if (user_status !== undefined) filters.user_status = Number.parseInt(user_status, 10);

    const pageNum = Number.parseInt(page, 10);
    const size = Number.parseInt(pageSize, 10);

    const result = await UserModel.findAndCountAll(filters, pageNum, size);

    res.json({
      code: 200,
      message: '获取用户列表成功',
      data: {
        users: result.rows,
        pagination: {
          total: result.count,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          pageSize: size
        }
      }
    });

  } catch (err) {
    console.error('获取用户列表失败:', err);
    res.status(500).json({
      code: 500,
      message: '获取用户列表失败',
      error: '服务器内部错误'
    });
  }
}

// 更新用户状态
async function updateUserStatus(req, res) {
  try {
    const userId = req.params.id;
    
    // 验证请求数据
    const updateSchema = Joi.object({
      user_status: Joi.number().integer().valid(0, 1, 2).optional(),
      cert_status: Joi.number().integer().valid(0, 1).optional()
    });

    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        message: '更新失败',
        error: error.details[0].message
      });
    }

    const { user_status, cert_status } = value;
    
    // 构建更新数据
    const updates = {};
    if (user_status !== undefined) updates.user_status = user_status;
    if (cert_status !== undefined) updates.cert_status = cert_status;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        code: 400,
        message: '没有需要更新的字段'
      });
    }

    const result = await UserModel.update(userId, updates);
    if (!result) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }

    res.json({
      code: 200,
      message: '更新用户状态成功'
    });

  } catch (err) {
    console.error('更新用户状态失败:', err);
    res.status(500).json({
      code: 500,
      message: '更新用户状态失败',
      error: '服务器内部错误'
    });
  }
}

module.exports = {
  getUserList,
  updateUserStatus
};