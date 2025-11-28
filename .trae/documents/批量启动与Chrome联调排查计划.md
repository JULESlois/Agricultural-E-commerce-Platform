## 任务目标
- 运行 `d:\work\a123\Agricultural-E-commerce-Platform\scripts\1.bat` 启动前后端所有子系统
- 使用 Chrome DevTools 进行端到端联调验证（认证→商城→社区→金融）
- 遇到问题现场排查与修复（端口、CORS、数据库、环境变量等）

## 启动准备
- 关闭可能占用端口的现有进程（3010/3020/3030/8082/3000）
- 确认本地 PostgreSQL 正常运行，数据库 `agri`、用户 `agri_root` 可连接
- 了解批处理的端口与环境映射（scripts/1.bat:7-20）：
  - Market: `http://localhost:3010/`
  - Auth: `http://localhost:3020/`
  - Community: `http://localhost:3030/`
  - Finance: `http://localhost:8082/finance/`
  - Frontend: `http://localhost:3000/` 并注入四个 `VITE_*_BASE`

## 执行批处理
- 直接运行 `d:\work\a123\Agricultural-E-commerce-Platform\scripts\1.bat`
- 在各启动窗口查看日志，确认服务启动：
  - 认证服务入口与健康日志（backend/auth/index.js:83-92）
  - 社区服务健康路由（backend/community/index.js:92-97）
  - 市场服务启动与数据库连接日志（backend/market/index.js:117-119）
  - 金融服务激活的 profile 与端口（application-local.properties 生效）

## Chrome 联调步骤
- 打开 `http://localhost:3000/`
- DevTools 设置：Network 勾选 Preserve log、Disable cache；Console 可直接 `fetch`
- 认证流程（BASES.AUTH → `http://localhost:3020/api`）
  - 登录：`POST /api/auth/login`（若无已知账号，尝试注册或使用测账号）
  - 获取个人信息：`GET /api/users/me`（携带 `Authorization: Bearer <token>`）
  - 将 token 写入 `localStorage.setItem('token', '<token>')`
- 商城流程（BASES.MARKET → `http://localhost:3010/api`）
  - 商品列表：`GET /market/products`（异常时应 200 + 空列表，backend/market/index.js:85-106）
  - 购物车：`POST /cart/add`、`GET /cart`、`PUT /cart/:id`、`DELETE /cart/:id`
  - 订单：`POST /orders`、`POST /orders/:id/pay`、`POST /buyer/orders/:id/confirm-receipt`
- 社区流程（BASES.COMMUNITY → `http://localhost:3030/api/community`）
  - 内容列表：`GET /content`
  - 详情与评论：`GET /content/:id`、`GET /content/:id/comments`
  - 交互：`POST /content/:id/comments`、`POST/DELETE /content/:id/like`、`POST/DELETE /content/:id/collect`
- 金融流程（BASES.FINANCE → `http://localhost:8082/finance/api`）
  - 贷款类型：`GET /financing/loan-types`
  - 申请：`POST /farmer/financing/applications`
  - 审核：`GET /bank/financing/applications`、`POST /bank/financing/applications/:id/review`

## 常见问题与现场排查
- 端口不一致或被占用
  - 现象：启动失败或无法访问；处理：终止占用进程后重启对应窗口
- CORS 受限导致前端接口失败
  - 认证服务已启用 CORS（backend/auth/index.js:13-22）；若仍报错，检查响应头与前端来源
- 市场 `/health` 无法访问
  - 可能为路由未开放或网络层阻拦；直接测实际 API `/api/market/products`
- 金融健康接口 403
  - 默认安全策略；不影响业务 API（调用 `/finance/api/...` 验证）
- 数据库连接失败
  - 检查 `.env`/`dbconfig.json` 指向是否为本地；确认 `agri_root` 能连接；日志关键位置：market（backend/market/index.js:117-119）
- 前端 BASES 未生效
  - 在浏览器 Console 打印 `import.meta.env` 检查；确保批处理已注入四个 `VITE_*_BASE`

## 验证输出
- 记录每个子系统的关键接口响应（状态码、响应体）与控制台/Network 截图
- 汇总问题与修复动作（如改端口、改 CORS、更新环境变量、重启服务）

## 完成标准
- 前端从 3000 页面发起的请求全部命中本地后端对应端口
- 认证→商城→社区→金融全链路主要接口返回期望结果
- 无跨域/端口/数据库连接类错误；遇到问题已现场修复并复测通过

请确认我开始执行批处理、打开 Chrome 并进行上述联调与现场修复。