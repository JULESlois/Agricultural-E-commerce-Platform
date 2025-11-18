const {
  sequelize,
  Content,
  Comment,
  Category,
  Follow,
  Like,
  Collect,
  Tag,
  ContentTag,
  QARelation,
  Report,
  Violation,
  Blacklist
} = require('../../models');

describe('Models 单元测试', () => {
  describe('模型定义测试', () => {
    test('所有模型应该正确定义', () => {
      const models = {
        Content,
        Comment,
        Category,
        Follow,
        Like,
        Collect,
        Tag,
        ContentTag,
        QARelation,
        Report,
        Violation,
        Blacklist
      };

      Object.entries(models).forEach(([name, model]) => {
        expect(model).toBeDefined();
        expect(model.name).toBe(name);
      });
    });

    test('Content 模型应该有正确的字段', () => {
      const attributes = Object.keys(Content.rawAttributes);
      expect(attributes).toContain('content_id');
      expect(attributes).toContain('author_id');
      expect(attributes).toContain('category_id');
      expect(attributes).toContain('content_type');
      expect(attributes).toContain('content_title');
      expect(attributes).toContain('content_text');
    });

    test('Category 模型应该有正确的字段', () => {
      const attributes = Object.keys(Category.rawAttributes);
      expect(attributes).toContain('category_id');
      expect(attributes).toContain('parent_id');
      expect(attributes).toContain('category_name');
      expect(attributes).toContain('is_enabled');
    });

    test('Comment 模型应该有正确的字段', () => {
      const attributes = Object.keys(Comment.rawAttributes);
      expect(attributes).toContain('comment_id');
      expect(attributes).toContain('content_id');
      expect(attributes).toContain('commenter_id');
      expect(attributes).toContain('comment_text');
      expect(attributes).toContain('parent_id');
    });
  });

  describe('模型关联测试', () => {
    test('Content 应该有正确的关联', () => {
      expect(Content.associations.category).toBeDefined();
      expect(Content.associations.comments).toBeDefined();
      expect(Content.associations.likes).toBeDefined();
      expect(Content.associations.collects).toBeDefined();
      expect(Content.associations.tags).toBeDefined();
      expect(Content.associations.qaRelation).toBeDefined();
    });

    test('Category 应该有正确的关联', () => {
      expect(Category.associations.contents).toBeDefined();
    });

    test('Comment 应该有正确的关联', () => {
      expect(Comment.associations.content).toBeDefined();
      expect(Comment.associations.replies).toBeDefined();
      expect(Comment.associations.parent).toBeDefined();
    });

    test('Tag 应该有正确的关联', () => {
      expect(Tag.associations.contents).toBeDefined();
    });

    test('QARelation 应该有正确的关联', () => {
      expect(QARelation.associations.content).toBeDefined();
      expect(QARelation.associations.bestAnswer).toBeDefined();
    });

    test('Report 应该有正确的关联', () => {
      expect(Report.associations.violation).toBeDefined();
    });

    test('Violation 应该有正确的关联', () => {
      expect(Violation.associations.report).toBeDefined();
    });
  });

  describe('基本查询测试', () => {
    test('Category.findAll 应该正常工作', async () => {
      const categories = await Category.findAll({ limit: 5 });
      expect(Array.isArray(categories)).toBe(true);
    });

    test('Tag.findAll 应该正常工作', async () => {
      const tags = await Tag.findAll({ limit: 5 });
      expect(Array.isArray(tags)).toBe(true);
    });

    test('Content.findAll 带关联查询应该正常工作', async () => {
      const contents = await Content.findAll({
        include: [
          { model: Category, as: 'category' },
          { model: Comment, as: 'comments' }
        ],
        limit: 5
      });
      expect(Array.isArray(contents)).toBe(true);
    });

    test('Follow.findAll 应该正常工作', async () => {
      const follows = await Follow.findAll({ limit: 5 });
      expect(Array.isArray(follows)).toBe(true);
    });

    test('Like.findAll 应该正常工作', async () => {
      const likes = await Like.findAll({ limit: 5 });
      expect(Array.isArray(likes)).toBe(true);
    });

    test('Collect.findAll 应该正常工作', async () => {
      const collects = await Collect.findAll({ limit: 5 });
      expect(Array.isArray(collects)).toBe(true);
    });

    test('QARelation.findAll 应该正常工作', async () => {
      const qaRelations = await QARelation.findAll({ limit: 5 });
      expect(Array.isArray(qaRelations)).toBe(true);
    });

    test('Report.findAll 应该正常工作', async () => {
      const reports = await Report.findAll({ limit: 5 });
      expect(Array.isArray(reports)).toBe(true);
    });

    test('Blacklist.findAll 应该正常工作', async () => {
      const blacklist = await Blacklist.findAll({ limit: 5 });
      expect(Array.isArray(blacklist)).toBe(true);
    });
  });

  describe('复杂查询测试', () => {
    test('内容与标签多对多关联查询', async () => {
      const contentWithTags = await Content.findOne({
        include: [
          { model: Tag, as: 'tags' }
        ]
      });
      expect(contentWithTags === null || typeof contentWithTags === 'object').toBe(true);
    });

    test('问答关系复杂查询', async () => {
      const qaWithContent = await QARelation.findOne({
        include: [
          { model: Content, as: 'content' },
          { model: Comment, as: 'bestAnswer' }
        ]
      });
      expect(qaWithContent === null || typeof qaWithContent === 'object').toBe(true);
    });

    test('举报与违规记录关联查询', async () => {
      const reportWithViolation = await Report.findOne({
        include: [
          { model: Violation, as: 'violation' }
        ]
      });
      expect(reportWithViolation === null || typeof reportWithViolation === 'object').toBe(true);
    });
  });
});
