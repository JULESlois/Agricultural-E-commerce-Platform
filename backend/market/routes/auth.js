const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 登录接口
router.post('/login', async (req, res) => {
  try {
    const { login_identifier, password } = req.body;

    if (!login_identifier || !password) {
      return res.status(400).json({
        code: 400,
        message: '请提供手机号和密码'
      });
    }

    // 查询用户
    const userResult = await pool.query(
      'SELECT * FROM sys_user WHERE phone = $1 AND user_status = 1',
      [login_identifier]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        code: 401,
        message: '手机号或密码错误'
      });
    }

    const user = userResult.rows[0];

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        code: 401,
        message: '手机号或密码错误'
      });
    }

    // 生成token
    const token = jwt.sign(
      { 
        user_id: user.user_id,
        user_type: user.user_type,
        phone: user.phone
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 更新最后登录时间
    await pool.query(
      'UPDATE sys_user SET last_login_time = CURRENT_TIMESTAMP WHERE user_id = $1',
      [user.user_id]
    );

    // 返回用户信息（不包含密码）
    const { password: _, ...userInfo } = user;

    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: userInfo
      }
    });

  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({
      code: 500,
      message: '登录失败，请稍后重试'
    });
  }
});

// 获取当前用户信息
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        code: 401,
        message: '未登录'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    const userResult = await pool.query(
      'SELECT user_id, user_name, real_name, user_type, phone, email, avatar, user_status, cert_status FROM sys_user WHERE user_id = $1',
      [decoded.user_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }

    res.json({
      code: 200,
      data: userResult.rows[0]
    });

  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(401).json({
      code: 401,
      message: 'Token无效或已过期'
    });
  }
});

module.exports = router;
