/**
 * 统一响应格式工具
 */

// 成功响应
exports.success = (res, data = null, message = '操作成功', code = 200) => {
  return res.status(code).json({
    code,
    message,
    data
  });
};

// 创建成功响应
exports.created = (res, data = null, message = '创建成功') => {
  return res.status(201).json({
    code: 201,
    message,
    data
  });
};

// 错误响应
exports.error = (res, message = '操作失败', code = 500, error = null) => {
  const response = {
    code,
    message
  };
  
  if (error && process.env.NODE_ENV === 'development') {
    response.error = error;
  }
  
  return res.status(code).json(response);
};

// 参数错误响应
exports.badRequest = (res, message = '参数错误') => {
  return res.status(400).json({
    code: 400,
    message
  });
};

// 未授权响应
exports.unauthorized = (res, message = '未授权访问') => {
  return res.status(401).json({
    code: 401,
    message
  });
};

// 禁止访问响应
exports.forbidden = (res, message = '权限不足') => {
  return res.status(403).json({
    code: 403,
    message
  });
};

// 未找到响应
exports.notFound = (res, message = '资源不存在') => {
  return res.status(404).json({
    code: 404,
    message
  });
};

// 无内容响应
exports.noContent = (res) => {
  return res.status(204).send();
};