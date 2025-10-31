const bcrypt = require('bcrypt');
const { pool } = require('../database');
const { registerSchema } = require('../utils/validation');
const { encrypt } = require('../utils/crypto');

/**
 * 用户注册
 */
async function register(req, res) {
  const client = await pool.connect();
  
  try {
    // 1. 验证请求数据
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        message: '注册失败',
        error: error.details[0].message
      });
    }

    const { user_name, password, real_name, user_type, id_card, phone, email } = value;

    // 2. 检查用户名是否已存在
    const userNameCheck = await client.query(
      'SELECT user_id FROM sys_user WHERE user_name = $1',
      [user_name]
    );
    
    if (userNameCheck.rows.length > 0) {
      return res.status(409).json({
        code: 409,
        message: '注册失败',
        error: `用户名 '${user_name}' 已存在`
      });
    }

    // 3. 检查手机号是否已存在
    const phoneCheck = await client.query(
      'SELECT user_id FROM sys_user WHERE phone = $1',
      [phone]
    );
    
    if (phoneCheck.rows.length > 0) {
      return res.status(409).json({
        code: 409,
        message: '注册失败',
        error: '该手机号已被注册'
      });
    }

    // 4. 检查身份证号是否已存在（加密后比较）
    const encryptedIdCard = encrypt(id_card);
    const idCardCheck = await client.query(
      'SELECT user_id FROM sys_user WHERE id_card = $1',
      [encryptedIdCard]
    );
    
    if (idCardCheck.rows.length > 0) {
      return res.status(409).json({
        code: 409,
        message: '注册失败',
        error: '该身份证号已被注册'
      });
    }

    // 5. 加密密码
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 6. 开始事务
    await client.query('BEGIN');

    // 7. 插入用户基础信息
    const insertUserQuery = `
      INSERT INTO sys_user (
        user_name, password, real_name, user_type, id_card, phone, email, 
        user_status, cert_status, create_time, update_time
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING user_id
    `;
    
    const userResult = await client.query(insertUserQuery, [
      user_name,
      hashedPassword,
      real_name,
      user_type,
      encryptedIdCard,
      phone,
      email || null,
      2, // user_status: 2 = 待审核
      0  // cert_status: 0 = 未认证
    ]);

    const userId = userResult.rows[0].user_id;

    // 8. 提交事务
    await client.query('COMMIT');

    // 9. 返回成功响应
    res.status(201).json({
      code: 201,
      message: '注册成功，等待管理员审核',
      data: {
        user_id: userId
      }
    });

  } catch (err) {
    // 回滚事务
    await client.query('ROLLBACK');
    console.error('注册失败:', err);
    
    res.status(500).json({
      code: 500,
      message: '注册失败',
      error: '服务器内部错误'
    });
  } finally {
    client.release();
  }
}

module.exports = {
  register
};