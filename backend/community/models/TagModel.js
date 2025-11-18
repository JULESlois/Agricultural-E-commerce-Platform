const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Tag = sequelize.define('Tag', {
  tag_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '标签ID'
  },
  tag_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: '标签名称'
  },
  use_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '使用次数'
  },
  is_enabled: {
    type: DataTypes.SMALLINT,
    defaultValue: 1,
    comment: '是否启用：0=禁用，1=启用'
  },
  create_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '创建时间'
  }
}, {
  tableName: 'community_tags',
  timestamps: false,
  indexes: [
    { fields: ['is_enabled'] }
  ]
});

module.exports = Tag;
