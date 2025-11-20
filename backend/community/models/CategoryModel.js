const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Category = sequelize.define('Category', {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '分类ID'
  },
  parent_id: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '父分类ID，0表示顶级分类'
  },
  category_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '分类名称'
  },
  category_desc: {
    type: DataTypes.STRING(500),
    comment: '分类描述'
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '排序'
  },
  is_enabled: {
    type: DataTypes.SMALLINT,
    defaultValue: 1,
    comment: '是否启用：0=禁用，1=启用'
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
  tableName: 'community_categories',
  timestamps: false,
  freezeTableName: true
});

module.exports = Category;