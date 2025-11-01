const UserModel = require('../models/userModel');
const Joi = require('joi');

// 获取当前用户信息
async function getMe(req, res) {
  try {
    const userId = req.user.userId;
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }

    res.json({
      code: 200,
      message: '获取用户信息成功',
      data: user
    });

  } catch (err) {
    console.error('获取用户信息失败:', err);
    res.status(500).json({
      code: 500,
      message: '获取用户信息失败',
      error: '服务器内部错误'
    });
  }
}

// 更新当前用户信息
async function updateMe(req, res) {
  try {
    const userId = req.user.userId;
    
    // 验证允许更新的字段
    const updateSchema = Joi.object({
      avatar: Joi.string().uri().optional(),
      email: Joi.string().email().optional()
    });

    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        message: '更新失败',
        error: error.details[0].message
      });
    }

    // 过滤空值
    const updates = {};
    for (const key of Object.keys(value)) {
      if (value[key] !== undefined && value[key] !== null) {
        updates[key] = value[key];
      }
    }

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

    // 返回更新后的用户信息
    const updatedUser = await UserModel.findById(userId);
    res.json({
      code: 200,
      message: '更新成功',
      data: updatedUser
    });

  } catch (err) {
    console.error('更新用户信息失败:', err);
    res.status(500).json({
      code: 500,
      message: '更新失败',
      error: '服务器内部错误'
    });
  }
}

module.exports = {
  getMe,
  updateMe
};