const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Follow = sequelize.define('Follow', {
  follow_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '关注ID'
  },
  follower_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '关注者用户ID'
  },
  followed_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '被关注者用户ID'
  },
  follow_source: {
    type: DataTypes.SMALLINT,
    defaultValue: 1,
    comment: '关注来源：1=主动关注'
  },
  create_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '创建时间'
  }
}, {
  tableName: 'community_follows',
  timestamps: false,
  indexes: [
    { fields: ['follower_id'] },
    { fields: ['followed_id'] },
    { unique: true, fields: ['follower_id', 'followed_id'] }
  ]
});

module.exports = Follow;
