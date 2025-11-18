const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Blacklist = sequelize.define('Blacklist', {
  black_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '黑名单ID'
  },
  blocker_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '拉黑者用户ID'
  },
  blacked_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '被拉黑用户ID'
  },
  black_reason: {
    type: DataTypes.STRING(500),
    comment: '拉黑原因'
  },
  create_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '创建时间'
  }
}, {
  tableName: 'community_blacklist',
  timestamps: false,
  indexes: [
    { fields: ['blocker_id'] },
    { unique: true, fields: ['blocker_id', 'blacked_user_id'] }
  ]
});

module.exports = Blacklist;
