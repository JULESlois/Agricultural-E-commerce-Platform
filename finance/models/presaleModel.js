const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PresalePlan = sequelize.define('PresalePlan', {
  plan_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  farmer_id: { type: DataTypes.INTEGER, allowNull: false, comment: '农户ID' },
  category_id: { type: DataTypes.INTEGER, allowNull: false, comment: '农产品分类ID' },
  product_name: { type: DataTypes.STRING(100), allowNull: false, comment: '产品名称' },
  plant_date: { type: DataTypes.DATE, allowNull: false, comment: '种植日期' },
  expected_harvest_date: { type: DataTypes.DATE, allowNull: false, comment: '预计收获日期' },
  total_yield_quantity: { type: DataTypes.DECIMAL(10, 2), allowNull: false, comment: '总产量（公斤）' },
  presale_unit_price: { type: DataTypes.DECIMAL(8, 2), allowNull: false, comment: '预售单价（元/公斤）' },
  deposit_ratio: { type: DataTypes.DECIMAL(5, 2), allowNull: false, comment: '定金比例（如：0.3=30%）' },
  presale_status: { type: DataTypes.INTEGER, defaultValue: 1, comment: '预售状态（1=待审核，2=预售中，3=已售罄）' },
  create_time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, comment: '创建时间' }
}, {
  tableName: 'presale_plans',
  timestamps: false,
  freezeTableName: true
});

// PresalePlan.sync({ alter: true }).then(() => console.log('PresalePlan 模型同步完成'));

module.exports = PresalePlan;