const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Violation = sequelize.define('Violation', {
  violation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '违规ID'
  },
  report_id: {
    type: DataTypes.INTEGER,
    comment: '关联的举报ID'
  },
  violator_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '违规者用户ID'
  },
  violation_type: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    comment: '违规类型：1=内容违规，2=评论违规，3=用户违规'
  },
  violation_obj_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '违规对象ID'
  },
  handle_measure: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    comment: '处理措施：1=删除内容，2=警告，3=禁言，4=封号'
  },
  handle_remark: {
    type: DataTypes.STRING(500),
    comment: '处理说明'
  },
  handler_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '处理人ID'
  },
  create_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '创建时间'
  }
}, {
  tableName: 'community_violations',
  timestamps: false,
  indexes: [
    { fields: ['violator_id'] },
    { fields: ['report_id'] }
  ]
});

module.exports = Violation;
