const Joi = require('joi');

// 用户注册验证规则
const registerSchema = Joi.object({
  user_name: Joi.string().alphanum().min(3).max(30).required()
    .messages({
      'string.alphanum': '用户名只能包含字母和数字',
      'string.min': '用户名至少3个字符',
      'string.max': '用户名最多30个字符',
      'any.required': '用户名不能为空'
    }),
  
  password: Joi.string().min(6).max(50).required()
    .messages({
      'string.min': '密码至少6个字符',
      'string.max': '密码最多50个字符',
      'any.required': '密码不能为空'
    }),
  
  real_name: Joi.string().min(2).max(20).required()
    .messages({
      'string.min': '真实姓名至少2个字符',
      'string.max': '真实姓名最多20个字符',
      'any.required': '真实姓名不能为空'
    }),
  
  user_type: Joi.number().integer().valid(1, 2).required()
    .messages({
      'number.base': '用户类型必须是数字',
      'any.only': '用户类型只能是1(农户)或2(买家)',
      'any.required': '用户类型不能为空'
    }),
  
  id_card: Joi.string().pattern(/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/).required()
    .messages({
      'string.pattern.base': '身份证号格式不正确',
      'any.required': '身份证号不能为空'
    }),
  
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/).required()
    .messages({
      'string.pattern.base': '手机号格式不正确',
      'any.required': '手机号不能为空'
    }),
  
  email: Joi.string().email().optional()
    .messages({
      'string.email': '邮箱格式不正确'
    })
});

// 用户登录验证规则
const loginSchema = Joi.object({
  login_identifier: Joi.string().required()
    .messages({
      'any.required': '用户名或手机号不能为空'
    }),
  
  password: Joi.string().required()
    .messages({
      'any.required': '密码不能为空'
    })
});

module.exports = {
  registerSchema,
  loginSchema
};