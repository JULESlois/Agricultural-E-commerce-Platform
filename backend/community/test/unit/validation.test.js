/**
 * Validation 单元测试
 * 测试参数验证规则
 */

const { expect } = require('chai');
const {
  createContentSchema,
  createCommentSchema,
  followUserSchema,
  blacklistUserSchema,
  adoptBestAnswerSchema,
  createReportSchema,
  handleReportSchema,
  paginationSchema
} = require('../../utils/validation');

describe('Validation 单元测试', () => {
  
  // ========== 内容验证测试 ==========
  describe('createContentSchema', () => {
    
    it('应该接受有效的内容数据', () => {
      const validData = {
        category_id: 1,
        content_type: 1,
        content_title: '测试标题测试标题',
        content_text: '这是一篇测试内容，至少需要10个字符'
      };
      const { error } = createContentSchema.validate(validData);
      expect(error).to.be.undefined;
    });

    it('应该拒绝标题过短的数据', () => {
      const invalidData = {
        category_id: 1,
        content_type: 1,
        content_title: '短',
        content_text: '这是一篇测试内容'
      };
      const { error } = createContentSchema.validate(invalidData);
      expect(error).to.exist;
    });

    it('应该拒绝内容过短的数据', () => {
      const invalidData = {
        category_id: 1,
        content_type: 1,
        content_title: '测试标题',
        content_text: '短'
      };
      const { error } = createContentSchema.validate(invalidData);
      expect(error).to.exist;
    });

    it('应该拒绝无效的内容类型', () => {
      const invalidData = {
        category_id: 1,
        content_type: 99,
        content_title: '测试标题',
        content_text: '这是一篇测试内容'
      };
      const { error } = createContentSchema.validate(invalidData);
      expect(error).to.exist;
    });
  });

  // ========== 评论验证测试 ==========
  describe('createCommentSchema', () => {
    
    it('应该接受有效的评论数据', () => {
      const validData = {
        comment_text: '这是一条测试评论'
      };
      const { error } = createCommentSchema.validate(validData);
      expect(error).to.be.undefined;
    });

    it('应该拒绝空评论', () => {
      const invalidData = {
        comment_text: ''
      };
      const { error } = createCommentSchema.validate(invalidData);
      expect(error).to.exist;
    });

    it('应该拒绝过长的评论', () => {
      const invalidData = {
        comment_text: 'a'.repeat(501)
      };
      const { error } = createCommentSchema.validate(invalidData);
      expect(error).to.exist;
    });
  });

  // ========== 关注验证测试 ==========
  describe('followUserSchema', () => {
    
    it('应该接受有效的关注数据', () => {
      const validData = {
        followed_id: 2
      };
      const { error } = followUserSchema.validate(validData);
      expect(error).to.be.undefined;
    });

    it('应该拒绝缺少 followed_id 的数据', () => {
      const invalidData = {};
      const { error } = followUserSchema.validate(invalidData);
      expect(error).to.exist;
    });
  });

  // ========== 拉黑验证测试 ==========
  describe('blacklistUserSchema', () => {
    
    it('应该接受有效的拉黑数据', () => {
      const validData = {
        blacked_user_id: 3,
        black_reason: '测试原因'
      };
      const { error } = blacklistUserSchema.validate(validData);
      expect(error).to.be.undefined;
    });

    it('应该拒绝缺少 blacked_user_id 的数据', () => {
      const invalidData = {
        black_reason: '测试原因'
      };
      const { error } = blacklistUserSchema.validate(invalidData);
      expect(error).to.exist;
    });
  });

  // ========== 采纳答案验证测试 ==========
  describe('adoptBestAnswerSchema', () => {
    
    it('应该接受有效的采纳数据', () => {
      const validData = {
        comment_id: 123
      };
      const { error } = adoptBestAnswerSchema.validate(validData);
      expect(error).to.be.undefined;
    });

    it('应该拒绝缺少 comment_id 的数据', () => {
      const invalidData = {};
      const { error } = adoptBestAnswerSchema.validate(invalidData);
      expect(error).to.exist;
    });
  });

  // ========== 举报验证测试 ==========
  describe('createReportSchema', () => {
    
    it('应该接受有效的举报数据', () => {
      const validData = {
        report_type: 1,
        report_obj_id: 123,
        report_reason: 1,
        report_detail: '测试举报详情'
      };
      const { error } = createReportSchema.validate(validData);
      expect(error).to.be.undefined;
    });

    it('应该拒绝无效的举报类型', () => {
      const invalidData = {
        report_type: 99,
        report_obj_id: 123,
        report_reason: 1
      };
      const { error } = createReportSchema.validate(invalidData);
      expect(error).to.exist;
    });
  });

  // ========== 处理举报验证测试 ==========
  describe('handleReportSchema', () => {
    
    it('应该接受有效的处理数据（立案）', () => {
      const validData = {
        audit_result: 'approve',
        audit_remark: '测试备注',
        violation: {
          handle_measure: 1,
          handle_remark: '处理说明'
        }
      };
      const { error } = handleReportSchema.validate(validData);
      expect(error).to.be.undefined;
    });

    it('应该接受有效的处理数据（不立案）', () => {
      const validData = {
        audit_result: 'reject',
        audit_remark: '测试备注'
      };
      const { error } = handleReportSchema.validate(validData);
      expect(error).to.be.undefined;
    });

    it('应该拒绝无效的审核结果', () => {
      const invalidData = {
        audit_result: 'invalid'
      };
      const { error } = handleReportSchema.validate(invalidData);
      expect(error).to.exist;
    });
  });

  // ========== 分页验证测试 ==========
  describe('paginationSchema', () => {
    
    it('应该接受有效的分页参数', () => {
      const validData = {
        page: 1,
        limit: 20,
        sort: 'latest'
      };
      const { error } = paginationSchema.validate(validData);
      expect(error).to.be.undefined;
    });

    it('应该使用默认值', () => {
      const data = {};
      const { error, value } = paginationSchema.validate(data);
      expect(error).to.be.undefined;
      expect(value.page).to.equal(1);
      expect(value.limit).to.equal(20);
      expect(value.sort).to.equal('latest');
    });

    it('应该拒绝无效的排序方式', () => {
      const invalidData = {
        sort: 'invalid'
      };
      const { error } = paginationSchema.validate(invalidData);
      expect(error).to.exist;
    });
  });
});
