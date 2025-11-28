# 农产品价格预测系统 - React 前端

基于 React + Ant Design + ECharts 的前端应用

## 功能特点

- 📊 **多种图表类型**：折线图、柱状图、对比图
- 🎨 **现代化UI**：Ant Design 组件库
- 📈 **数据可视化**：ECharts 图表库
- 🔄 **实时预测**：与后端API实时交互
- 📱 **响应式设计**：适配各种屏幕尺寸

## 快速开始

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 启动开发服务器

```bash
npm start
```

应用将在 http://localhost:3000 打开

### 3. 构建生产版本

```bash
npm run build
```

## 项目结构

```
frontend/
├── public/
│   └── index.html          # HTML模板
├── src/
│   ├── components/         # React组件
│   │   ├── LineChart.js   # 折线图组件
│   │   ├── BarChart.js    # 柱状图组件
│   │   └── CompareChart.js # 对比图组件
│   ├── App.js             # 主应用组件
│   ├── App.css            # 样式文件
│   ├── index.js           # 入口文件
│   └── index.css          # 全局样式
├── package.json           # 依赖配置
└── README.md             # 本文件
```

## 技术栈

- **React 18** - UI框架
- **Ant Design 5** - UI组件库
- **ECharts 5** - 数据可视化
- **Axios** - HTTP客户端

## API配置

后端API地址配置在 `src/App.js` 中：

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

如需修改，请更新此变量。

## 图表类型

### 1. 折线图
- 显示历史数据和预测数据
- 包含置信区间阴影
- 支持交互式缩放

### 2. 柱状图
- 对比历史值和预测值
- 清晰的视觉对比

### 3. 模型对比图
- 同时显示ARIMA和LSTM预测
- 展示模型参数信息
- 计算预测均值

## 使用说明

1. **选择参数**
   - 区域：全国/北京
   - 数据类型：年度/月度
   - 模型：ARIMA/LSTM
   - 预测期数：1-12

2. **开始预测**
   - 点击"开始预测"按钮
   - 查看折线图和柱状图

3. **模型对比**
   - 点击"模型对比"按钮
   - 同时查看两个模型的预测结果

## 注意事项

- 确保后端服务已启动（端口5000）
- 北京地区仅支持年度数据
- 预测期数建议3-6期
