## 端口与路径
- 市场服务（Node/Express）：3010（基础路径 `/api`）
- 认证服务（Node/Express）：3020（基础路径 `/api`）
- 社区服务（Node/Express）：3030（基础路径 `/api/community`）
- 融资服务（Spring Boot）：保持 8082（上下文 `/finance`，基础 URL `http://localhost:8082/finance`）
- 前端（Vite）：3000（保持不变）

## 后端端口设置方案
- Node 服务（market/auth/community）：不改代码，通过环境变量 `PORT` 注入端口。
  - 市场：`PORT=3010`
  - 认证：`PORT=3020`
  - 社区：`PORT=3030`
- Finance（Spring Boot）：端口不变，无需改动配置文件；继续使用 `server.port=8082` 与 `server.servlet.context-path=/finance`。

## 前端 API Base 同步
- 使用 Vite 环境变量覆盖默认 Base：
  - `VITE_MARKET_BASE=http://localhost:3010/api`
  - `VITE_AUTH_BASE=http://localhost:3020/api`
  - `VITE_COMMUNITY_BASE=http://localhost:3030/api/community`
  - `VITE_FINANCE_BASE=http://localhost:8082/finance/api`（不变）
- 启动前端前设置以上环境变量，以确保请求指向新端口；保留代码中的回退以防变量缺失时仍可运行。

## 一键启动脚本更新
- Windows 批处理脚本（不改服务代码）：
  - 为各 Node 服务窗口设置 `PORT` 后执行 `npm run start`。
  - Finance 执行 `mvn spring-boot:run -Dspring-boot.run.profiles=dev`（端口不变）。
  - 前端窗口在启动前设置上述 `VITE_...` 环境变量并执行 `npm run dev`。

## 验证
1. 启动后分别访问与健康检查：
  - 市场 `http://localhost:3010/`、社区 `http://localhost:3030/`、认证 `http://localhost:3020/`、融资 `http://localhost:8082/finance/`
2. 前端 `http://localhost:3000/` 正常登录与业务流程；网络错误时显示 ErrorBanner。

## 变更范围
- 仅变更启动脚本与前端环境变量注入；后端与前端代码逻辑不动。