const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const LoanType = require('./loanModel');

// 融资申请模型
const FinancingApplication = sequelize.define('FinancingApplication', {
  application_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '申请ID'
  },
  application_no: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
    comment: '申请编号（格式：FIN+日期+随机数）'
  },
  farmer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '农户ID（关联 sys_user.user_id）'
  },
  loan_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '贷款类型ID（关联 financing_loan_types.loan_type_id）'
  },
  apply_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    comment: '申请金额'
  },
  apply_term: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '申请期限（单位：月）'
  },
  loan_purpose_detail: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '贷款用途详情'
  },
  repayment_plan: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '还款计划描述'
  },
  bank_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '申请银行ID'
  },
  material_urls: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '材料URL（JSON格式数组）'
  },
  application_status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '申请状态（1=待信用评估，2=待银行审批，3=审批通过，4=已放款，5=已驳回）'
  },
  approval_result: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '审批结果（1=通过，0=驳回）'
  },
  approval_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    comment: '批准金额'
  },
  approval_term: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '批准期限（单位：月）'
  },
  interest_rate: {
    type: DataTypes.DECIMAL(6, 4),
    allowNull: true,
    comment: '批准利率'
  },
  approval_remark: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '审批备注'
  },
  approval_time: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '审批时间'
  },
  disburse_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    comment: '放款金额'
  },
  disburse_account: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '放款账户'
  },
  disburse_remark: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '放款备注'
  },
  disburse_time: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '放款时间'
  },
  create_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '创建时间'
  }
}, {
  tableName: 'financing_applications',
  timestamps: false,
  freezeTableName: true,
  // 关联贷款类型表
  associate: () => {
    FinancingApplication.belongsTo(LoanType, { 
      foreignKey: 'loan_type_id', 
      as: 'loanType' 
    });
  }
});

// 同步模型到数据库
// FinancingApplication.sync({ alter: true }).then(() => console.log('FinancingApplication 模型同步完成'));

module.exports = FinancingApplication;