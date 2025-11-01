const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const { registerSchema, loginSchema } = require('../utils/validation');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

async function register(req, res) {
  try {
    console.log('收到注册请求:', req.body);
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        message: '注册失败',
        error: error.details[0].message
      });
    }

    const { user_name, password, real_name, user_type, id_card, phone, email } = value;

    // 检查用户名、手机号、身份证是否已存在
    if (await UserModel.checkExists('user_name', user_name)) {
      return res.status(409).json({
        code: 409,
        message: '注册失败',
        error: `用户名 '${user_name}' 已存在`
      });
    }

    if (await UserModel.checkExists('phone', phone)) {
      return res.status(409).json({
        code: 409,
        message: '注册失败',
        error: '该手机号已被注册'
      });
    }

    if (await UserModel.checkExists('id_card', id_card)) {
      return res.status(409).json({
        code: 409,
        message: '注册失败',
        error: '该身份证号已被注册'
      });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await UserModel.create({
      user_name, password: hashedPassword, real_name, user_type, id_card, phone, email
    });

    res.status(201).json({
      code: 201,
      message: '注册成功，等待管理员审核',
      data: { user_id: user.user_id }
    });

  } catch (err) {
    console.error('注册失败:', err);
    res.status(500).json({
      code: 500,
      message: '注册失败',
      error: '服务器内部错误'
    });
  }
}

async function login(req, res) {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        message: '登录失败',
        error: error.details[0].message
      });
    }

    const { login_identifier, password } = value;

    // 查找用户
    const user = await UserModel.findByIdentifier(login_identifier);
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: '登录失败',
        error: '用户名或密码错误'
      });
    }

    // 我为了测试暂时将它取消，之后会进行恢复
    // // 检查用户状态
    // if (user.user_status !== 1) {
    //   return res.status(403).json({
    //     code: 403,
    //     message: '登录失败',
    //     error: '账户未激活或已被禁用'
    //   });
    // }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        code: 401,
        message: '登录失败',
        error: '用户名或密码错误'
      });
    }

    // 更新最后登录时间
    await UserModel.updateLastLogin(user.user_id);

    // 生成JWT
    const token = jwt.sign(
      { userId: user.user_id, userType: user.user_type },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        user_info: {
          user_id: user.user_id,
          user_name: user.user_name,
          real_name: user.real_name,
          user_type: user.user_type
        }
      }
    });

  } catch (err) {
    console.error('登录失败:', err);
    res.status(500).json({
      code: 500,
      message: '登录失败',
      error: '服务器内部错误'
    });
  }
}

module.exports = {
  register,
  login
};