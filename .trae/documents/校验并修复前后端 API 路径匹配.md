## 范围与现状核对
- 基础地址来源：`frontend/smart-main/api/http.ts:6-11` 定义 `BASES`，通过环境变量 `VITE_*` 注入端口与路径。
- 前端调用位置：
  - 认证：`frontend/smart-main/api/market.ts:9-12` 登录，`frontend/smart-main/store/auth.tsx:18-32` 登录与用户信息；`marketMe` 在 `frontend/smart-main/api/market.ts:14-16`。
  - 市场：`frontend/smart-main/api/market.ts:18-41,59-80` 产品/购物车/订单/确认收货。
  - 社区：`frontend/smart-main/api/community.ts:1-35` 内容/评论/点赞/收藏。
  - 金融：`frontend/smart-main/api/finance.ts:1-30` 贷款类型/农户申请/银行审批。
- 后端路由挂载：
  - 认证：`backend/auth/index.js:45-48` 挂载 `/api/auth` 与 `/api/users`；`backend/auth/routes/auth.js:6-9` 定义 `/login`；`backend/auth/routes/user.js:9-13` 定义 `/me`。
  - 市场：`backend/market/index.js:28-43` 在 `/api` 下挂载订单/购物车/地址/等。
  - 社区：`backend/community/index.js:67-73` 在 `/api/community` 下挂载内容/分类/关注等。
  - 金融：
    - `backend/finance/src/main/java/com/example/finance/controller/FinancingLoanTypeController.java:12-14` 映射 `/api/financing`
    - `backend/finance/src/main/java/com/example/finance/controller/FarmerFinancingController.java:17-19` 映射 `/api/farmer/financing`
    - `backend/finance/src/main/java/com/example/finance/controller/BankFinancingController.java:19-22` 映射 `/api/bank/financing`
    - 基础路径为 `http://localhost:8082/finance`，前端需使用 `http://localhost:8082/finance/api/...`。

## 发现的匹配关系与问题
- 认证：前端应调用 `BASES.AUTH + '/auth/login'` 与 `BASES.AUTH + '/users/me'`，与后端 `/api/auth/login`、`/api/users/me` 完全匹配。
- 市场：前端 `BASES.MARKET` 追加 `/market/products`、`/cart`、`/orders`、`/buyer/orders/{id}/confirm-receipt`，与后端 `/api/...` 路由匹配（`backend/market/index.js:28-43`）。
- 社区：前端 `BASES.COMMUNITY` 追加 `/content` 等，与后端 `/api/community/...` 匹配（`backend/community/index.js:67-73`）。
- 金融：前端 `BASES.FINANCE` 追加 `/financing/loan-types`、`/farmer/financing/applications`、`/bank/financing/applications`，与后端控制器映射匹配。
- 额外问题：曾出现 `3010/api%20/auth/login` 的 `%20`，为环境变量尾部空格导致。需要在 `http.ts` 的 base 解析中 `trim()`，并确保注入的 `VITE_*` 无空格。

## 修复与验证计划
1. 前端修正认证模块：
   - 确保 `marketLogin` 使用 `BASES.AUTH + '/auth/login'`；`marketMe` 使用 `BASES.AUTH + '/users/me'`。
   - 在 `store/auth.tsx` 兼容后端登录响应的 `data.user` 或 `data.user_info` 字段。
2. 基础地址健壮性：
   - 在 `http.ts` 的 `getBase` 对环境变量做 `trim()`，防止 `%20`。
   - 检查并清理启动脚本中 `VITE_*` 值的空格。
3. 端到端验证：
   - 启动四个后端与前端；通过浏览器网络面板验证：
     - 登录：`http://localhost:3020/api/auth/login` OPTIONS/POST 通过；随后 `http://localhost:3020/api/users/me` GET 通过。
     - 市场：`http://localhost:3010/api/market/products`、`http://localhost:3010/api/cart`、`http://localhost:3010/api/orders`。
     - 社区：`http://localhost:3030/api/community/content`。
     - 金融：`http://localhost:8082/finance/api/financing/loan-types`。
4. 如遇 404/路径不符：
   - 逐一对照前端路径与后端 router/controller 映射；必要时统一前端路径或后端挂载路径（优先前端适配）。

## 结果交付
- 输出一份“前后端 API 路径匹配清单”，列出各服务基础地址与关键接口的对应关系。
- 完成前端小幅修正（`http.ts` trim、认证两处路径与响应兼容）并复测。

请确认以上计划，我将直接执行修正与端到端验证。