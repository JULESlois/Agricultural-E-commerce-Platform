const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Report = sequelize.define('Report', {
  report_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '举报ID'
  },
  report_no: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: '举报编号'
  },
  reporter_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '举报者用户ID'
  },
  report_type: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    comment: '举报类型：1=内容，2=评论，3=用户'
  },
  report_obj_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '被举报对象ID'
  },
  report_reason: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    comment: '举报原因：1=违法违规，2=广告营销，3=不实信息'
  },
  report_detail: {
    type: DataTypes.TEXT,
    comment: '举报详情'
  },
  report_evidence: {
    type: DataTypes.TEXT,
    comment: '举报证据（JSON数组）'
  },
  is_anonymous: {
    type: DataTypes.SMALLINT,
    defaultValue: 0,
    comment: '是否匿名举报：0=否，1=是'
  },
  audit_status: {
    type: DataTypes.SMALLINT,
    defaultValue: 0,
    comment: '审核状态：0=待处理，1=已立案，2=不予立案'
  },
  auditor_id: {
    type: DataTypes.INTEGER,
    comment: '审核人ID'
  },
  audit_time: {
    type: DataTypes.DATE,
    comment: '审核时间'
  },
  audit_remark: {
    type: DataTypes.STRING(500),
    comment: '审核备注'
  },
  create_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '创建时间'
  }
}, {
  tableName: 'community_reports',
  timestamps: false,
  indexes: [
    { fields: ['reporter_id'] },
    { fields: ['report_type', 'report_obj_id'] },
    { fields: ['audit_status'] }
  ]
});

module.exports = Report;
