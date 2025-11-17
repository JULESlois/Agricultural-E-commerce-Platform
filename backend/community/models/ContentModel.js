const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Content = sequelize.define('Content', {
  content_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '内容ID'
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '作者ID'
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '分类ID'
  },
  content_type: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '内容类型（1=文章，2=视频，3=问题）'
  },
  content_title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: '内容标题'
  },
  content_text: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '内容正文'
  },
  content_cover: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: '封面图URL'
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '浏览量'
  },
  like_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '点赞数'
  },
  comment_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '评论数'
  },
  collect_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '收藏数'
  },
  share_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '分享数'
  },
  audit_status: {
    type: DataTypes.SMALLINT,
    defaultValue: 0,
    comment: '审核状态：0=待审核，1=已通过，2=未通过'
  },
  is_deleted: {
    type: DataTypes.SMALLINT,
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '是否删除（0=否，1=是）'
  },
  create_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '创建时间'
  },
  update_time: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '更新时间'
  }
}, {
  tableName: 'community_content',
  timestamps: false,
  freezeTableName: true
});

module.exports = Content;