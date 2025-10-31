// 导入所有需要的模型
const LoanType = require('./loanModel');
const FinancingApplication = require('./applicationModel');
const CreditEvaluation = require('./creditModel');

// 设置模型关联关系
const setupAssociations = () => {
  // 融资申请 belongsTo 贷款类型
  FinancingApplication.belongsTo(LoanType, {
    foreignKey: 'loan_type_id',
    as: 'loanType'
  });

  // 融资申请 hasOne 信用评估
  FinancingApplication.hasOne(CreditEvaluation, {
    foreignKey: 'application_id',
    as: 'creditEvaluation'
  });

  // 信用评估 belongsTo 融资申请
  CreditEvaluation.belongsTo(FinancingApplication, {
    foreignKey: 'application_id',
    as: 'application'
  });

  // 贷款类型 hasMany 融资申请
  LoanType.hasMany(FinancingApplication, {
    foreignKey: 'loan_type_id',
    as: 'applications'
  });
};

// 保持CommonJS导出方式
module.exports = setupAssociations;