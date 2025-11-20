const Content = require('./ContentModel');
const Comment = require('./CommentModel');
const Category = require('./CategoryModel');
const Follow = require('./FollowModel');
const Like = require('./LikeModel');
const Collect = require('./CollectModel');
const Tag = require('./TagModel');
const ContentTag = require('./ContentTagModel');
const QARelation = require('./QARelationModel');
const Report = require('./ReportModel');
const Violation = require('./ViolationModel');
const Blacklist = require('./BlacklistModel');

// 设置模型关联关系
const setupAssociations = () => {
  // ========== 内容与分类 ==========
  Content.belongsTo(Category, {
    foreignKey: 'category_id',
    as: 'category'
  });

  Category.hasMany(Content, {
    foreignKey: 'category_id',
    as: 'contents'
  });

  // ========== 内容与评论 ==========
  Content.hasMany(Comment, {
    foreignKey: 'content_id',
    as: 'comments'
  });

  Comment.belongsTo(Content, {
    foreignKey: 'content_id',
    as: 'content'
  });

  // ========== 评论自关联（父子评论）==========
  Comment.hasMany(Comment, {
    foreignKey: 'parent_id',
    as: 'replies'
  });

  Comment.belongsTo(Comment, {
    foreignKey: 'parent_id',
    as: 'parent'
  });

  // ========== 内容与点赞 ==========
  Content.hasMany(Like, {
    foreignKey: 'content_id',
    as: 'likes'
  });

  Like.belongsTo(Content, {
    foreignKey: 'content_id',
    as: 'content'
  });

  // ========== 内容与收藏 ==========
  Content.hasMany(Collect, {
    foreignKey: 'content_id',
    as: 'collects'
  });

  Collect.belongsTo(Content, {
    foreignKey: 'content_id',
    as: 'content'
  });

  // ========== 内容与标签（多对多）==========
  Content.belongsToMany(Tag, {
    through: ContentTag,
    foreignKey: 'content_id',
    otherKey: 'tag_id',
    as: 'tags'
  });

  Tag.belongsToMany(Content, {
    through: ContentTag,
    foreignKey: 'tag_id',
    otherKey: 'content_id',
    as: 'contents'
  });

  // ========== 内容与问答关系 ==========
  Content.hasOne(QARelation, {
    foreignKey: 'content_id',
    as: 'qaRelation'
  });

  QARelation.belongsTo(Content, {
    foreignKey: 'content_id',
    as: 'content'
  });

  // 问答关系与最佳答案评论
  QARelation.belongsTo(Comment, {
    foreignKey: 'best_comment_id',
    as: 'bestAnswer'
  });

  // ========== 举报与违规记录 ==========
  Report.hasOne(Violation, {
    foreignKey: 'report_id',
    as: 'violation'
  });

  Violation.belongsTo(Report, {
    foreignKey: 'report_id',
    as: 'report'
  });

  console.log('✅ 模型关联关系设置完成');
};

module.exports = setupAssociations;