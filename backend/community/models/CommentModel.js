const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Comment = sequelize.define('Comment', {
  comment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '评论ID'
  },
  content_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '内容ID'
  },
  commenter_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '评论者ID'
  },
  parent_id: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '父评论ID（0表示顶级评论）'
  },
  comment_text: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '评论内容'
  },
  like_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '点赞数'
  },
  audit_status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: '审核状态（0=待审核，1=已通过，2=已驳回）'
  },
  is_deleted: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '是否删除（0=否，1=是）'
  },
  create_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '创建时间'
  }
}, {
  tableName: 'community_comments',
  timestamps: false,
  freezeTableName: true
});

module.exports = Comment;