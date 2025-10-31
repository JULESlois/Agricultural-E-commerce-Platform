const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// 贷款产品模型
const LoanType = sequelize.define('LoanType', {
  loan_type_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '贷款类型ID'
  },
  loan_type_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '贷款类型名称（如：种植周转贷）'
  },
  loan_purpose: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '贷款用途描述'
  },
  min_loan_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    comment: '最小贷款金额'
  },
  max_loan_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    comment: '最大贷款金额'
  },
  min_loan_term: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '最短贷款期限'
  },
  max_loan_term: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '最长贷款期限'
  },
  loan_term_type: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2,
    comment: '期限类型（2=按月，1=按天）'
  },
  min_interest_rate: {
    type: DataTypes.DECIMAL(6, 4),
    allowNull: false,
    comment: '最低年利率（如：0.0435=4.35%）'
  },
  required_materials: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: '所需材料（逗号分隔）'
  },
  support_banks: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: '支持银行（逗号分隔）'
  },
  create_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '创建时间'
  }
}, {
  tableName: 'financing_loan_types', // 对应数据库表名
  timestamps: false, // 不自动生成 createAt/updateAt 字段
  freezeTableName: true // 禁止表名复数化
});

// 同步模型到数据库（开发环境使用，生产环境建议手动执行 SQL）
// LoanType.sync({ alter: true }).then(() => console.log('LoanType 模型同步完成'));

module.exports = LoanType;