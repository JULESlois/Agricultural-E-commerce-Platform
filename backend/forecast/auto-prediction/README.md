# 农产品价格自动预测系统

## 📁 目录说明

本目录包含农产品价格自动预测系统的所有文件。

## 🚀 快速开始

### 1. 安装
```bash
install.bat
```

### 2. 启动
确保 Python 预测服务运行后：
```bash
start-auto-predict.bat
```

### 3. 查看结果
```bash
view-results.bat
```

## 📋 文件说明

### 核心程序
- `auto-predict.js` - 自动预测服务主程序（定时任务）
- `run-prediction.js` - 预测任务执行器
- `prediction-service.js` - 预测服务接口（调用 Python API）
- `db-client.js` - 数据库客户端
- `init-database.js` - 数据库初始化

### 工具脚本
- `query-predictions.js` - 查询预测结果
- `compare-models.js` - 对比 ARIMA 和 LSTM 模型
- `test-prediction.js` - 系统测试

### 批处理文件
- `install.bat` - 安装系统
- `start-auto-predict.bat` - 启动自动预测服务
- `view-results.bat` - 查看预测结果
- `compare-models.bat` - 对比模型结果
- `install-as-service.bat` - 安装为 Windows 服务

### 配置文件
- `.env` - 环境变量配置
- `package.json` - Node.js 项目配置
- `database-schema.sql` - 数据库表结构

### 文档
- `使用说明.txt` - 详细使用说明
- `系统说明.txt` - 系统功能说明
- `开始使用.txt` - 快速入门
- `安装完成.txt` - 安装完成提示

## 🎯 功能特点

- ✅ 同时使用 ARIMA 和 LSTM 两种模型
- ✅ 每天自动预测全国月度农产品价格
- ✅ 每个产品生成两组预测（各3期）
- ✅ 预测结果自动保存到 PostgreSQL 数据库
- ✅ 可对比两种模型的预测差异

## 📊 数据库表

- `price_predictions` - 预测结果表
- `prediction_logs` - 任务日志表

## 🔧 常用命令

```bash
npm start          # 启动自动预测服务
npm run predict    # 手动执行一次预测
npm run query      # 查看预测结果
npm run compare    # 对比模型结果
npm test           # 测试系统
```

## ⚙️ 配置

编辑 `.env` 文件：
- `CRON_SCHEDULE` - 定时执行时间（默认每天凌晨2点）
- `PREDICTION_PERIODS` - 预测期数（默认3期）
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - 数据库配置

## ⚠️ 注意事项

1. 必须先启动 Python 预测服务（`../app.py`）
2. 确保数据库连接正常
3. 首次预测可能需要较长时间（30-60分钟）

## 📞 获取帮助

查看详细文档：
- `使用说明.txt` - 完整使用说明
- `系统说明.txt` - 系统架构和功能说明
