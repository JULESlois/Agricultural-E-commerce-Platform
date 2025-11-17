// 统一导出所有模型
const sequelize = require('../config/sequelize');
const setupAssociations = require('./associations');

// 导入所有模型
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

// 设置关联关系
setupAssociations();

// 导出所有模型和 sequelize 实例
module.exports = {
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
};
