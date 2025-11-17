const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const QARelation = sequelize.define('QARelation', {
  qa_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '问答ID'
  },
  content_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    comment: '问题内容ID'
  },
  best_comment_id: {
    type: DataTypes.INTEGER,
    comment: '最佳答案评论ID'
  },
  qa_status: {
    type: DataTypes.SMALLINT,
    defaultValue: 0,
    comment: '问答状态：0=待解决，1=已解决'
  },
  resolve_time: {
    type: DataTypes.DATE,
    comment: '解决时间'
  },
  reward_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: '悬赏金额'
  },
  reward_status: {
    type: DataTypes.SMALLINT,
    defaultValue: 0,
    comment: '悬赏状态：0=未设置，1=待发放，2=已发放'
  },
  reward_time: {
    type: DataTypes.DATE,
    comment: '奖励发放时间'
  },
  create_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '创建时间'
  },
  update_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '更新时间'
  }
}, {
  tableName: 'community_qa_relation',
  timestamps: false,
  indexes: [
    { fields: ['qa_status'] }
  ]
});

module.exports = QARelation;
