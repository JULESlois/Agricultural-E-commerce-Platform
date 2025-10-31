const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const FinancingApplication = require('./applicationModel').default;

const CreditEvaluation = sequelize.define('CreditEvaluation', {
  evaluation_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  application_id: { type: DataTypes.INTEGER, allowNull: false, comment: '申请ID' },
  credit_score: { type: DataTypes.INTEGER, allowNull: false, comment: '信用分数（0-100）' },
  credit_level: { type: DataTypes.CHAR(2), allowNull: false, comment: '信用等级（A级/B级/C级）' },
  score_detail: { type: DataTypes.JSON, allowNull: false, comment: '分数详情（JSON）' },
  evaluation_result: { type: DataTypes.INTEGER, allowNull: false, comment: '评估结果（1=通过，0=驳回）' },
  evaluation_remark: { type: DataTypes.TEXT, allowNull: false, comment: '评估备注' },
  credit_report_url: { type: DataTypes.STRING(200), allowNull: false, comment: '信用报告URL' },
  evaluation_time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, comment: '评估时间' }
}, {
  tableName: 'financing_credit_evaluations',
  timestamps: false,
  freezeTableName: true,
  associate: () => {
    CreditEvaluation.belongsTo(FinancingApplication, { foreignKey: 'application_id', as: 'application' });
  }
});

// CreditEvaluation.sync({ alter: true }).then(() => console.log('CreditEvaluation 模型同步完成'));

module.exports = CreditEvaluation;