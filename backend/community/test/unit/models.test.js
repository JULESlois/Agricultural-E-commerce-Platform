/**
 * Models 单元测试
 */

const { expect } = require('chai');
const {
  sequelize,
  Content,
  Comment,
  Category,
  Follow,
  Like,
  Collect,
  Tag,
  QARelation,
  Report
} = require('../../models');

describe('Models 单元测试', () => {
  before(async () => {
    // 测试数据库连接
    await sequelize.authenticate();
  });

  after(async () => {
    await sequelize.close();
  });

  describe('Category Model', () => {
    it('应该能够查询分类', async () => {
      const categories = await Category.findAll({ limit: 5 });
      expect(categories).to.be.an('array');
    });

    it('应该包含正确的字段', async () => {
      const category = await Category.findOne();
      if (category) {
        expect(category).to.have.property('category_id');
        expect(category).to.have.property('category_name');
        expect(category).to.have.property('parent_id');
        expect(category).to.have.property('is_enabled');
      }
    });
  });

  describe('Content Model', () => {
    it('应该能够查询内容', async () => {
      const contents = await Content.findAll({ limit: 5 });
      expect(contents).to.be.an('array');
    });

    it('应该包含正确的字段', async () => {
      const content = await Content.findOne();
      if (content) {
        expect(content).to.have.
      expect(Like.tableName).to.equal('community_likes');
    }});

    it('Collect 模型应该正确定义', () => {
      expect(Collect).to.exist;
      expect(Collect.tableName).to.equal('community_collects');
    });

    it('Tag 模型应该正确定义', () => {
      expect(Tag).to.exist;
      expect(Tag.tableName).to.equal('community_tags');
    });

    it('QARelation 模型应该正确定义', () => {
      expect(QARelation).to.exist;
      expect(QARelation.tableName).to.equal('community_qa_relation');
    });
  });

  // ========== 模型关联测试 ==========
  describe('模型关联', () => {
    
    it('Content 应该有 category 关联', () => {
      expect(Content.associations).to.have.property('category');
    });

    it('Content 应该有 comments 关联', () => {
      expect(Content.associations).to.have.property('comments');
    });

    it('Content 应该有 tags 关联', () => {
      expect(Content.associations).to.have.property('tags');
    });

    it('Content 应该有 likes 关联', () => {
      expect(Content.associations).to.have.property('likes');
    });

    it('Content 应该有 collects 关联', () => {
      expect(Content.associations).to.have.property('collects');
    });

    it('Comment 应该有 content 关联', () => {
      expect(Comment.associations).to.have.property('content');
    });

    it('Comment 应该有 replies 关联（自关联）', () => {
      expect(Comment.associations).to.have.property('replies');
    });

    it('Category 应该有 contents 关联', () => {
      expect(Category.associations).to.have.property('contents');
    });
  });

  // ========== 基本查询测试 ==========
  describe('基本查询', () => {
    
    it('应该能查询 Category', async () => {
      const categories = await Category.findAll({ limit: 5 });
      expect(categories).to.be.an('array');
    });

    it('应该能查询 Tag', async () => {
      const tags = await Tag.findAll({ limit: 5 });
      expect(tags).to.be.an('array');
    });

    it('应该能查询 Content（带关联）', async () => {
      const contents = await Content.findAll({
        include: [
          { model: Category, as: 'category' }
        ],
        limit: 5
      });
      expect(contents).to.be.an('array');
    });

    it('应该能查询 Follow', async () => {
      const follows = await Follow.findAll({ limit: 5 });
      expect(follows).to.be.an('array');
    });

    it('应该能查询 Like', async () => {
      const likes = await Like.findAll({ limit: 5 });
      expect(likes).to.be.an('array');
    });
  });

  // ========== 复杂查询测试 ==========
  describe('复杂查询', () => {
    
    it('应该能查询内容及其标签（多对多）', async () => {
      const content = await Content.findOne({
        include: [
          { model: Tag, as: 'tags' }
        ]
      });
      if (content) {
        expect(content).to.have.property('tags');
      }
    });

    it('应该能查询问答关系', async () => {
      const qaRelation = await QARelation.findOne({
        include: [
          { model: Content, as: 'content' }
        ]
      });
      if (qaRelation) {
        expect(qaRelation).to.have.property('content');
      }
    });
  });
});
