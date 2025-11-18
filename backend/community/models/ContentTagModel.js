const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ContentTag = sequelize.define('ContentTag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'ID'
  },
  content_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '内容ID'
  },
  tag_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '标签ID'
  },
  create_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '创建时间'
  }
}, {
  tableName: 'community_content_tags',
  timestamps: false,
  indexes: [
    { fields: ['tag_id'] },
    { unique: true, fields: ['content_id', 'tag_id'] }
  ]
});

module.exports = ContentTag;
