const authController = require('../../controllers/authController');
const UserModel = require('../../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../database.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

// 正确 mock 验证模块
jest.mock('../../utils/validation', () => {
  const Joi = require('joi');
  
  const registerSchema = {
    validate: jest.fn().mockReturnValue({ 
      error: null, 
      value: {
        user_name: 'testuser',
        password: 'password123',
        real_name: '测试用户',
        user_type: 1,
        id_card: '123456789012345678',
        phone: '13800138000',
        email: 'test@example.com'
      }
    })
  };

  const loginSchema = {
    validate: jest.fn().mockReturnValue({ 
      error: null, 
      value: {
        login_identifier: 'testuser',
        password: 'password123'
      }
    })
  };

  return {
    registerSchema,
    loginSchema
  };
});

const { registerSchema, loginSchema } = require('../../utils/validation');

describe('authController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
    
    // 重置默认的 mock 实现
    registerSchema.validate.mockReturnValue({ 
      error: null, 
      value: {
        user_name: 'testuser',
        password: 'password123',
        real_name: '测试用户',
        user_type: 1,
        id_card: '123456789012345678',
        phone: '13800138000',
        email: 'test@example.com'
      }
    });
    
    loginSchema.validate.mockReturnValue({ 
      error: null, 
      value: {
        login_identifier: 'testuser',
        password: 'password123'
      }
    });
  });

  describe('register', () => {
    it('应该成功注册用户，状态为待审核', async () => {
      req.body = {
        user_name: 'testuser10',
        password: 'password123',
        real_name: '测试用户',
        user_type: 1,
        id_card: '123456789012345678',
        phone: '13800138000',
        email: 'test@example.com'
      };

      // 设置验证通过
      registerSchema.validate.mockReturnValue({ 
        error: null, 
        value: req.body 
      });

      // 分别检查用户名、手机号、身份证是否已存在
      UserModel.checkExists
        .mockResolvedValueOnce(false) // 检查用户名
        .mockResolvedValueOnce(false) // 检查手机号  
        .mockResolvedValueOnce(false); // 检查身份证
      
      bcrypt.hash.mockResolvedValue('hashedPassword');
      
      // 模拟创建的用户数据
      UserModel.create.mockResolvedValue({
        user_id: 1
      });

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 201,
          message: '注册成功，等待管理员审核',
          data: { user_id: 1 }
        })
      );
    });

    it('应该检查用户名是否已存在', async () => {
      req.body = {
        user_name: 'existinguser',
        password: 'password123',
        real_name: '测试用户',
        user_type: 1,
        id_card: '123456789012345678',
        phone: '13800138000',
        email: 'existing@example.com'
      };

      // 设置验证通过
      registerSchema.validate.mockReturnValue({ 
        error: null, 
        value: req.body 
      });

      // 只检查用户名时返回 true，其他检查不执行
      UserModel.checkExists.mockImplementation((field, value) => {
        if (field === 'user_name') {
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      });

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 409,
          message: '注册失败',
          error: "用户名 'existinguser' 已存在"
        })
      );
    });

    it('应该检查手机号是否已存在', async () => {
      req.body = {
        user_name: 'newuser',
        password: 'password123',
        real_name: '测试用户',
        user_type: 1,
        id_card: '123456789012345678',
        phone: '13800138000',
        email: 'new@example.com'
      };

      // 设置验证通过
      registerSchema.validate.mockReturnValue({ 
        error: null, 
        value: req.body 
      });

      // 用户名不存在，但手机号已存在
      UserModel.checkExists.mockImplementation((field, value) => {
        if (field === 'user_name') {
          return Promise.resolve(false);
        }
        if (field === 'phone') {
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      });

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 409,
          message: '注册失败',
          error: '该手机号已被注册'
        })
      );
    });

    it('应该检查身份证号是否已存在', async () => {
      req.body = {
        user_name: 'newuser',
        password: 'password123',
        real_name: '测试用户',
        user_type: 1,
        id_card: '123456789012345678',
        phone: '13900139000',
        email: 'new@example.com'
      };

      // 设置验证通过
      registerSchema.validate.mockReturnValue({ 
        error: null, 
        value: req.body 
      });

      // 用户名和手机号可用，但身份证已存在
      UserModel.checkExists.mockImplementation((field, value) => {
        if (field === 'user_name' || field === 'phone') {
          return Promise.resolve(false);
        }
        if (field === 'id_card') {
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      });

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 409,
          message: '注册失败',
          error: '该身份证号已被注册'
        })
      );
    });

    it('应该验证必填字段', async () => {
      req.body = {
        user_name: 'testuser',
        password: 'password123'
        // 缺少 real_name, user_type, id_card, phone
      };

      // 模拟验证失败
      registerSchema.validate.mockReturnValue({
        error: {
          details: [{ message: 'real_name 是必填的' }]
        },
        value: null
      });

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 400,
          message: '注册失败',
          error: 'real_name 是必填的'
        })
      );
    });
  });

  describe('login', () => {
    it('应该成功登录', async () => {
      req.body = {
        login_identifier: 'testuser',
        password: 'password123'
      };

      // 设置验证通过
      loginSchema.validate.mockReturnValue({ 
        error: null, 
        value: req.body 
      });

      const mockUser = {
        user_id: 1,
        user_name: 'testuser',
        password: 'hashedPassword',
        user_type: 1,
        user_status: 1,
        real_name: '测试用户'
      };

      UserModel.findByIdentifier.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockToken');
      UserModel.updateLastLogin.mockResolvedValue();

      await authController.login(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 200,
          message: '登录成功',
          data: expect.objectContaining({
            token: 'mockToken',
            user_info: expect.objectContaining({
              user_id: 1,
              user_name: 'testuser',
              real_name: '测试用户',
              user_type: 1
            })
          })
        })
      );
    });

    it('应该处理用户不存在的情况', async () => {
      req.body = {
        login_identifier: 'nonexistent',
        password: 'password123'
      };

      // 设置验证通过
      loginSchema.validate.mockReturnValue({ 
        error: null, 
        value: req.body 
      });

      UserModel.findByIdentifier.mockResolvedValue(null);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 401,
          message: '登录失败',
          error: '用户名或密码错误'
        })
      );
    });

    it('应该处理密码错误的情况', async () => {
      req.body = {
        login_identifier: 'testuser',
        password: 'wrongpassword'
      };

      // 设置验证通过
      loginSchema.validate.mockReturnValue({ 
        error: null, 
        value: req.body 
      });

      const mockUser = {
        user_id: 1,
        user_name: 'testuser',
        password: 'hashedPassword',
        user_type: 1,
        user_status: 1,
        real_name: '测试用户'
      };

      UserModel.findByIdentifier.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 401,
          message: '登录失败',
          error: '用户名或密码错误'
        })
      );
    });

    it('应该处理验证失败的情况', async () => {
      req.body = {
        // 缺少必填字段
        password: 'password123'
      };

      // 模拟验证失败
      loginSchema.validate.mockReturnValue({
        error: {
          details: [{ message: 'login_identifier 是必填的' }]
        },
        value: null
      });

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 400,
          message: '登录失败',
          error: 'login_identifier 是必填的'
        })
      );
    });
  });
});