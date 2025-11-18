const Joi = require('joi');

/**
 * 参数验证工具
 */

// 发布内容验证 schema
exports.createContentSchema = Joi.object({
  category_id: Joi.number().integer().required().messages({
    'any.required': '分类ID为必填项',
    'number.base': '分类ID必须为数字'
  }),
  content_type: Joi.number().integer().valid(1, 2, 3).required().messages({
    'any.required': '内容类型为必填项',
    'any.only': '内容类型只能为1（文章）、2（视频）或3（问题）'
  }),
  content_title: Joi.string().min(5).max(200).required().messages({
    'any.required': '标题为必填项',
    'string.min': '标题至少5个字符',
    'string.max': '标题最多200个字符'
  }),
  content_text: Joi.string().min(10).required().messages({
    'any.required': '内容为必填项',
    'string.min': '内容至少10个字符'
  }),
  content_cover: Joi.string().uri().allow(null, '').messages({
    'string.uri': '封面图必须为有效的URL'
  }),
  tag_ids: Joi.array().items(Joi.number().integer()).optional(),
  reward_amount: Joi.number().positive().optional().messages({
    'number.positive': '悬赏金额必须为正数'
  })
});

// 发布评论验证 schema
exports.createCommentSchema = Joi.object({
  parent_id: Joi.number().integer().default(0),
  comment_text: Joi.string().min(1).max(500).required().messages({
    'any.required': '评论内容为必填项',
    'string.min': '评论内容不能为空',
    'string.max': '评论内容最多500个字符'
  })
});

// 分页参数验证 schema
exports.paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sort: Joi.string().valid('latest', 'hot').default('latest'),
  category_id: Joi.number().integer().optional(),
  content_type: Joi.number().integer().valid(1, 2, 3).optional()
});

// 验证中间件工厂函数
exports.validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // 返回所有错误
      stripUnknown: true // 移除未知字段
    });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        code: 400,
        message: '参数验证失败',
        errors
      });
    }

    // 将验证后的值替换原始请求体
    req.body = value;
    next();
  };
};

// 验证查询参数
exports.validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        code: 400,
        message: '参数验证失败',
        errors
      });
    }

    req.query = value;
    next();
  };
};

// 关注用户验证 schema
exports.followUserSchema = Joi.object({
  followed_id: Joi.number().integer().required().messages({
    'any.required': '被关注用户ID为必填项',
    'number.base': '被关注用户ID必须为数字'
  }),
  follow_source: Joi.number().integer().default(1)
});

// 拉黑用户验证 schema
exports.blacklistUserSchema = Joi.object({
  blacked_user_id: Joi.number().integer().required().messages({
    'any.required': '被拉黑用户ID为必填项',
    'number.base': '被拉黑用户ID必须为数字'
  }),
  black_reason: Joi.string().max(500).optional()
});

// 采纳最佳答案验证 schema
exports.adoptBestAnswerSchema = Joi.object({
  comment_id: Joi.number().integer().required().messages({
    'any.required': '评论ID为必填项',
    'number.base': '评论ID必须为数字'
  })
});

// 举报验证 schema
exports.createReportSchema = Joi.object({
  report_type: Joi.number().integer().valid(1, 2, 3).required().messages({
    'any.required': '举报类型为必填项',
    'any.only': '举报类型只能为1（内容）、2（评论）或3（用户）'
  }),
  report_obj_id: Joi.number().integer().required().messages({
    'any.required': '被举报对象ID为必填项',
    'number.base': '被举报对象ID必须为数字'
  }),
  report_reason: Joi.number().integer().valid(1, 2, 3).required().messages({
    'any.required': '举报原因为必填项',
    'any.only': '举报原因只能为1（违法违规）、2（广告营销）或3（不实信息）'
  }),
  report_detail: Joi.string().max(1000).optional(),
  report_evidence: Joi.string().optional(),
  is_anonymous: Joi.boolean().default(false)
});

// 处理举报验证 schema
exports.handleReportSchema = Joi.object({
  audit_result: Joi.string().valid('approve', 'reject').required().messages({
    'any.required': '审核结果为必填项',
    'any.only': '审核结果只能为approve（立案）或reject（不予立案）'
  }),
  audit_remark: Joi.string().max(500).optional(),
  violation: Joi.object({
    handle_measure: Joi.number().integer().valid(1, 2, 3, 4).required().messages({
      'any.required': '处理措施为必填项',
      'any.only': '处理措施只能为1（删除内容）、2（警告）、3（禁言）或4（封号）'
    }),
    handle_remark: Joi.string().max(500).optional()
  }).when('audit_result', {
    is: 'approve',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});