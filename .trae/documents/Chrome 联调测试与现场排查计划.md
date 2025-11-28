## 目标
- 使用 Chrome DevTools 对前端与四个后端子系统进行端到端联调验证（认证→商城→社区→金融）
- 在测试过程中，若出现错误，现场定位问题并提出修复方案（端口、CORS、数据库、环境变量、接口路径等）

## 预期端口
- Frontend: `http://localhost:3000/`
- Auth: `http://localhost:3020/`
- Market: `http://localhost:3010/`
- Community: `http://localhost:3030/`
- Finance: `http://localhost:8082/finance/`

## Chrome DevTools 设置
- 打开 `http://localhost:3000/`，按 `F12` 开启 DevTools
- Network 面板：勾选 `Preserve log` 与 `Disable cache`
- Console 面板：用于手工 `fetch` 请求和设置 `localStorage(token)`

## 测试步骤
### 1. 认证服务（3020）
- 登录：
  - Console 执行：
  - `fetch('http://localhost:3020/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({login_identifier:'demo@agri.local',password:'Agri#2025'})}).then(r=>r.json()).then(j=>{console.log(j); localStorage.setItem('token', j?.data?.token||'')})`
- 获取用户信息：
  - `fetch('http://localhost:3020/api/users/me',{headers:{Authorization:'Bearer '+localStorage.getItem('token')}}).then(r=>r.json()).then(console.log)`

### 2. 商城服务（3010）
- 商品列表：
  - `fetch('http://localhost:3010/api/market/products',{headers:{Authorization:'Bearer '+localStorage.getItem('token')}}).then(r=>r.json()).then(console.log)`
- 购物车：
  - 添加：`fetch('http://localhost:3010/api/cart/add',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+localStorage.getItem('token')},body:JSON.stringify({source_id:1,quantity:1})}).then(r=>r.json()).then(console.log)`
  - 列表：`fetch('http://localhost:3010/api/cart',{headers:{Authorization:'Bearer '+localStorage.getItem('token')}}).then(r=>r.json()).then(console.log)`
  - 更新/删除：`PUT/DELETE` 依场景执行
- 订单：
  - 创建/支付/确认收货（按后端接口实际路径执行）

### 3. 社区服务（3030）
- 健康检查：`fetch('http://localhost:3030/health').then(r=>r.json()).then(console.log)`
- 内容列表：`fetch('http://localhost:3030/api/community/content?page=1&page_size=10').then(r=>r.json()).then(console.log)`
- 评论/点赞/收藏：对应 `POST/DELETE` 接口带 `Authorization`

### 4. 金融服务（8082/finance）
- 贷款类型：`fetch('http://localhost:8082/finance/api/financing/loan-types').then(r=>r.json()).then(console.log)`
- 发起申请：`fetch('http://localhost:8082/finance/api/farmer/financing/applications',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+localStorage.getItem('token')},body:JSON.stringify({amount:50000,productName:'惠农e贷',period:12,rate:3.85})}).then(r=>r.json()).then(console.log)`
- 银行审核：`GET /bank/financing/applications` 与 `POST /bank/financing/applications/:id/review`

## 现场排查策略
- 端口或服务未启动：检查批处理窗口日志，必要时重新运行对应服务窗口
- CORS 问题：认证服务已开启 CORS；若其他服务报错，记录响应头并提出修复方案
- 市场 `/health` 不通：直接验证实际业务端点 `/api/market/products`，依据日志“数据库连接成功”判断服务状态
- 金融 `actuator/health` 403：属默认安全限制；改用业务 API 验证
- 前端 BASES 未生效：在 Console 输出 `import.meta.env`，确认四个 `VITE_*_BASE`
- 数据库连接：确认 `.env`/`dbconfig.json` 指向本地 `agri`，并检查连接错误堆栈

## 交付
- 汇总各接口的状态码与响应体，标注异常与修复建议
- 将测试脚本与关键截图留存作为后续回归依据

请确认开始按此步骤进行 Chrome 联调测试并在过程中随时进行现场排查修复。