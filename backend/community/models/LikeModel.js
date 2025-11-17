const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Like = sequelize.define('Like', {
  like_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '点赞ID'
  },
  content_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '内容ID'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '用户ID'
  },
  create_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '创建时间'
  }
}, {
  tableName: 'community_likes',
  timestamps: false,
  indexes: [
    { fields: ['user_id'] },
    { unique: true, fields: ['content_id', 'user_id'] }
  ]
});

module.exports = Like;
